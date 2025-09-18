import {PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../index.js'
import {Kobo} from 'kobo-sdk'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {duration, seq} from '@axanc/ts-utils'

export class KoboAccountIndex {
  private constructor(
    private prisma: PrismaClient,
    private log = app.logger('KoboAccountIndex'),
  ) {}

  static instance: KoboAccountIndex | null = null
  static readonly getSingleton = (prisma: PrismaClient) => {
    if (!this.instance) this.instance = new KoboAccountIndex(prisma)
    return this.instance
  }

  private readonly getHot = async (): Promise<Record<Kobo.FormId, Ip.ServerId>> => {
    return this.prisma.formKoboInfo
      .findMany({
        select: {koboId: true, accountId: true},
      })
      .then(_ => {
        this.log.info(`Recalculate server index`)
        return seq(_)
          .compactBy('accountId')
          .groupByAndApply(
            _ => _.koboId,
            _ => _[0].accountId as Ip.ServerId,
          )
      })
  }

  private readonly getCached = app.cache.request({
    key: AppCacheKey.KoboServerIndex,
    ttlMs: duration(7, 'day'),
    fn: this.getHot,
  })

  readonly getByKoboId = async (koboFormId: Kobo.FormId): Promise<Ip.ServerId> => {
    const cache = await this.getCached()
    if (cache[koboFormId]) return cache[koboFormId]
    const hot = await this.getHot()
    if (hot[koboFormId]) {
      app.cache.clear(AppCacheKey.KoboServerIndex)
      return hot[koboFormId]
    }
    throw new HttpError.NotFound(`No serverId for form ${koboFormId}`)
  }
}