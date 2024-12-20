import {GlobalEvent} from '../../core/GlobalEvent'
import {EmailClient} from './EmailClient'
import {getKoboCustomDirectives, KoboCustomDirectives, KoboIndex, Regexp} from 'infoportal-common'
import {app} from '../../index'
import {UserService} from '../user/UserService'
import {PrismaClient} from '@prisma/client'
import {FrontEndSiteMap} from '../../core/FrontEndSiteMap'
import {appConf} from '../../core/conf/AppConf'
import {KoboService} from '../kobo/KoboService'
import {seq} from '@alexandreannic/ts-utils'

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
    private emailHelper = new EmailClient(),
    private siteMap = new FrontEndSiteMap(),
    private koboService = new KoboService(prisma),
    private log = app.logger('EmailService'),
  ) {
  }

  initializeListeners() {
    this.log.info(`Start listening to Email triggers.`)
    this.event.listen(GlobalEvent.Event.KOBO_TAG_EDITED, this.handleTagEdited)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_EDITED_FROM_KOBO, this.sendEmailIfTriggered)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_EDITED_FROM_IP, this.sendEmailIfTriggered)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_NEW, this.sendEmailIfTriggered)
  }

  readonly sendEmailIfTriggered = async (p: GlobalEvent.KoboAnswerEditedParams) => {
    const schema = await this.koboService.getSchema({formId: p.formId})
    const {question} = getKoboCustomDirectives(schema).find(_ => _.directive.startsWith('TRIGGER_EMAIL')) ?? {}
    if (!question) return
    if (!question.name || !p.answer[question.name]) return
    const html = question.hint?.[0]
    const subject = question.label?.[0]
    if (!html || !subject) {
      this.log.error(`Missing hint or label in directive ${KoboCustomDirectives.TRIGGER_EMAIL} of form ${KoboIndex.searchById(p.formId) ?? p.formId}`)
    } else {
      await this.emailHelper.send({
        to: seq((p.answer[question.name] as string).replaceAll(/\s+/g, ' ').split(' '))
          .distinct(_ => _)
          .filter(_ => Regexp.get.email.test(_)),
        context: EmailContext.Kobo,
        html: this.setVariables(html, p.answer),
        subject: this.setVariables(subject, p.answer),
        tags: {formId: p.formId}
      })
    }
  }

  private readonly setVariables = (html: string, variables: Record<string, string>) => {
    return html.replace(/\$\{(\w+)}/g, (_, key) => {
      return key in variables ? variables[key] : `\${${key}}`
    })
  }

  private handleTagEdited = async (params: GlobalEvent.KoboTagEditedParams) => {
    const {formId, answerIds, tags} = params

    if (this.isCfmForm(formId) && tags.focalPointEmail) {
      await this.sendCfmNotification(tags.focalPointEmail, formId, answerIds)
    }
  }

  private isCfmForm(formId: string): boolean {
    const cfmFormIds = [
      KoboIndex.byName('meal_cfmInternal').id,
      KoboIndex.byName('meal_cfmExternal').id,
    ]
    return cfmFormIds.includes(formId)
  }

  private async sendCfmNotification(email: string, formId: string, answerIds: string[]) {
    try {
      for (const answerId of answerIds) {
        const link = this.siteMap.openCfmEntry(formId, answerId)
        const userName = await this.users.getUserByEmail(email).then(_ => _?.name)
        await this.emailHelper.send({
          context: EmailContext.Cfm,
          to: email,
          subject: 'New CFM Request!',
          html: `
            Hello ${userName ?? ''},<br/><br/>
            A new CFM request has been assigned to you as the focal point in InfoPortal.<br/>
            <i>This email is an automatic notification sent from InfoPortal.</i>
            <br/>   
            <a href="${link}">Link to request</a>
            <br/><br/> 
            Thank you!
          `
        })
        this.log.info(`sendCfmNotification sent to ${email} for form ${formId} and answer ${answerId}`)
      }
    } catch (error) {
      this.log.error(`Failed to send email to ${email} for form ${formId} and answers ${answerIds.join(', ')}`, error)
    }
  }
}
