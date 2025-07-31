import {FormSubmission, Prisma, PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {FormService} from './form/FormService.js'
import {duration, fnSwitch, Seq, seq} from '@axanc/ts-utils'
import {app} from '../index.js'

type Filters = {
  workspaceId: Ip.WorkspaceId
  start?: Date
  end?: Date
  formIds?: Ip.FormId[]
  user: Ip.User
}

export class MetricsService {
  constructor(
    private prisma: PrismaClient,
    private form = new FormService(prisma),
  ) {}

  private readonly getAllowedFormIds = app.cache.request({
    key: 'allowedFormIds',
    ttlMs: duration(1, 'hour'),
    fn: (props: {workspaceId: Ip.WorkspaceId; user: Ip.User}): Promise<Seq<Ip.FormId>> => {
      return this.form.getByUser(props).then(_ => seq(_).map(_ => _.id))
    },
  })

  readonly submissionsBy = async (props: Filters & {type: Ip.Metrics.ByType}): Promise<Ip.Metrics.CountByKey> => {
    const {type, workspaceId, start, end, formIds} = props
    const allowedFormIds = await this.getAllowedFormIds(props).then(_ => (formIds ? seq(_).intersect(formIds) : _))
    if (type === 'month') return this.submissionsByMonth(props)
    else if (type === 'category') return this.submissionsByCategory(props)
    const dbColumn: keyof FormSubmission = fnSwitch(type, {
      form: 'formId',
      user: 'submittedBy',
      status: 'validationStatus',
    })
    return this.prisma.formSubmission
      .groupBy({
        by: [dbColumn],
        _count: {
          _all: true,
        },
        where: {
          formId: {in: allowedFormIds},
          form: {
            is: {
              workspaceId,
            },
          },
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

  readonly submissionsByCategory = async (props: Filters): Promise<Ip.Metrics.CountByKey> => {
    const [byForm, formsMap] = await Promise.all([
      this.submissionsBy({...props, type: 'form'}),
      this.form.getByUser(props).then(_ => seq(_).groupByFirstToMap(_ => _.id)),
    ])
    return byForm.map(_ => {
      return {
        key: formsMap.get(_.key as Ip.FormId)?.category ?? '???',
        count: _.count,
      }
    })
  }

  readonly submissionsByMonth = async ({workspaceId, start, end, formIds}: Filters): Promise<Ip.Metrics.CountByKey> => {
    if (!formIds) {
      formIds = await this.prisma.form
        .findMany({select: {id: true}, where: {workspaceId}})
        .then(_ => _.map(_ => _.id as Ip.FormId))
    }
    const whereConditions = [
      Prisma.sql`"formId" IN ( ${Prisma.join(formIds!)} )`,
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
