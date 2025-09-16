import {PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../../index.js'
import {IpEvent} from 'infoportal-common'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {FormActionService} from './FormActionService.js'
import {Worker} from '@infoportal/action-compiler'
import {seq} from '@axanc/ts-utils'
import {SubmissionService} from '../submission/SubmissionService.js'
import {genUUID} from '../../../helper/Utils.js'

export class FormActionTriggerService {
  constructor(
    private prisma: PrismaClient,
    private action = new FormActionService(prisma),
    private submission = new SubmissionService(prisma),
    private event = app.event,
    private log = app.logger('FormActionTriggerService'),
  ) {}

  readonly startListening = () => {
    this.log.info('Listening to Form Actions.')
    // this.event.listen(IpEvent.SUBMISSION_EDITED, _ => {
    //   _.answer
    // })
    this.event.listen(IpEvent.SUBMISSION_NEW, _ => {
      this.runActionsByTriggeredForm(_).catch(console.log)
    })
  }

  private findActions = app.cache.request({
    key: AppCacheKey.FormAction,
    genIndex: _ => _,
    fn: async (formId: Ip.FormId) => {
      return this.prisma.formAction.findMany({where: {targetFormId: formId}}).then(_ => _.map(Ip.Form.Action.map))
    },
  })

  private executionMap = new Map<Ip.FormId, Omit<Ip.Form.Action.ExecReport, 'id'>>()

  private updateExecutionMap = (
    formId: Ip.FormId,
    set: (_: Omit<Ip.Form.Action.ExecReport, 'id'>) => Omit<Ip.Form.Action.ExecReport, 'id'>,
  ) => {
    const current = this.executionMap.get(formId)!
    this.executionMap.set(formId, {...current, ...set(current)})
  }

  readonly runAllActionByForm = async ({
    workspaceId,
    formId,
  }: {
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
  }): Promise<Ip.Form.Action.ExecReport> => {
    if (this.executionMap.has(formId)) {
      throw new HttpError.Conflict(`An execution is already running for ${formId}`)
    }
    const form = await this.prisma.form.findFirst({where: {id: formId}, select: {workspaceId: true, type: true}})
    if (!form) {
      throw new HttpError.NotFound(`Form ${formId} not found`)
    }
    if (form.workspaceId !== workspaceId) {
      throw new HttpError.Forbidden(`Form ${formId} doesn't belong to Workspace ${workspaceId}`)
    }
    if (form.type !== 'smart') {
      throw new HttpError.BadRequest(`Cannot run actions on form ${formId}, since it is not a Smart Form`)
    }
    await this.prisma.formSubmission.deleteMany({
      where: {formId},
    })
    const actions = await this.action.getActivesByForm({formId})
    this.executionMap.set(formId, {
      startedAt: new Date(),
      totalActions: actions.length,
      actionExecuted: 0,
      submissionsExecuted: 0,
      endedAt: null,
      failed: null,
    })
    try {
      for (let action of actions) {
        const submissions = await this.submission.searchAnswers({workspaceId, formId: action.targetFormId})
        this.log.debug(`Found ${submissions.total} submissions in form ${action.targetFormId}`)
        await this.runActionOnSubmission({workspaceId, action, submissions: submissions.data})
        this.updateExecutionMap(formId, prev => ({
          ...prev,
          actionExecuted: prev.actionExecuted + 1,
          submissionsExecuted: prev.submissionsExecuted + 1,
        }))
      }
    } catch (e: any) {
      return this.prisma.formActionExecReport.create({
        data: {
          ...this.executionMap.get(formId)!,
          endedAt: new Date(),
          failed: (e as Error).message,
        },
      })
    }
    return this.prisma.formActionExecReport.create({
      data: {
        ...this.executionMap.get(formId)!,
        endedAt: new Date(),
      },
    })
  }

  private readonly runActionOnSubmission = async ({
    workspaceId,
    action,
    submissions,
  }: {
    workspaceId: Ip.WorkspaceId
    action: Ip.Form.Action
    submissions: Ip.Submission[]
  }) => {
    if (!action.body || action.disabled) return
    if (action.type === 'insert') {
      try {
        const worker = new Worker()
        const jsCode = worker.transpile(action.body).outputText
        const res = await Promise.all(
          submissions.map(async _ => {
            const res = await worker.run(jsCode, _)
            if (res.error) {
              await this.prisma.formActionLog.create({
                data: {
                  type: 'error',
                  actionId: action.id,
                  title: res.stack?.split(':')?.[0] ?? 'VMError',
                  details: res.error,
                  submission: _,
                },
              })
              throw new HttpError.BadRequest(`Failed to run action ${action.id} on submission ${_.id}.`)
            }
            return {output: res.result, submissionId: _.id}
          }),
        )
        const data = seq(res)
          .compactBy('output')
          .flatMap(_1 => [_1.output].flat().map(output => ({output, submissionId: _1.submissionId})))
          .get()
        return this.submission.createMany({
          // A small Smart database collecting only age and gender can have legit duplicates
          skipDuplicates: false,
          data: data.map(_ => ({
            id: SubmissionService.genId(),
            originId: _.submissionId,
            uuid: '',
            attachments: [],
            submissionTime: new Date(),
            formId: action.formId,
            answers: _.output,
          })),
        })
      } catch (e) {
        await this.prisma.formActionLog.create({
          data: {
            type: 'error',
            actionId: action.id,
            title: (e as Error).name,
            details: (e as Error).message,
          },
        })
      }
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
      seq(actions)
        .compactBy('body')
        .map(async action => {
          return this.runActionOnSubmission({workspaceId, action, submissions: [submission]})
        }),
    )
  }
}
