import {duration, seq} from '@alexandreannic/ts-utils'
import {KoboServer, PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../index'
import {AppError} from '../../helper/Errors'
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
    private log = app.logger('KoboSdkGenerator')
  ) {
  }

  readonly getServerBy = (() => {
    const id = async (koboServerId: UUID): Promise<KoboServer> => {
      return this.prisma.koboServer.findFirstOrThrow({where: {id: koboServerId}})
        .catch(() => this.prisma.koboServer.findFirstOrThrow())
    }
    const formId = async (formId: UUID): Promise<KoboServer> => {
      return this.getServerId(formId).then(id)
    }
    return {formId, id}
  })()

  readonly getBy = {
    formId: async (formId: Kobo.FormId): Promise<KoboClient> => {
      return this.getServerId(formId).then(this.getBy.serverId)
    },
    serverId: app.cache.request({
      key: AppCacheKey.KoboClient,
      ttlMs: duration(7, 'day'),
      genIndex: _ => _,
      fn: async (serverId: UUID): Promise<KoboClient> => {
        this.log.info(`Rebuilding KoboClient form server ${serverId}`)
        const server = await this.getServerBy.id(serverId)
        return this.buildSdk(server)
      }
    })
  }

  private readonly getServerIndex = app.cache.request({
    key: AppCacheKey.KoboServerIndex,
    ttlMs: duration(7, 'day'),
    fn: async (): Promise<Record<Kobo.FormId, UUID>> => {
      return this.prisma.koboForm.findMany({
        select: {id: true, serverId: true,}
      }).then(_ => {
        this.log.info(`Recalculate server index`)
        return seq(_).groupByAndApply(_ => _.id, _ => _[0].serverId)
      })
    }
  })

  private readonly getServerId = async (formId: Kobo.FormId): Promise<UUID> => {
    return await this.getServerIndex()
      .then(_ => _[formId])
      .then(AppError.throwNotFoundIfUndefined(`No serverId for form ${formId}`))
  }

  private readonly buildSdk = (server: KoboServer): KoboClient => {
    return new KoboClient({
      urlv1: server.urlV1 + '/api/v1',
      urlv2: server.url + '/api',
      token: server.token,
      log: app.logger('KoboClient'),
    })
  }
}