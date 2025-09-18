import {app, AppCacheKey} from '../../index.js'
import {duration} from '@axanc/ts-utils'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {Kobo} from 'kobo-sdk'
import {PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from '../kobo/KoboSdkGenerator.js'

export class KoboSchemaCache {
  private constructor(
    private prisma: PrismaClient,
    private koboSdk = KoboSdkGenerator.getSingleton(prisma),
  ) {}

  private static instance: KoboSchemaCache | null
  static readonly getInstance = (prisma: PrismaClient) => {
    if (!this.instance) this.instance = new KoboSchemaCache(prisma)
    return this.instance
  }

  readonly get = app.cache.request({
    key: AppCacheKey.KoboSchema,
    genIndex: _ => _.formId,
    ttlMs: duration(2, 'day').toMs,
    fn: async ({formId}: {formId: Ip.FormId}): Promise<Kobo.Form> => {
      const [sdk, koboId] = await Promise.all([
        this.koboSdk.getBy.formId(formId),
        this.prisma.formKoboInfo.findUnique({select: {koboId: true}, where: {formId}}).then(_ => _?.koboId),
      ])
      if (!koboId || !sdk) throw new HttpError.NotFound()
      return sdk.v2.form.get({formId: koboId, use$autonameAsName: true})
    },
  })
}
