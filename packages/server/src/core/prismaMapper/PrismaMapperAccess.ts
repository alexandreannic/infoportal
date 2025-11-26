import {Api} from '@infoportal/api-sdk'

type Bytes = Uint8Array<ArrayBufferLike>

export const mapGroupItem = <T extends Record<keyof Api.Group.Item, any>>(_: T): Api.Group.Item => _ as any

export const mapGroup = <T extends Record<keyof Api.Group, any>>(
  _: T,
): Api.Group & {
  workspaceId: Api.WorkspaceId
  id: Api.GroupId
  items: Api.Group.Item[]
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
  id: Api.UserId
  email: Api.User.Email
  lastConnectedAt?: Date
  name?: string
  location?: string
  job?: string
  avatar?: Bytes
} => _ as any

export const mapAccess = <T extends {id: string; filters: any}>(
  _: T,
): T & {id: Api.AccessId; filters: Record<string, any>} => _ as any
