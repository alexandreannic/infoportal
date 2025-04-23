import {Func} from '@alexandreannic/react-hooks-lib'
import {useMapIp} from '@/shared/hook/useMap'
import {useState} from 'react'

type Key = number | string

interface UseAsyncBase<F extends Func<Promise<any>>> {
  call: F
  callIndex: number
}

export interface UseAsyncSimple<F extends Func<Promise<any>>, E = any> extends UseAsyncBase<F> {
  error?: E
  loading: boolean
}

export interface UseAsyncMultiple<F extends Func<Promise<any>>, K extends Key = any, E = any> extends UseAsyncBase<F> {
  anyLoading: boolean
  lastError?: E
  loading: Record<K, boolean>
  error: Record<K, E>
}

export interface UseAsyncFn {
  <F extends Func<Promise<any>>, K extends Key = any, E = any>(
    caller: F,
    params: {
      mapError?: (_: any) => E
      requestKey: (_: Parameters<F>) => K
    },
  ): UseAsyncMultiple<F, K, E>
  <F extends Func<Promise<any>>, K extends Key = any, E = any>(
    caller: F,
    params?: {
      mapError?: (_: any) => E
      requestKey?: undefined
    },
  ): UseAsyncSimple<F, E>
}

const DEFAULT_KEY: any = 'DEFAULT_KEY'

/**
 * Factorize async by exposing loading indicator and error status.
 */
export const useAsync: UseAsyncFn = <F extends Func<Promise<any>>, K extends Key = any, E = any>(
  caller: F,
  {
    mapError = (_) => _,
    requestKey,
  }: {
    mapError?: (_: any) => E
    requestKey?: (_: Parameters<F>) => K
  } = {} as any,
) => {
  const loading = useMapIp<K, boolean>()
  const error = useMapIp<K, E>()
  const [callIndex, setCallIndex] = useState(0)
  const [lastError, setLastError] = useState<E | undefined>()

  const call = (...args: Parameters<F>) => {
    setLastError(undefined)
    const key = requestKey ? requestKey(args) : DEFAULT_KEY
    loading.set(key, true)
    return caller(...args)
      .then((_) => {
        loading.delete(key)
        setCallIndex((_) => _ + 1)
        return _
      })
      .catch((e: E) => {
        setCallIndex((_) => _ + 1)
        setLastError(e)
        loading.delete(key)
        error.set(key, mapError(e))
        throw e
      })
  }

  const anyLoading = loading.keys.length > 0

  return {
    callIndex,
    lastError,
    anyLoading,
    loading: requestKey ? loading.toObject : (loading.get(DEFAULT_KEY) as any),
    error: requestKey ? error.toObject : (error.get(DEFAULT_KEY) as any),
    call,
  }
}
