import {FormSubmission, Prisma, PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {FormService} from './form/FormService.js'
import {duration, fnSwitch, Seq, seq} from '@axanc/ts-utils'
import {app} from '../index.js'
import {UserService} from './user/UserService.js'

type Filters = {
  workspaceId: Ip.WorkspaceId
  start?: Date
  end?: Date
  user: Ip.User
}
type FiltersForm = Filters & {
  formIds?: Ip.FormId[]
}

export class MetricsService {
  constructor(
    private prisma: PrismaClient,
    private user = UserService.getInstance(prisma),
    private form = new FormService(prisma),
  ) {}

  private readonly getAllowedFormIds = app.cache.request({
    key: 'allowedFormIds',
    ttlMs: duration(1, 'minute'),
    fn: (props: {workspaceId: Ip.WorkspaceId; user: Ip.User}): Promise<Seq<Ip.FormId>> => {
      return this.form.getByUser(props).then(_ => seq(_).map(_ => _.id))
    },
  })

  readonly usersByDate = async ({workspaceId, start, end, user}: Filters): Promise<Ip.Metrics.CountUserByDate> => {
    const whereConditions = [
      start ? Prisma.sql`"WorkspaceAccess"."createdAt" >= ${start}` : null,
      end ? Prisma.sql`"User"."createdAt" <= ${end}` : null,
      Prisma.sql`"WorkspaceAccess"."workspaceId" = ${workspaceId}::uuid`,
    ].filter(Boolean)
    const whereClause =
      whereConditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereConditions, ` AND `)}` : Prisma.sql``

    return this.prisma.$queryRaw<Ip.Metrics.CountUserByDate>`
      SELECT TO_CHAR("WorkspaceAccess"."createdAt", 'YYYY-MM') AS "date",
             COUNT(*)                                             FILTER (
      WHERE "User"."createdAt" IS NOT NULL
        AND TO_CHAR("WorkspaceAccess"."createdAt", 'YYYY-MM') = TO_CHAR("User"."createdAt", 'YYYY-MM')
    ) AS "countCreatedAt", COUNT(*) FILTER (
      WHERE "User"."lastConnectedAt" IS NOT NULL
        AND TO_CHAR("WorkspaceAccess"."createdAt", 'YYYY-MM') = TO_CHAR("User"."lastConnectedAt", 'YYYY-MM')
    ) AS "countLastConnectedCount"
      FROM "User"
             JOIN "WorkspaceAccess" ON "WorkspaceAccess"."userId" = "User"."id" ${whereClause}
      GROUP BY "date"
      ORDER BY "date"
    `.then(rows =>
      rows.map(row => ({
        date: row.date,
        countCreatedAt: Number(row.countCreatedAt),
        countLastConnectedCount: Number(row.countLastConnectedCount),
      })),
    )
  }

  readonly submissionsBy = async (props: FiltersForm & {type: Ip.Metrics.ByType}): Promise<Ip.Metrics.CountByKey> => {
    const {type, workspaceId, start, end, formIds} = props
    const allowedFormIds = await this.getAllowedFormIds(props).then(_ =>
      formIds && formIds.length > 0 && type !== 'form' ? seq(_).intersect(formIds) : _,
    )
    if (type === 'month') return this.submissionsByMonth(props)
    else if (type === 'category') return this.submissionsByCategory(props)
    const dbColumn: keyof FormSubmission = fnSwitch(type, {
      form: 'formId',
      user: 'submittedBy',
      status: 'validationStatus',
      location: 'isoCode',
    })
    return this.prisma.formSubmission
      .groupBy({
        by: [dbColumn],
        _count: {
          _all: true,
        },
        where: {
          formId: {in: allowedFormIds},
          isoCode: dbColumn === 'isoCode' ? {not: null} : undefined,
          deletedAt: null,
          submissionTime: {gte: start, lte: end},
        },
        orderBy: {
          _count: {
            [dbColumn]: 'desc',
          },
        },
      })
      .then(_ => {
        return _.map(res => ({
          key: res[dbColumn]!,
          count: Number(res._count._all),
        }))
      })
  }

  readonly submissionsByCategory = async (props: FiltersForm): Promise<Ip.Metrics.CountByKey> => {
    const [byForm, formsMap] = await Promise.all([
      this.submissionsBy({...props, type: 'form'}),
      this.form.getByUser(props).then(_ => seq(_).groupByFirstToMap(_ => _.id)),
    ])
    return byForm.map(_ => {
      return {
        key: formsMap.get(_.key as Ip.FormId)?.category ?? '',
        count: _.count,
      }
    })
  }

  readonly submissionsByMonth = async ({
    workspaceId,
    start,
    end,
    formIds,
    user,
  }: FiltersForm): Promise<Ip.Metrics.CountByKey> => {
    const allowedFormIds = await this.getAllowedFormIds({workspaceId, user}).then(_ =>
      formIds && formIds.length > 0 ? seq(_).intersect(formIds) : _,
    )
    if (allowedFormIds.length === 0) return []
    const whereConditions = [
      allowedFormIds ? Prisma.sql`"formId" IN ( ${Prisma.join(allowedFormIds!)} )` : null,
      Prisma.sql`"deletedAt" IS NULL`,
      start ? Prisma.sql`"submissionTime" >= ${start}` : null,
      end ? Prisma.sql`"submissionTime" <= ${end}` : null,
    ].filter(Boolean)

    const whereClause =
      whereConditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereConditions, ` AND `)}` : Prisma.sql``

    return this.prisma.$queryRaw<Ip.Metrics.CountByKey>`
      SELECT TO_CHAR("submissionTime", 'YYYY-MM') AS key, COUNT(*) AS count
      FROM "FormSubmission"
        ${whereClause}
      GROUP BY key
      ORDER BY key;
    `.then(_ => _.map(_ => ({..._, count: Number(_.count)})))
  }
}
