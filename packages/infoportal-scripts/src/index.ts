import {KoboClient} from 'kobo-sdk'
import {appConf} from './appConf'
import winston from 'winston'
import {ActivityInfoBuildType} from './ai/BuildTypeActivityInfo'
import {KoboIndex} from 'infoportal-common'

export const koboSdk = new KoboClient({
  urlv1: appConf.kobo.urlV1 + '/api/v1',
  urlv2: appConf.kobo.url + '/api',
  token: appConf.kobo.token,
  log: winston.createLogger(),
});

(async () => {
  const res = await koboSdk.v2.getXml('apn6HTbCJgwzrrGAywJdp2')
  console.log(res)
  // await ActivityInfoBuildType.snfi()
// await new BuildKoboType().build('partner_misto_syly')
  // await ActivityInfoBuildType.fslc()
  // await new BuildKoboType().build('ecrec_msme_bha388')
  // await new BuildKoboType().build('ecrec_vet2_dmfa')
})()
