import React, {ReactNode, useContext} from 'react'
import {ApiSdk} from '../sdk/server/ApiSdk'
import {appConfig, AppConfig} from '@/conf/AppConfig'
import {ApiClient} from '@infoportal/api-sdk'

export interface ConfigContext {
  api: ApiSdk
  apiv2: ApiClient
  conf: AppConfig
}

export const _ConfigContext = React.createContext({} as ConfigContext)

export const useAppSettings = () => useContext(_ConfigContext)

export const AppSettingsProvider = ({api, apiv2, children}: {api: ApiSdk; apiv2: ApiClient; children: ReactNode}) => {
  return (
    <_ConfigContext.Provider
      value={{
        api,
        apiv2,
        conf: appConfig,
      }}
    >
      {children}
    </_ConfigContext.Provider>
  )
}
