import {lazy} from '@alexandreannic/ts-utils'
import {KoboSdk, UUID} from '@infoportal-common'
import {PrismaClient} from '@prisma/client'
import {appConf} from '../../core/conf/AppConf'
import {app} from '../../index'

export class KoboSdkGenerator {

  constructor(
    private pgClient: PrismaClient,
    private conf = appConf,
    private log = app.logger('KoboSdkGenerator')
  ) {
  }

  readonly get = lazy(async (koboServerId?: UUID): Promise<KoboSdk> => {
    this.log.info(`Get KoboSdk for server ${koboServerId} (default: ${this.conf.kobo.dbDefaultServerId})`)
    const k = await this.pgClient.koboServer.findFirstOrThrow({where: {id: koboServerId ?? this.conf.kobo.dbDefaultServerId}})
      .catch(() => this.pgClient.koboServer.findFirstOrThrow())
    return new KoboSdk({
      urlv1: k.urlV1 + '/api',
      urlv2: k.url + '/api',
      token: k.token,
    })
  })
}