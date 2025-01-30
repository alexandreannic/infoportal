import {useContext, createContext, useEffect, type ReactNode} from 'react'
import {Seq, seq} from '@alexandreannic/ts-utils'

import {IKoboMeta} from 'infoportal-common'

import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {useFetcher, type UseFetcher} from '@/shared/hook/useFetcher'
import {useAsync, UseAsyncSimple} from '@/shared/hook/useAsync'

export interface EcrecContext {
  refresh: UseAsyncSimple<() => Promise<void>>
  data?: Seq<IKoboMeta>
  fetcherData: UseFetcher<(filters?: KoboAnswerFilter) => Promise<Seq<IKoboMeta>>>
}

const Context = createContext({} as EcrecContext)

export const useEcrecContext = () => useContext(Context)

export const EcrecProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()

  const fetcherData = useFetcher((filters?: KoboAnswerFilter) =>
    api.ecrec.search(filters).then((response) => seq(response.data)),
  )

  const asyncRefresh = useAsync(async () => {
    await api.ecrec.refresh()
    await fetcherData.fetch({clean: true, force: false})
  })

  useEffect(() => {
    fetcherData.fetch()
  }, [])

  return (
    <Context.Provider
      value={{
        data: fetcherData.get,
        fetcherData,
        refresh: asyncRefresh,
      }}
    >
      {children}
    </Context.Provider>
  )
}
