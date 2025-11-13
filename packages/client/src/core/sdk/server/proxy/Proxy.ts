import {UUID} from 'infoportal-common'
import {AppConfig} from '@/conf/AppConfig'
import {Ip} from '@infoportal/api-sdk'

export interface Proxy {
  id: UUID
  createdAt: Date
  expireAt?: Date
  createdBy?: Ip.User.Email
  name: string
  slug: string
  url: string
  disabled: boolean
}

export class Proxy {
  static readonly map = (_: any): Proxy => {
    return {
      ..._,
      createdAt: new Date(_.createdAt),
      expireAt: _.expireAt ? new Date(_.expireAt) : undefined,
      disabled: !!_.disabled,
    }
  }

  static readonly makeUrl = ({proxy, appConfig}: {proxy: Pick<Proxy, 'slug'>; appConfig: AppConfig}) => {
    return appConfig.apiURL + '/proxy/' + proxy.slug
  }
}
