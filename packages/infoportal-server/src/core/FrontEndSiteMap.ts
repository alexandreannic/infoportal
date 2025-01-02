import {appConf} from './conf/AppConf'
import {Kobo} from 'kobo-sdk'

export class FrontEndSiteMap {
  constructor(private baseUrl = appConf.frontEndBaseUrl) {
  }

  openCfmEntry(formId: Kobo.FormId, answerId: string) {
    return this.baseUrl + `/cfm#/entry/${formId}/${answerId}`
  }
}
