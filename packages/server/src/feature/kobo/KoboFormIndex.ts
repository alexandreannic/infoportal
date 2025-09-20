import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../index.js'
import {duration, seq} from '@axanc/ts-utils'

export class KoboFormIndex {
  static instance: KoboFormIndex | null = null
  static readonly getSingleton = (prisma: PrismaClient) => {
    if (!this.instance) this.instance = new KoboFormIndex(prisma)
    return this.instance
  }

  private constructor(
    private prisma: PrismaClient,
    private log = app.logger('KoboAccountIndex'),
  ) {}

  private readonly getFormsIndex = app.cache.request({
    key: AppCacheKey.KoboFormIndex,
    ttlMs: duration(7, 'day'),
    fn: async (): Promise<Record<Ip.FormId, Kobo.FormId>> => {
      return this.prisma.formKoboInfo
        .findMany({
          select: {koboId: true, formId: true},
        })
        .then(_ => {
          this.log.info(`Recalculate form index`)
          return seq(_)
            .compactBy('formId')
            .groupByAndApply(
              _ => _.formId,
              _ => _[0].koboId,
            )
        })
    },
  })

  getByFormId = async (formId: Ip.FormId): Promise<Kobo.FormId | undefined> => {
    const index = await this.getFormsIndex()
    console.log('index', formId, index)
    return index[formId]
  }
}
