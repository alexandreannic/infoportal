import {PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from './KoboSdkGenerator'
import {app, AppLogger} from '../../index'
import {KoboAnswerParams, KoboSdk} from '@infoportal-common'

export class KoboApiService {

  constructor(
    private prisma: PrismaClient,
    private koboSdkGenerator: KoboSdkGenerator = new KoboSdkGenerator(prisma),
    private log: AppLogger = app.logger('KoboApiService')
  ) {
  }

  readonly constructSdk = (serverId: string): Promise<KoboSdk> => this.koboSdkGenerator.get(serverId)

  readonly fetchAnswers = async (serverId: string, formId: string, params: KoboAnswerParams = {}) => {
    const sdk = await this.koboSdkGenerator.get(serverId)
    return sdk.v2.getAnswers(formId, params)
  }
}
