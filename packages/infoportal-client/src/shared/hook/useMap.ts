import {useMemo, useState} from 'react'

type Key = string | number
export type UseMap2<K extends Key, V> = Pick<Map<K, V>, 'size' | 'get' | 'entries' | 'clear'> & {
  reset: (arr: V[], getKey: (v: V) => K) => void
  set: (k: K, v: V) => void
  has: (k: K) => boolean
  values: V[]
  keys: K[]
  delete: (k: K) => void
  clear: () => void
  map: Map<K, V>
  toObject: Record<K, V>
  // size: number
  // get: (k: K) => V | undefined
}

export const useMapIp = <K extends Key, V>(initialValue: Map<K, V> = new Map()): UseMap2<K, V> => {
  const [map, setMap] = useState<Map<K, V>>(initialValue)

  return useMemo(
    () => ({
      // ...map,
      map,
      reset: (arr: V[], getKey: (v: V) => K) => {
        const index: [K, V][] = arr.map((_) => [getKey(_), _])
        setMap(new Map(index))
      },
      set: (k: K, v: V) => {
        const newMap = map.set(k, v)
        setMap(new Map(newMap))
        return map
      },
      has: (k: K) => map.has(k),
      values: Array.from(map.values()),
      keys: Array.from(map.keys()),
      clear: () => map.clear(),
      entries: () => map.entries(),
      delete: (k: K) => {
        const exists = map.delete(k)
        setMap(new Map(map))
        return exists
      },
      size: map.size,
      get: (k: K) => map.get(k),
      toObject: Object.fromEntries(map.entries()) as Record<K, V>,
    }),
    [map],
  )
}
