import React, {ReactNode, useContext} from 'react'
import {ApiSdk} from '../sdk/server/ApiSdk'
import {appConfig, AppConfig} from '@/conf/AppConfig'

export interface ConfigContext {
  api: ApiSdk
  conf: AppConfig
}

export const _ConfigContext = React.createContext({} as ConfigContext)

export const useAppSettings = () => useContext(_ConfigContext)

export const AppSettingsProvider = ({api, children}: {api: ApiSdk; children: ReactNode}) => {
  return (
    <_ConfigContext.Provider
      value={{
        api,
        conf: appConfig,
      }}
    >
      {children}
    </_ConfigContext.Provider>
  )
}
