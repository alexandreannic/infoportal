import {app, AppLogger} from '../index'
import {map} from '@alexandreannic/ts-utils'

export interface MemoryDatabaseInterface<T, TID> {
  update: (id: TID, setValue: (prev: T) => T) => Promise<T> | undefined
  refresh: () => Promise<T[]>
  warmUp: () => Promise<T[]>
  get: () => Promise<T[]>
  clear: () => void
}

export class MemoryDatabase {

  private constructor(
    private log: AppLogger = app.logger('MpcaCachedDb')
  ) {
  }

  private static instance: MemoryDatabase
  static readonly getCache = () => {
    if (!MemoryDatabase.instance) MemoryDatabase.instance = new MemoryDatabase()
    return MemoryDatabase.instance
  }

  private cache = new Map<string, Promise<any>>()
  private index = new Map<string, Map<string, number> | undefined>()

  readonly register = <T, TID extends string = string>(params: {
    name: string
    fetch: () => Promise<T[]>
    getId: (_: T) => TID | TID[]
  }): MemoryDatabaseInterface<T, TID> => {

    const build = async () => {
      this.log.info(`Rebuild '${params.name} memory database...`)
      const res$ = params.fetch()
      this.cache.set(params.name, res$)
      const index = new Map<string, number>()
      ;(await res$).forEach((d, i) => {
        [params.getId(d)].flatMap(_ => _).forEach(id => {
          if (index.has(id)) throw new Error(`Why ${params.getId(d)} ${id} exists twice?`)
          index.set(id, i)
        })
      })
      this.index.set(params.name, index)
      this.log.info(`Rebuild '${params.name} memory database... Completed!`)
      return res$
    }

    return {
      update: (id: TID, setValue: (prev: T) => T): Promise<T> | undefined => {
        const index = this.index.get(params.name)
        const i = index?.get(id)
        if (!i) return
        return this.cache.get(params.name)?.then(data => {
          const newValue = setValue(data[i])
          data[i] = newValue
          return newValue
        })
      },
      refresh: build,
      warmUp: build,
      clear: () => this.cache.delete(params.name),
      get: () => {
        return map(this.cache.get(params.name), _ => _) ?? build()
      }
    }
  }
}
