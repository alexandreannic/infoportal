import {GlobalEvent} from '../../core/GlobalEvent.js'
import {EmailClient} from './EmailClient.js'
import {KoboCustomDirective, Regexp} from 'infoportal-common'
import {app} from '../../index.js'
import {UserService} from '../user/UserService.js'
import {PrismaClient} from '@prisma/client'
import {FrontEndSiteMap} from '../../core/FrontEndSiteMap.js'
import {appConf} from '../../core/conf/AppConf.js'
import {KoboService} from '../kobo/KoboService.js'
import {Obj, seq} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'

export enum EmailContext {
  Cfm = 'Cfm',
  Kobo = 'Kobo',
}

export class EmailService {
  constructor(
    private prisma = new PrismaClient(),
    private conf = appConf,
    private users = UserService.getInstance(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private emailHelper = new EmailClient(prisma),
    private siteMap = new FrontEndSiteMap(),
    private koboService = new KoboService(prisma),
    private log = app.logger('EmailService'),
  ) {}

  initializeListeners() {
    this.log.info(`Start listening to Email triggers.`)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_EDITED_FROM_KOBO, this.sendEmailIfTriggered)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_EDITED_FROM_IP, this.sendEmailIfTriggered)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_NEW, this.sendEmailIfTriggered)
  }

  readonly sendEmailIfTriggered = async (p: GlobalEvent.KoboAnswerEditedParams) => {
    const schema = await this.koboService.getSchema({formId: p.formId})
    const toSend_names = Obj.keys(p.answer).filter(_ => _.startsWith(KoboCustomDirective.make('TRIGGER_EMAIL')))
    const toSend_questions = schema.content.survey.filter(_ => toSend_names.includes(_.name))
    await Promise.all(toSend_questions.map(_ => this.sendByQuestion(_, p)))
  }

  private readonly sendByQuestion = async (question: Kobo.Form.Question, p: GlobalEvent.KoboAnswerEditedParams) => {
    const html = question.hint?.[0]
    const subject = question.label?.[0]
    if (!html || !subject) {
      this.log.error(`Missing hint or label in directive ${KoboCustomDirective.Name.TRIGGER_EMAIL} of form ${p.formId}`)
    } else {
      const answer = (p.answer[question.name] as string) ?? ''
      const toEmails = seq(answer.replaceAll(/\s+/g, ' ').split(' '))
        .distinct(_ => _)
        .filter(_ => Regexp.get.email.test(_))

      if (toEmails.length === 0) {
        this.log.info(`No valid emails found for question ${question.name} in form ${p.formId}`)
        return
      }

      await this.emailHelper.send({
        to: toEmails,
        context: EmailContext.Kobo,
        html: this.setVariables(html, p.answer),
        subject: this.setVariables(subject, p.answer),
        tags: {formId: p.formId},
      })
    }
  }

  private readonly setVariables = (html: string, variables: Record<string, string>) => {
    return html.replace(/\$\{(\w+)}/g, (_, key) => {
      return key in variables ? variables[key] : `\${${key}}`
    })
  }
}
