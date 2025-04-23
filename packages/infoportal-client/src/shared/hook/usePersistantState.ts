import {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react'
import {generateId} from 'react-persistent-state/build/utils/hash'

export const usePersistentState = <S>(
  initialState: S | (() => S),
  {
    storageKey = 'react-persistent-state' + generateId(),
    transformFromStorage = (_) => _,
  }: {
    transformFromStorage?: (_: S) => S
    storageKey: string
  },
): [S, Dispatch<SetStateAction<S>>, () => void] => {
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage

  const getInitialValue = (): S | (() => S) => {
    if (!isLocalStorageAvailable) return initialState
    const storedValue = localStorage.getItem(storageKey)
    if (storedValue) {
      try {
        return transformFromStorage(JSON.parse(storedValue))
      } catch (error) {
        // console.error(`Error parsing localStorage key "${storageKey}": ${JSON.stringify(storedValue)}.`, error)
      }
    }
    return initialState
  }

  const [state, setState] = useState<S>(getInitialValue())

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [storageKey, state])

  const clear = useCallback(() => {
    localStorage.clear()
    setState(initialState)
  }, [initialState])

  return [state, setState, clear]
}
