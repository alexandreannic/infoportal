import {KoboClient} from 'kobo-sdk'
import {appConf} from './appConf'
import winston from 'winston'

export const koboSdk = new KoboClient({
  urlv1: appConf.kobo.urlV1 + '/api/v1',
  urlv2: appConf.kobo.url + '/api',
  token: appConf.kobo.token,
  log: winston.createLogger(),
});

(async () => {
  // await ActivityInfoBuildType.fslc()
  //await new BuildKoboType().build('ecrec_vet_bha388')
  // await new BuildKoboType().build('partner_lampa')
  // await new BuildKoboType().build('ecrec_vet2_dmfa')
})()
