import {PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../../../index.js'
import {IpEvent} from 'infoportal-common'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {FormActionService} from '../FormActionService.js'
import {SubmissionService} from '../../submission/SubmissionService.js'
import {FormActionRunningReportManager} from './FormActionRunningReportManager.js'
import {FormActionErrorHandler} from './FormActionErrorHandler.js'
import {Worker} from '@infoportal/action-compiler'
import {chunkify, seq} from '@axanc/ts-utils'
import {PromisePool} from '@supercharge/promise-pool'
import {appConf} from '../../../../core/conf/AppConf.js'

export class FormActionRunner {
  private liveReport = FormActionRunningReportManager.getInstance(this.prisma)
  private errorHandler = new FormActionErrorHandler(this.prisma, app.logger('FormActionError'))

  constructor(
    private prisma: PrismaClient,
    private action = new FormActionService(prisma),
    private submission = new SubmissionService(prisma),
    private event = app.event,
    private log = app.logger('FormActionTriggerService'),
    private conf = appConf,
  ) {}

  readonly startListening = () => {
    this.log.info('Listening to Form Actions.')
    this.event.listen(IpEvent.SUBMISSION_NEW, _ => {
      this.runActionsByTriggeredForm(_).catch(e => this.errorHandler.handle(e, {formId: _.formId}))
    })
  }

  private findActions = app.cache.request({
    key: AppCacheKey.FormAction,
    genIndex: _ => _,
    fn: async (formId: Ip.FormId) => {
      return this.prisma.formAction.findMany({where: {targetFormId: formId}}).then(_ => _.map(Ip.Form.Action.map))
    },
  })

  readonly runAllActionByForm = async ({
    workspaceId,
    formId,
    startedBy,
  }: {
    startedBy: Ip.User.Email
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
  }): Promise<Ip.Form.Action.Report> => {
    if (this.liveReport.has(formId)) {
      throw new HttpError.Conflict(`An execution is already running for ${formId}`)
    }

    const form = await this.prisma.form.findUnique({
      where: {id: formId},
      select: {workspaceId: true, type: true},
    })
    if (!form) {
      throw new HttpError.NotFound(`Form ${formId} not found`)
    }
    if (form.workspaceId !== workspaceId) {
      throw new HttpError.Forbidden(`Form ${formId} doesn't belong to Workspace ${workspaceId}`)
    }
    if (form.type !== 'smart') {
      throw new HttpError.BadRequest(`Cannot run actions on non-smart form ${formId}`)
    }

    await this.prisma.formSubmission.deleteMany({where: {formId}})

    const actions = await this.action.getActivesByForm({formId})
    this.liveReport.start(formId, actions.length, startedBy)
    this.log.info(`Executing ${formId}: ${actions.length} actions...`)
    try {
      await PromisePool.withConcurrency(1)
        .for(actions)
        .process(async action => {
          const submissions = await this.submission.searchAnswers({workspaceId, formId: action.targetFormId})
          this.log.info(
            `Executing ${formId}: Action ${action.id}: ${submissions.total} submissions from Form ${action.targetFormId}`,
          )
          await this.runActionOnSubmission({workspaceId, formId, action, submissions: submissions.data})
          this.liveReport.update(formId, prev => ({
            actionExecuted: prev.actionExecuted + 1,
          }))
        })
      return await this.liveReport.finalize(formId)
    } catch (e) {
      await this.errorHandler.handle(e, {formId})
      return await this.liveReport.finalize(formId, (e as Error).message)
    }
  }

  private readonly runActionsByTriggeredForm = async ({
    formId,
    submission,
    workspaceId,
  }: {
    workspaceId: Ip.WorkspaceId
    submission: Ip.Submission
    formId: Ip.FormId
  }) => {
    const actions = await this.findActions(formId)
    this.log.info(`Run ${actions.length} actions for ${formId}.`)
    return Promise.all(
      actions
        .filter(a => !!a.body)
        .map(action => this.runActionOnSubmission({workspaceId, action, formId, submissions: [submission]})),
    )
  }

  private readonly runActionOnSubmission = async ({
    workspaceId,
    action,
    submissions,
    formId,
  }: {
    formId: Ip.FormId
    workspaceId: Ip.WorkspaceId
    action: Ip.Form.Action
    submissions: Ip.Submission[]
  }) => {
    if (!action.body || action.disabled) return

    if (action.type === 'insert') {
      const worker = new Worker()
      try {
        const jsCode = worker.transpile(action.body).outputText

        const results = await PromisePool.withConcurrency(1000)
          .for(submissions)
          .process(async s => {
            const res = await worker.run(jsCode, s)
            if (res.error) {
              throw new HttpError.BadRequest(`Failed to run action ${action.id} on submission ${s.id}`)
            }
            return {output: res.result, submissionId: s.id}
          })
        if (results.errors.length > 0) throw new HttpError.InternalServerError(JSON.stringify(results.errors))

        const data = seq(results.results)
          .compactBy('output')
          .flatMap(r => [r.output].flat().map(output => ({output, submissionId: r.submissionId})))
          .get()

        await chunkify({
          data,
          concurrency: 1,
          size: this.conf.db.maxPreparedStatementParams,
          fn: async data => {
            await this.submission.createMany({
              skipDuplicates: false,
              data: data.map(d => ({
                id: SubmissionService.genId(),
                originId: d.submissionId,
                uuid: '',
                attachments: [],
                submissionTime: new Date(),
                formId: action.formId,
                answers: d.output,
              })),
            })
            this.liveReport.update(formId, prev => ({
              submissionsExecuted: prev.submissionsExecuted + data.length,
            }))
          },
        })
      } catch (e) {
        await this.errorHandler.handle(e, {actionId: action.id})
      }
    }
  }
}
