import type * as Prisma from '@prisma/client'

export type NullToOptional<T> = {
  // keep required keys (no null)
  [K in keyof T as null extends T[K] ? never : K]: T[K] extends object ? NullToOptional<T[K]> : T[K]
} & {
  // make nullable keys optional, remove null from their type
  [K in keyof T as null extends T[K] ? K : never]?: Exclude<T[K], null> extends object
    ? NullToOptional<Exclude<T[K], null>>
    : Exclude<T[K], null>
}

export type Brand<K, T> = K & {
  /** @deprecated Should never be used: compile-time only trick to distinguish different ID types. */
  __brand: T
}

export enum StateStatus {
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
  disabled = 'disabled',
}

export type BulkResponse<ID extends string> = {id: ID; status: 'success'}[]

export type Uuid = Brand<string, 'Uuid'>

export type Geolocation = [number, number]

export type Period = {
  start: Date
  end: Date
}

export type Pagination = {
  offset?: number
  limit?: number
}

export type Paginate<T> = {
  total: number
  data: T[]
}

export type AccessLevel = Prisma.AccessLevel
export const AccessLevel = {
  Read: 'Read',
  Write: 'Write',
  Admin: 'Admin',
} as const
