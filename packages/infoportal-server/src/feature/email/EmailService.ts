import {EmailClient} from './EmailClient.js'
import {app} from '../../index.js'
import {PrismaClient} from '@prisma/client'
import {FormService} from '../form/FormService.js'

export enum EmailContext {
  Kobo = 'Kobo',
}

export class EmailService {
  constructor(
    private prisma = new PrismaClient(),
    private form = new FormService(prisma),
    private event = app.event,
    private emailHelper = new EmailClient(prisma),
    private log = app.logger('EmailService'),
  ) {}

  initializeListeners() {
    this.log.info(`Start listening to Email triggers.`)
    // this.event.listen(IpEvent.KOBO_ANSWER_EDITED_FROM_KOBO, this.sendEmailIfTriggered)
    // this.event.listen(IpEvent.KOBO_ANSWER_EDITED_FROM_IP, this.sendEmailIfTriggered)
    // this.event.listen(IpEvent.SUBMISSION_NEW, this.sendEmailIfTriggered)
  }

  // readonly sendEmailIfTriggered = async (p: IpEventParams.KoboAnswerEdited) => {
  //   const schema = await this.form.getSchema({formId: p.formId})
  //   if (!schema) {
  //     this.log.info(`[sendEmailIfTriggered] Missing ${p.formId}`)
  //     return
  //   }
  //   const toSend_names = Obj.keys(p.answer).filter(_ => _.startsWith(KoboCustomDirective.make('TRIGGER_EMAIL')))
  //   const toSend_questions = schema.survey.filter(_ => toSend_names.includes(_.name))
  //   await Promise.all(toSend_questions.map(_ => this.sendByQuestion(_, p)))
  // }

  // private readonly sendByQuestion = async (question: Kobo.Form.Question, p: IpEventParams.KoboAnswerEdited) => {
  //   const html = question.hint?.[0]
  //   const subject = question.label?.[0]
  //   if (!html || !subject) {
  //     this.log.error(`Missing hint or label in directive ${KoboCustomDirective.Name.TRIGGER_EMAIL} of form ${p.formId}`)
  //   } else {
  //     const answer = (p.answer[question.name] as string) ?? ''
  //     const toEmails = seq(answer.replaceAll(/\s+/g, ' ').split(' '))
  //       .distinct(_ => _)
  //       .filter(_ => Regexp.get.email.test(_))
  //
  //     if (toEmails.length === 0) {
  //       this.log.info(`No valid emails found for question ${question.name} in form ${p.formId}`)
  //       return
  //     }
  //
  //     await this.emailHelper.send({
  //       to: toEmails,
  //       context: EmailContext.Kobo,
  //       html: this.setVariables(html, p.answer),
  //       subject: this.setVariables(subject, p.answer),
  //       tags: {formId: p.formId},
  //     })
  //   }
  // }

  private readonly setVariables = (html: string, variables: Record<string, string>) => {
    return html.replace(/\$\{(\w+)}/g, (_, key) => {
      return key in variables ? variables[key] : `\${${key}}`
    })
  }
}
