import {PrismaClient} from '@prisma/client'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../../../core/PrismaHelper.js'

type LiveReport = Omit<Ip.Form.Action.ExecReport, 'id'>

export class FormActionLiveReportManager {
  private liveReportMap = new Map<Ip.FormId, LiveReport>()

  private constructor(private prisma: PrismaClient) {}

  private static instance: FormActionLiveReportManager
  static readonly getInstance = (prisma: PrismaClient) => {
    if (!FormActionLiveReportManager.instance)
      FormActionLiveReportManager.instance = new FormActionLiveReportManager(prisma)
    return FormActionLiveReportManager.instance
  }

  has(formId: Ip.FormId) {
    return this.liveReportMap.has(formId)
  }

  start(formId: Ip.FormId, totalActions: number, startedBy: Ip.User.Email) {
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

  update(formId: Ip.FormId, update: (r: LiveReport) => Partial<LiveReport>) {
    const current = this.liveReportMap.get(formId)
    if (!current) return
    this.liveReportMap.set(formId, {...current, ...update(current)})
  }

  async finalize(formId: Ip.FormId, failed?: string) {
    const report = this.liveReportMap.get(formId)
    if (!report) throw new HttpError.InternalServerError(`Failed to fetch execution report.`)
    this.liveReportMap.delete(formId)
    return this.prisma.formActionExecReport
      .create({
        data: {...report, endedAt: new Date(), failed: failed ?? null},
      })
      .then(PrismaHelper.mapFormActionReport)
  }

  get(formId: Ip.FormId): Ip.Form.Action.ExecReport | undefined {
    const liveReport = this.liveReportMap.get(formId)
    if (!liveReport) return
    return {
      id: '<TMP>' as any,
      ...liveReport,
    }
  }
}
