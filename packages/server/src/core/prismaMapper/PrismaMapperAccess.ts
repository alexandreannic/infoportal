import {Ip} from '@infoportal/api-sdk'

type Bytes = Uint8Array<ArrayBufferLike>

export const mapGroupItem = <T extends Record<keyof Ip.Group.Item, any>>(_: T): Ip.Group.Item => _ as any

export const mapGroup = <T extends Record<keyof Ip.Group, any>>(
  _: T,
): Ip.Group & {
  workspaceId: Ip.WorkspaceId
  id: Ip.GroupId
  items: Ip.Group.Item[]
} => _ as any

export const mapUser = <
  T extends {
    id: string
    email: string
    lastConnectedAt: Date | null
    name: string | null
    location: string | null
    job: string | null
    avatar?: Bytes | null
  },
>(
  _: T,
): T & {
  id: Ip.UserId
  email: Ip.User.Email
  lastConnectedAt?: Date
  name?: string
  location?: string
  job?: string
  avatar?: Bytes
} => _ as any

export const mapAccess = <T extends {id: string; filters: any}>(
  _: T,
): T & {id: Ip.AccessId; filters: Record<string, any>} => _ as any
