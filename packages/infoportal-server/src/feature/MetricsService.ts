import {Prisma, PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {FormService} from './form/FormService.js'
import {seq} from '@axanc/ts-utils'

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

  private getUsers = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    return this.prisma.user.groupBy({
      where: {workspaceAccess: {some: {workspaceId}}},
      by: ['id'],
      _count: {id: true},
    })
  }

  // readonly getCount = async (props: Filters): Promise<Ip.Metrics.Count> => {
  //   const {workspaceId, start, end, formIds} = props
  //   const forms = await this.form.getByUser(props)
  //   const [users, submissions] = await Promise.all([
  //     this.prisma.user.count({where: {workspaceAccess: {some: {workspaceId}}}}),
  //     this.prisma.formSubmission.count({where: {submissionTime: {gte: start, lte: end},formId: {in: forms.map(_ => _.id)}}}),
  //   ])
  //   return {forms: forms.length, users, submissions}
  // }

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

  readonly submissionByUser = async ({
    workspaceId,
    start,
    end,
    formIds,
  }: Filters): Promise<Ip.Metrics.CountBy<'user'>> => {
    return this.prisma.formSubmission
      .groupBy({
        by: ['submittedBy'],
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
          deletedAt: null,
          submissionTime: {gte: start, lte: end},
        },
      })
      .then(_ =>
        _.map(({submittedBy, _count}) => ({
          user: submittedBy ?? '',
          count: Number(_count._all),
        })),
      )
  }

  readonly submissionByCategory = async (props: Filters): Promise<Ip.Metrics.CountBy<'category'>> => {
    const [byForm, formsMap] = await Promise.all([
      this.submissionByForm(props),
      this.form.getByUser(props).then(_ => seq(_).groupByFirstToMap(_ => _.id)),
    ])
    return byForm.map(_ => {
      return {
        category: formsMap.get(_.formId as Ip.FormId)?.category ?? '???',
        count: _.count,
      }
    })
  }

  readonly submissionByStatus = async ({
    start,
    workspaceId,
    end,
    formIds,
    user,
  }: Filters): Promise<Ip.Metrics.CountBy<'status'>> => {
    return this.prisma.formSubmission
      .groupBy({
        by: ['validationStatus'],
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
          deletedAt: null,
          submissionTime: {gte: start, lte: end},
        },
      })
      .then(_ =>
        _.map(({validationStatus, _count}) => ({
          status: validationStatus ?? '',
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
