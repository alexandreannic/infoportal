'use client'
import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {ApiSdk} from '../sdk/server/ApiSdk'
import {appConfig, AppConfig} from '@/conf/AppConfig'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {AppThemeParams, muiTheme} from '@/core/theme'
import {Theme} from '@mui/material'

export interface ConfigContext {
  api: ApiSdk
  conf: AppConfig
  theme: {
    theme: Theme,
    appThemeParams: AppThemeParams
    setAppThemeParams: Dispatch<SetStateAction<AppThemeParams>>
    isDark: boolean
    brightness: LightTheme
    setBrightness: Dispatch<SetStateAction<LightTheme>>
  }
}

export const _ConfigContext = React.createContext<ConfigContext>({} as ConfigContext)

export const useAppSettings = (): ConfigContext => useContext(_ConfigContext)

type LightTheme = 'auto' | 'dark' | 'light'

declare const window: any

const isSystemDarkTheme = () => !!(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

export const AppSettingsProvider = ({
  api,
  children,
}: {
  api: ApiSdk,
  children: ReactNode
}) => {
  const [brightness, setBrightness] = usePersistentState<LightTheme>('auto', {storageKey: 'dark-theme2'})
  const [isSystemDark, setIsSystemDark] = useState(isSystemDarkTheme())
  const isDark = useMemo(() => {
    return brightness === 'dark' || (brightness === 'auto' && isSystemDarkTheme())
  }, [brightness, isSystemDark])
  const [appThemeParams, setAppThemeParams] = useState<AppThemeParams>({})
  const theme = useMemo(() => muiTheme({...appThemeParams, dark: isDark}), [appThemeParams, isDark])

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event: any) => {
      setIsSystemDark(!!event.matches)
    })
  }, [])

  return (
    <_ConfigContext.Provider value={{
      api,
      theme: {
        theme,
        appThemeParams,
        setAppThemeParams,
        isDark,
        brightness,
        setBrightness,
      },
      conf: appConfig,
    }}>
      {children}
    </_ConfigContext.Provider>
  )
}
