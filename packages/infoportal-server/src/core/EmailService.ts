import {GlobalEvent} from './GlobalEvent'
import {EmailHelper} from './EmailHelper'
import {KoboIndex} from 'infoportal-common'
import {app} from '../index'
import {UserService} from '../feature/user/UserService'
import {PrismaClient} from '@prisma/client'
import {FrontEndSiteMap} from './FrontEndSiteMap'
import {appConf} from './conf/AppConf'

export enum EmailContext {
  Cfm = 'Cfm',
}

export class EmailService {

  constructor(
    private prisma = new PrismaClient(),
    private conf = appConf,
    private users = UserService.getInstance(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private emailHelper = new EmailHelper(),
    private siteMap = new FrontEndSiteMap(),
    private log = app.logger('EmailService'),
  ) {
  }

  initializeListeners() {
    this.log.info(`Start listening to KOBO_TAG_EDITED`)
    this.event.listen(GlobalEvent.Event.KOBO_TAG_EDITED, this.handleTagEdited)
    this.event.listen(GlobalEvent.Event.KOBO_ANSWER_EDITED_FROM_KOBO, console.log)
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
