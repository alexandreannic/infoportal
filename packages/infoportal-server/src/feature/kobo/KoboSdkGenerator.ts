import {duration, seq} from '@axanc/ts-utils'
import {KoboServer, PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../index.js'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {UUID} from 'infoportal-common'
import {Kobo, KoboClient} from 'kobo-sdk'

export class KoboSdkGenerator {
  static instance: KoboSdkGenerator | null = null

  static readonly getSingleton = (pgClient: PrismaClient) => {
    if (!this.instance) {
      this.instance = new KoboSdkGenerator(pgClient)
    }
    return this.instance
  }

  private constructor(
    private prisma: PrismaClient,
    private log = app.logger('KoboSdkGenerator'),
  ) {}

  readonly getServerBy = (() => {
    const id = async (koboServerId: Ip.ServerId): Promise<KoboServer> => {
      return this.prisma.koboServer
        .findFirstOrThrow({where: {id: koboServerId}})
        .catch(() => this.prisma.koboServer.findFirstOrThrow())
    }
    const formId = async (formId: Kobo.FormId): Promise<KoboServer> => {
      return this.getServerId(formId).then(id)
    }
    return {formId, id}
  })()

  readonly getBy = {
    formId: async (formId: Ip.FormId): Promise<KoboClient | undefined> => {
      const index = await this.getFormsIndex()
      if (!index[formId]) return
      return this.getBy.koboFormId(index[formId])
    },
    koboFormId: async (formId: Kobo.FormId): Promise<KoboClient> => {
      return this.getServerId(formId).then(this.getBy.accountId)
    },
    accountId: app.cache.request({
      key: AppCacheKey.KoboClient,
      ttlMs: duration(7, 'day'),
      genIndex: _ => _ as string,
      fn: async (serverId: Ip.ServerId): Promise<KoboClient> => {
        this.log.info(`Rebuilding KoboClient form server ${serverId}`)
        const server = await this.getServerBy.id(serverId)
        return this.buildSdk(server)
      },
    }),
  }

  private readonly getServerIndex = app.cache.request({
    key: AppCacheKey.KoboServerIndex,
    ttlMs: duration(7, 'day'),
    fn: async (): Promise<Record<Kobo.FormId, Ip.ServerId>> => {
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
    },
  })

  private readonly getFormsIndex = app.cache.request({
    key: AppCacheKey.KoboServerIndex,
    ttlMs: duration(7, 'day'),
    fn: async (): Promise<Record<Ip.FormId, Kobo.FormId>> => {
      return this.prisma.formKoboInfo
        .findMany({
          select: {koboId: true, formId: true},
        })
        .then(_ => {
          this.log.info(`Recalculate server index`)
          return seq(_)
            .compactBy('formId')
            .groupByAndApply(
              _ => _.formId,
              _ => _[0].koboId,
            )
        })
    },
  })

  private readonly getServerId = async (formId: Kobo.FormId): Promise<Ip.ServerId> => {
    return await this.getServerIndex()
      .then(_ => _[formId])
      .then(HttpError.throwNotFoundIfUndefined(`No serverId for form ${formId}`))
  }

  private readonly buildSdk = (server: KoboServer): KoboClient => {
    return new KoboClient({
      urlv1: server.urlV1 ?? '<TBD - Only used to submit into a form>',
      urlv2: server.url,
      token: server.token,
      log: app.logger('KoboClient'),
    })
  }
}
