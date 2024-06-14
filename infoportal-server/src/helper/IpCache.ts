import {duration, Duration, filterUndefined, hashArgs} from '@alexandreannic/ts-utils'
import {AppLogger} from '../index'

export interface CacheData<V> {
  lastUpdate: Date;
  expiration?: number;
  value: V;
}

export interface CacheParams {
  ttlMs?: number,
  cleaningCheckupInterval?: Duration,
}

export enum SytemCache {
  Meta = 'Meta',
  KoboAnswers = 'KoboAnswers',
  WfpDeduplication = 'WfpDeduplication',
}

export class GlobalCache {

  constructor(
    private cache: IpCache<IpCache<any>>,
    private log: AppLogger,
  ) {
    // setInterval(() => {
    //   console.log(this.cache.getAllKeys().map(k =>
    //     (this.cache.get(k)?.getAllKeys() ?? []).map(k2 =>
    //       ({k, k2, value: JSON.stringify(this.cache.get(k)?.get(k2))?.length / 1000})
    //     )
    //   ))
    // }, 2000)
  }

  readonly request = <T, P extends Array<any>>({
    key,
    fn,
    cacheIf,
    genIndex,
    ...params
  }: CacheParams & {
    key: SytemCache,
    fn: (...p: P) => Promise<T>,
    cacheIf?: (...p: P) => boolean,
    genIndex?: (...p: P) => string
  }): (...p: P) => Promise<T> => {
    this.log.info(`Initialize cache ${key}.`)
    if (!this.cache.has(key)) {
      this.log.info(`Cache for ${key} not found. Initializing new cache.`)
      //   throw new Error(`Already registered cash ` + key)
      // TODO Is called twice by some black magic
      this.cache.set(key, new IpCache(params))
    }
    const getCache = () => {
      if (!this.cache.get(key)) this.cache.set(key, new IpCache(params))
      return this.cache.get(key)
    }
    return async (...p: P) => {
      if (!cacheIf?.(...p)) return fn(...p)
      const index = genIndex ? genIndex(...p) : hashArgs(p)
      const cache = getCache()
      if (!cache) {
        this.log.error(`Cannot retrieved cache for ${key}.`)
      }
      const cachedValue = cache?.get(index)
      if (cachedValue === undefined) {
        const value = await fn(...p)
        if (cache) cache.set(index, value)
        return value
      }
      return cachedValue
    }
  }

  readonly clear = (key: SytemCache, subKey?: string) => {
    this.log.info(`Reset cache ${key} ${subKey}.`)
    if (subKey) this.cache.get(key)?.remove(subKey)
    else this.cache.remove(key)
  }
}

export class IpCache<V = undefined> {

  /** @deprecated prefer to use GlobalCache for this app */
  static readonly request = <T, P extends Array<any>>(fn: ((...p: P) => Promise<T>), params?: CacheParams): (...p: P) => Promise<T> => {
    const cache = new IpCache(params)
    return async (...p: P) => {
      const argsHashed = hashArgs(p)
      const cachedValue = cache.get(argsHashed)
      if (cachedValue === undefined) {
        const value = await fn(...p)
        cache.set(argsHashed, value)
        return value
      }
      return cachedValue
    }
  }

  constructor({
    ttlMs = duration(1, 'hour'),
    cleaningCheckupInterval = duration(2, 'day'),
  }: CacheParams = {}) {
    this.ttlMs = ttlMs
    this.cleaningCheckupIntervalMs = cleaningCheckupInterval
    this.intervalRef = setInterval(this.cleanCheckup, cleaningCheckupInterval)
  }

  private readonly ttlMs: number

  private readonly cleaningCheckupIntervalMs: number

  private readonly intervalRef

  private cache: Map<string, CacheData<V>> = new Map()

  private readonly isExpired = (_: CacheData<V>) => _.expiration && _.lastUpdate.getTime() + _.expiration < new Date().getTime()

  readonly get = <T = any>(key: string): undefined | (V extends undefined ? T : V) => {
    const data = this.cache.get(key)
    if (data) {
      if (this.isExpired(data)) {
        this.remove(key)
      } else {
        return data.value as any
      }
    }
  }

  readonly getAll = (): (V extends undefined ? any : V)[] => {
    this.cleanCheckup()
    return filterUndefined(Array.from(this.cache.values()).map(_ => _.value)) as any
  }

  readonly getAllKeys = (): string[] => {
    this.cleanCheckup()
    return Array.from(this.cache.keys())
  }

  readonly set = <T = any>(key: string, value: V extends undefined ? T : V, ttlMs?: number): void => {
    this.cache.set(key, {
      // @ts-ignore
      value,
      expiration: ttlMs || this.ttlMs,
      lastUpdate: new Date(),
    })
  }

  readonly has = (key: string): boolean => this.cache.has(key)

  readonly remove = (key: string): void => {
    this.cache.delete(key)
  }

  readonly removeAll = (): void => {
    this.cache = new Map()
  }

  private cleanCheckup = () => {
    this.cache.forEach((data: CacheData<V>, key: string) => {
      if (this.isExpired(data)) {
        this.remove(key)
      }
    })
  }
}
