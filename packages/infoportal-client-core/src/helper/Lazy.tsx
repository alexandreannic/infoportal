import {useMemo} from 'react'

interface Type {
  <T, D extends readonly any[]>(_: {deps: readonly [...D]; fn: (..._: D) => T; children: (..._: T[]) => any}): any
}

export const Lazy: Type = ({deps, fn, children}) => {
  return useMemo(() => children(fn(...deps)), deps)
  // return useMemo(() => children(...deps.map(fn)), deps)
}
