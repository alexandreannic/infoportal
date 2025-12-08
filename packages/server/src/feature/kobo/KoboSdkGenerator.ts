import {duration} from '@axanc/ts-utils'
import {KoboAccount, PrismaClient} from '@infoportal/prisma'
import {app, AppCacheKey} from '../../index.js'
import {Api} from '@infoportal/api-sdk'
import {Kobo, KoboClient} from 'kobo-sdk'
import {KoboAccountIndex} from './KoboAccountIndex.js'
import {KoboFormIndex} from './KoboFormIndex.js'

export class KoboSdkGenerator {
  static instance: KoboSdkGenerator | null = null

  static readonly getSingleton = (prisma: PrismaClient) => {
    if (!this.instance) {
      this.instance = new KoboSdkGenerator(prisma)
    }
    return this.instance
  }

  private constructor(
    private prisma: PrismaClient,
    private koboFormIndex = KoboFormIndex.getSingleton(prisma),
    private koboAccountIndex = KoboAccountIndex.getSingleton(prisma),
    private log = app.logger('KoboSdkGenerator'),
  ) {}

  readonly getServerBy = (() => {
    const id = async (koboAccountId: Api.Kobo.AccountId): Promise<KoboAccount> => {
      return this.prisma.koboAccount
        .findFirstOrThrow({where: {id: koboAccountId}})
        .catch(() => this.prisma.koboAccount.findFirstOrThrow())
    }
    const formId = async (formId: Kobo.FormId): Promise<KoboAccount> => {
      return this.getAccountId(formId).then(id)
    }
    return {formId, id}
  })()

  readonly getBy = {
    formId: async (formId: Api.FormId): Promise<KoboClient | undefined> => {
      const koboFormId = await this.koboFormIndex.getByFormId(formId)
      if (!koboFormId) return
      return this.getBy.koboFormId(koboFormId)
    },
    koboFormId: async (formId: Kobo.FormId): Promise<KoboClient> => {
      return this.getAccountId(formId).then(this.getBy.accountId)
    },
    accountId: app.cache.request({
      key: AppCacheKey.KoboClient,
      ttlMs: duration(7, 'day'),
      genIndex: _ => _ as string,
      fn: async (serverId: Api.Kobo.AccountId): Promise<KoboClient> => {
        this.log.info(`Rebuilding KoboClient form server ${serverId}`)
        const server = await this.getServerBy.id(serverId)
        return this.buildSdk(server)
      },
    }),
  }

  private readonly getAccountId = async (koboId: Kobo.FormId): Promise<Api.Kobo.AccountId> => {
    return this.koboAccountIndex.getByKoboId(koboId)
  }

  private readonly buildSdk = (server: KoboAccount): KoboClient => {
    return new KoboClient({
      urlv1: server.urlV1 ?? '<TBD - Only used to submit into a form>',
      urlv2: server.url,
      token: server.token,
      log: app.logger('KoboClient'),
    })
  }
}
