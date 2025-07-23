import {Logger as WinstonLogger} from 'winston'

export type Logger = WinstonLogger

export type ReplaceNullWithUndefined<T> = {
  [K in keyof T]: Exclude<T[K], null> | Extract<T[K], null> extends never ? undefined : Exclude<T[K], null> | undefined
}
