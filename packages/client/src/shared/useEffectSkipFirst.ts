import {useEffect, useRef} from 'react'

export function useEffectSkipFirst(effect: React.EffectCallback, deps: any[]) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    return effect()
  }, deps)
}
