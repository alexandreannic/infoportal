import {duration, Duration, filterUndefined, hashArgs, Obj} from '@axanc/ts-utils'
import {Logger} from '../types.js'

export interface IpCacheData<V> {
  lastUpdate: Date
  expiration?: number
  value: V
}

export interface IpCacheParams {
  ttlMs?: number
  cleaningCheckupInterval?: Duration
}

export class IpCacheApp<Key extends string = string> {
  constructor(
    private cache: IpCache<Record<string, any>>,
    private log: Logger,
  ) {
    // setInterval(() => {
    //   console.log(this.cache.getAllKeys().map(k =>
    //     (this.cache.get(k)?.getAllKeys() ?? []).map(k2 =>
    //       ({k, k2, value: JSON.stringify(this.cache.get(k)?.get(k2))?.length / 1000})
    //     )
    //   ))
    // }, 2000)
  }

  readonly getAll = () => this.cache

  readonly get = (key: Key) => this.cache.get(key)

  readonly request = <T, P extends Array<any>>({
    key,
    fn,
    cacheIf,
    genIndex,
    ...params
  }: IpCacheParams & {
    key: Key
    fn: (...p: P) => Promise<T>
    cacheIf?: (...p: P) => boolean
    genIndex?: (...p: P) => string
  }): ((...p: P) => Promise<T>) => {
    this.log.info(`Initialize cache ${key}.`)
    if (!this.cache.has(key)) {
      this.log.info(`Cache for ${key} not found. Initializing new cache.`)
      //   throw new Error(`Already registered cash ` + key)
      // TODO Is called twice by some black magic
      this.cache.set(key, {})
    }
    const getCache = () => {
      if (!this.cache.get(key)) this.cache.set(key, {})
      return this.cache.get(key)
    }
    return async (...p: P) => {
      if (cacheIf && !cacheIf?.(...p)) return fn(...p)
      const index = genIndex ? genIndex(...p) : hashArgs(p)
      const cache = getCache()
      if (!cache) {
        this.log.error(`Cannot retrieved cache for ${key}.`)
      }
      const cachedValue = (cache ?? {})[index]
      if (cachedValue === undefined) {
        const value = await fn(...p)
        if (cache) {
          cache[index] = value
        }
        return value
      }
      return cachedValue
    }
  }

  readonly set = ({key, subKey, value}: {key: Key; subKey?: string; value: any}) => {
    this.log.info(`Set cache ${key} ${subKey ? '/' + subKey : ''}`)
    if (subKey) {
      if (!this.cache.get(key)) this.cache.set(key, {})
      const subCache = this.cache.get(key)!
      subCache.set(subKey, value)
    } else {
      this.cache.set(key, value)
    }
  }

  readonly clear = (key: Key, subKey?: string) => {
    this.log.info(`Reset cache ${key} ${subKey}.`)
    if (subKey && this.cache.get(key)) delete this.cache.get(key)![subKey]
    else this.cache.remove(key)
  }
}

export class IpCache<V = undefined> {
  /** @deprecated prefer to use GlobalCache for this app */
  static readonly request = <T, P extends Array<any>>(
    fn: (...p: P) => Promise<T>,
    params?: IpCacheParams,
  ): ((...p: P) => Promise<T>) => {
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

  constructor({ttlMs = duration(1, 'hour'), cleaningCheckupInterval = duration(2, 'day')}: IpCacheParams = {}) {
    this.ttlMs = ttlMs
    this.cleaningCheckupIntervalMs = cleaningCheckupInterval
    this.intervalRef = setInterval(this.cleanCheckup, cleaningCheckupInterval)
  }

  private readonly ttlMs: number

  private readonly cleaningCheckupIntervalMs: number

  private readonly intervalRef

  private cache: Map<string, IpCacheData<V>> = new Map()

  private readonly isExpired = (_: IpCacheData<V>) =>
    _.expiration && _.lastUpdate.getTime() + _.expiration < new Date().getTime()

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
    return filterUndefined(Array.from(this.cache.values()).map((_) => _.value)) as any
  }

  readonly getAllKeys = (): string[] => {
    this.cleanCheckup()
    return Array.from(this.cache.keys())
  }

  readonly getInfo = () => {
    this.cleanCheckup()
    return Obj.mapValues(Object.fromEntries(this.cache), (v) => {
      if (typeof v.value === 'object') {
        return {
          ...v,
          value: Obj.mapValues(v.value as any, (v2) => {
            try {
              const canStringfy = JSON.stringify(v2)
              return v2
            } catch (e) {
              return 'Cannot stringify'
            }
          }),
        }
      }
      return v
    })
    // return seq(this.getAllKeys()).reduceObject(key => {
    //   console.log('-----', this.cache.get(key))
    //   const x = this.cache.get(key)
    //   return [
    //     key,
    //     {
    //       ...this.cache.get(key),
    //       value: Obj.mapValues(this.cache.get(key)?.value!, _ => Object.fromEntries(_))
    //     }
    //   ]
    // })
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
    this.cache.forEach((data: IpCacheData<V>, key: string) => {
      if (this.isExpired(data)) {
        this.remove(key)
      }
    })
  }
}
