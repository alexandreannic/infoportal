import {appConf} from './conf/AppConf.js'
import {Kobo} from 'kobo-sdk'

export class FrontEndSiteMap {
  constructor(private baseUrl = appConf.frontEndBaseUrl) {}
}
