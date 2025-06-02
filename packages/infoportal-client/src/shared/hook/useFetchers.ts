import {useCallback, useMemo, useRef, useState} from 'react'
import {UseMap, useMap} from '@axanc/react-hooks'

export type Func<R = any> = (...args: any[]) => R

export interface FetchParams {
  force?: boolean
  clean?: boolean
}

export type Fetch<T extends Func<Promise<FetcherResult<T>>>> = (p?: FetchParams, ..._: Parameters<T>) => ReturnType<T>

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type FetcherResult<T extends Func> = ThenArg<undefined | ReturnType<T>>

type Key = number | string

export interface UseFetchers<F extends Func<Promise<any>>, K extends Key = any, E = any> {
  fetch: Fetch<F>
  getAsArr: FetcherResult<F>[]
  getAsMap: UseMap<K, FetcherResult<F>>
  get: Partial<Record<K, FetcherResult<F>>>
  clearCache: () => void
  loading: Partial<Record<K, boolean>>
  error: Partial<Record<K, E>>
  anyLoading: boolean
  anyError?: boolean
  lastError?: E
}

export interface UseFetchersFn {
  <F extends Func<Promise<any>>, K extends Key = any, E = any>(
    fetcher: F,
    params: {
      mapError?: (_: any) => E
      requestKey: (_: Parameters<F>) => K
    },
  ): UseFetchers<F, K, E>
}

/**
 * Factorize fetching logic which goal is to prevent unneeded fetchs and expose loading indicator + error status.
 */
export const useFetchers: UseFetchersFn = <F extends Func<Promise<any>>, K extends Key = any, E = any>(
  fetcher: F,
  {requestKey = undefined as any, mapError = (_: any) => _},
) => {
  const entities = useMap<K, undefined | FetcherResult<F>>()
  const errors = useMap<K, E | undefined>()
  const loadings = useMap<K, boolean>()
  const [lastError, setLastError] = useState<E | undefined>()
  const list = useMemo(() => entities.values ?? [], [entities])
  const fetch$ = useRef(new Map<string, Promise<undefined | FetcherResult<F>>>())

  const fetch = (
    {force = true, clean = true}: FetchParams = {},
    ...args: Parameters<F>
  ): Promise<undefined | FetcherResult<F>> => {
    const key = requestKey(args)
    const entity = entities.get(key)
    errors.delete(key)

    if (!force && entity) {
      return Promise.resolve(entity)
    }
    if (clean) {
      entities.delete(key)
    }
    if (loadings.get(key)) {
      return fetch$.current.get(key)!
    }

    loadings.set(key, true)
    const promise = fetcher(...args)
      .then((x: FetcherResult<F>) => {
        entities.set(key, x)
        loadings.set(key, false)
        fetch$.current.delete(key)
        return x
      })
      .catch(e => {
        errors.set(key, mapError ? mapError(e) : e)
        setLastError(e)
        loadings.set(key, false)
        entities.delete(key)
        fetch$.current.delete(key)
        return undefined
      })

    fetch$.current.set(key, promise)
    return promise
  }

  const clearCache = useCallback(() => {
    entities.clear()
    errors.clear()
    loadings.clear()
  }, [entities, errors, loadings])

  return {
    getAsArr: list,
    getAsMap: entities,
    get: entities.toObject,
    loading: loadings.toObject,
    error: errors.toObject,
    lastError,
    anyError: errors.size > 0,
    anyLoading: !!loadings.values.find(_ => _),
    // TODO(Alex) not sure the error is legitimate
    fetch: fetch as any,
    // setEntity,
    clearCache,
  }
}
