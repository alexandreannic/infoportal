import React, {ReactNode, useContext} from 'react'

export interface Seed__Context {}

const Context = React.createContext({} as Seed__Context)

export const useSeed__Context = () => useContext<Seed__Context>(Context)

export const Seed__Provider = ({children}: {children: ReactNode}) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>
}
