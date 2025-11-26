import {PrismaClient} from '@prisma/client'
import {HttpError, Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../../../core/prismaMapper/PrismaMapper.js'

type LiveReport = Omit<Api.Form.Action.Report, 'id'>

export class FormActionRunningReportManager {
  private liveReportMap = new Map<Api.FormId, LiveReport>()

  private constructor(private prisma: PrismaClient) {}

  private static instance: FormActionRunningReportManager
  static readonly getInstance = (prisma: PrismaClient) => {
    if (!FormActionRunningReportManager.instance)
      FormActionRunningReportManager.instance = new FormActionRunningReportManager(prisma)
    return FormActionRunningReportManager.instance
  }

  has(formId: Api.FormId) {
    return this.liveReportMap.has(formId)
  }

  start(formId: Api.FormId, totalActions: number, startedBy: Api.User.Email) {
    this.liveReportMap.set(formId, {
      formId,
      startedAt: new Date(),
      totalActions,
      actionExecuted: 0,
      submissionsExecuted: 0,
      startedBy,
      endedAt: null,
      failed: null,
    })
  }

  update(formId: Api.FormId, update: (r: LiveReport) => Partial<LiveReport>) {
    const current = this.liveReportMap.get(formId)
    if (!current) return
    this.liveReportMap.set(formId, {...current, ...update(current)})
  }

  async finalize(formId: Api.FormId, failed?: string) {
    const report = this.liveReportMap.get(formId)
    if (!report) throw new HttpError.InternalServerError(`Failed to fetch execution report.`)
    this.liveReportMap.delete(formId)
    return this.prisma.formActionReport
      .create({
        data: {...report, endedAt: new Date(), failed: failed ?? null},
      })
      .then(prismaMapper.form.mapFormActionReport)
  }

  get(formId: Api.FormId): Api.Form.Action.Report | undefined {
    const liveReport = this.liveReportMap.get(formId)
    if (!liveReport) return
    return {
      id: '<TMP>' as any,
      ...liveReport,
    }
  }
}
