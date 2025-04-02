import {Prisma, PrismaClient} from '@prisma/client'
import {yup} from '../../helper/Utils.js'
import {InferType} from 'yup'
import {UUID} from 'infoportal-common'
import {app, AppCacheKey} from '../../index.js'
import {duration} from '@axanc/ts-utils'
import {Request} from 'express'

const clearCache = <T>(t: T): T => {
  app.cache.clear(AppCacheKey.Proxy)
  return t
}

export class ProxyService {
  constructor(
    private prisma: PrismaClient,
    private log = app.logger('ProxyService'),
  ) {}

  static readonly schema = {
    create: yup
      .object({
        name: yup.string().required(),
        slug: yup.string().required(),
        url: yup.string().required(),
        expireAt: yup.date().optional(),
        createdBy: yup.string().optional(),
      })
      .required(),
    update: yup.object({
      name: yup.string().optional(),
      slug: yup.string().optional(),
      url: yup.string().optional(),
      expireAt: yup.date().optional(),
      disabled: yup.boolean().optional(),
    }),
    id: yup.object({
      id: yup.string().required(),
    }),
    redirect: yup.object({
      slug: yup.string().required(),
    }),
  }

  readonly create = (body: InferType<typeof ProxyService.schema.create>) => {
    return this.prisma.proxy.create({data: body}).then(clearCache)
  }

  readonly update = (id: UUID, body: InferType<typeof ProxyService.schema.update>) => {
    return this.prisma.proxy.update({where: {id}, data: body}).then(clearCache)
  }

  readonly delete = (id: UUID) => {
    return this.prisma.proxy.delete({where: {id}}).then(clearCache)
  }

  readonly search: () => Promise<Prisma.ProxyGetPayload<{}>[]> = app.cache.request({
    key: AppCacheKey.Proxy,
    ttlMs: duration(7, 'day'),
    fn: async (): Promise<Prisma.ProxyGetPayload<{}>[]> => {
      this.log.info(`Rebuild cage.`)
      return this.prisma.proxy.findMany()
    },
  })

  static readonly isEnabled = (p: Prisma.ProxyGetPayload<{}>) => {
    return !p.disabled && (!p.expireAt || p.expireAt.getTime() > new Date().getTime())
  }

  readonly redirect = async ({slug, ipAddresses}: {slug: string; ipAddresses: string[]}) => {
    const data = await this.search()
    const match = data.find((_) => _.slug === slug)
    if (match && ProxyService.isEnabled(match)) {
      this.prisma.proxyUsage.create({
        data: {
          ipAddresses,
          proxy: {
            connect: {
              slug: slug,
            },
          },
        },
      })
      return match.url
    }
  }
}
