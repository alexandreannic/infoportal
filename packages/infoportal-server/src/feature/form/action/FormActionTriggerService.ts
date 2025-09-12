import {PrismaClient} from '@prisma/client'
import {app} from '../../../index.js'
import {IpEvent} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'
import {FormActionService} from './FormActionService.js'
import {Worker} from '@infoportal/action-compiler'
import {seq} from '@axanc/ts-utils'
import {SubmissionService} from '../submission/SubmissionService.js'

export class FormActionTriggerService {
  private constructor(
    private prisma: PrismaClient,
    private action = new FormActionService(prisma),
    private submission = new SubmissionService(prisma),
    private event = app.event,
    private log = app.logger('FormActionTriggerService'),
  ) {
    this.log.info('Listening to Form Actions.')
    // this.event.listen(IpEvent.SUBMISSION_EDITED, _ => {
    //   _.answer
    // })
    this.event.listen(IpEvent.SUBMISSION_NEW, _ => {
      this.runActions(_).catch(console.log)
    })
  }

  private static instance: FormActionTriggerService | null = null

  static readonly startListening = (
    prisma: PrismaClient,
    action = new FormActionService(prisma),
    submission = new SubmissionService(prisma),
    event = app.event,
    log = app.logger('FormActionTriggerService'),
  ) => {
    if (!this.instance) {
      this.instance = new FormActionTriggerService(prisma, action, submission, event, log)
    }
    return this.instance
  }

  private findActions = app.cache.request({
    key: 'actions',
    fn: async (formId: Ip.FormId) => {
      return this.prisma.formAction.findMany({where: {targetFormId: formId}})
    },
  })

  private readonly runActions = async ({
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
          if (action.type === 'insert') {
            const worker = new Worker()
            const jsCode = worker.compile(action.body)
            const res = await worker.run(jsCode, submission)
            if (res.success) {
              if (Array.isArray(res.result))
                return this.submission.createMany(
                  res.result.map(_ => ({
                    id: SubmissionService.genId(),
                    originId: submission.id,
                    uuid: '',
                    attachments: [],
                    submissionTime: new Date(),
                    formId: action.formId,
                    answers: _,
                  })),
                )
              else
                return this.submission.create({
                  workspaceId,
                  data: {
                    id: SubmissionService.genId(),
                    originId: submission.id,
                    uuid: '',
                    attachments: [],
                    submissionTime: new Date(),
                    formId: action.formId,
                    answers: res.result as any,
                  },
                })
            }
            console.log({jsCode, res})
          }
        }),
    )
  }
}
