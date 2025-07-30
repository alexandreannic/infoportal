import {Prisma, PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {FormService} from './form/FormService.js'

type Filters = {
  workspaceId: Ip.WorkspaceId
  start?: Date
  end?: Date
  formIds?: Ip.FormId[]
}

export class MetricsService {
  constructor(
    private prisma: PrismaClient,
    private form = new FormService(prisma),
  ) {}

  private getUsers = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    return this.prisma.user.groupBy({
      where: {workspaceAccess: {some: {workspaceId}}},
      by: ['id'],
      _count: {id: true},
    })
  }

  readonly submissionByForm = async ({
    workspaceId,
    start,
    end,
    formIds,
  }: Filters): Promise<Ip.Metrics.CountBy<'formId'>> => {
    return this.prisma.formSubmission
      .groupBy({
        by: ['formId'],
        _count: {
          _all: true,
        },
        where: {
          formId: {in: formIds},
          form: {
            is: {
              workspaceId,
            },
          },
          // form: {workspaceId},
          deletedAt: null,
          submissionTime: {gte: start, lte: end},
        },
      })
      .then(_ =>
        _.map(({formId, _count}) => ({
          formId,
          count: Number(_count._all),
        })),
      )
  }

  readonly submissionsByMonth = async ({
    workspaceId,
    start,
    end,
    formIds,
  }: Filters): Promise<Ip.Metrics.CountBy<'date'>> => {
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

    return this.prisma.$queryRaw<Ip.Metrics.CountBy<'date'>>`
      SELECT TO_CHAR("submissionTime", 'YYYY-MM') AS date, COUNT(*) AS count
      FROM "FormSubmission"
        ${whereClause}
      GROUP BY date
      ORDER BY date;
    `.then(_ => _.map(_ => ({..._, count: Number(_.count)})))
  }
}
