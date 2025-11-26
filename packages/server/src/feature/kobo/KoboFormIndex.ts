import {Kobo} from 'kobo-sdk'
import {HttpError, Api} from '@infoportal/api-sdk'
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

  private readonly getCache = app.cache.request({
    key: AppCacheKey.KoboFormIndex,
    ttlMs: duration(7, 'day'),
    fn: async (): Promise<Record<Api.FormId, Kobo.FormId>> => {
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

  readonly getByFormId = async (formId: Api.FormId): Promise<Kobo.FormId | undefined> => {
    const cache = await this.getCache()
    if (cache[formId]) return cache[formId]
    app.cache.clear(AppCacheKey.KoboFormIndex)
    const fresh = await this.getCache()
    if (fresh[formId]) return cache[formId]
    throw new HttpError.BadRequest(`Cannot find ${formId} either in cache or database.`)
  }
}
