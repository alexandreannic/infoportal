import React, {ReactNode, useContext, useEffect} from 'react'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'
import {useAppSettings} from '@/core/context/ConfigContext'
import {map, seq} from '@alexandreannic/ts-utils'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useMetaDashboardData} from '@/app/meta/useMetaData'

export type MetaContext = {
  fetcher: UseFetcher<ApiSdk['koboMeta']['search']>
  data: UseMetaData
}

const Context = React.createContext({} as MetaContext)

export const useMetaContext = () => useContext<MetaContext>(Context)

export const MetaDashboardProvider = ({
  children,
  storageKeyPrefix,
}: {
  children: ReactNode
  storageKeyPrefix?: string
}) => {
  const {api} = useAppSettings()
  const fetcher = useFetcher(api.koboMeta.search)
  const data = map(fetcher.get, _ => seq(_.data))
  const ctx = useMetaDashboardData({data: data ?? seq(), storageKeyPrefix})

  useEffect(() => {
    fetcher.fetch()
  }, [])

  return (
    <Context.Provider value={{
      data: ctx,
      fetcher,
    }}>
      {children}
    </Context.Provider>
  )
}
