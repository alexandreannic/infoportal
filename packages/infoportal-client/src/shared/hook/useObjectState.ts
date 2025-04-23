import React, {Dispatch, useCallback, useState} from 'react'

export type UseObjectStateReturn<T> = {
  get: T
  set: Dispatch<React.SetStateAction<T>>
  update: (updates: Partial<T>) => void
  reset: () => void
  setProperty: <K extends keyof T>(key: K, value: T[K]) => void
}

export const useObjectState = <T extends object>(initialState: T): UseObjectStateReturn<T> => {
  const [state, setState] = useState<T>(initialState)

  const update = useCallback((updates: Partial<T>) => {
    setState((prevState) => ({...prevState, ...updates}))
  }, [])

  const reset = useCallback(() => setState(initialState), [initialState])

  const setProperty = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setState((prevState) => ({...prevState, [key]: value}))
  }, [])

  return {get: state, set: setState, update, reset, setProperty}
}
