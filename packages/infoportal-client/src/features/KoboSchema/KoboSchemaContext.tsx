import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {Kobo} from 'kobo-sdk'
import {KoboSchemaHelper} from 'infoportal-common'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/shared/hook/useFetchers'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Obj} from '@axanc/ts-utils'

interface KoboSchemaProviderProps {
  defaultLangIndex?: number
  children: ReactNode
}

export type SchemaContextRes = {
  error?: Error
  loading?: boolean
  get?: KoboSchemaHelper.Bundle
}

export interface KoboSchemaContext {
  anyLoading?: boolean
  anyError?: boolean
  clearCache: () => void
  langIndex: number
  setLangIndex: Dispatch<SetStateAction<number>>
  fetchById: (id: Kobo.FormId) => Promise<Kobo.Form>
  byId: Record<Kobo.FormId, SchemaContextRes | undefined>
  byId2: (_: Kobo.FormId) => SchemaContextRes
}

const Context = React.createContext({} as KoboSchemaContext)

export const KoboSchemaProvider = ({defaultLangIndex = 0, children}: KoboSchemaProviderProps) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const [langIndex, setLangIndex] = useState<number>(defaultLangIndex)
  const {toastHttpError} = useIpToast()

  const {anyLoading, anyError, clearCache, ...fetchers} = useFetchers(
    (id: Kobo.FormId) => {
      return api.koboApi.getSchema({id}).catch(e => {
        toastHttpError(e)
        throw e
      })
    },
    {
      requestKey: _ => _[0],
    },
  )

  const by = useMemo(() => {
    const bundles: {
      byId: Record<Kobo.FormId, SchemaContextRes | undefined>
    } = {byId: {}}
    Obj.entries(fetchers.get)
      .filter(([id, schema]) => !!schema)
      .forEach(([id, schema]) => {
        const r = {
          get: KoboSchemaHelper.buildBundle({schema: schema!, langIndex}),
          loading: fetchers.loading[id],
          error: fetchers.error[id],
        }
        bundles.byId[id] = r
      })
    return bundles
  }, [fetchers.get, langIndex])

  return (
    <Context.Provider
      value={{
        langIndex,
        setLangIndex,
        anyLoading,
        anyError,
        clearCache,
        fetchById: (id: Kobo.FormId) => fetchers.fetch({force: false, clean: false}, id),
        byId: by.byId,
        byId2: (_: Kobo.FormId) => by.byId[_] ?? {},
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useKoboSchemaContext = () => {
  const ctx = useContext<KoboSchemaContext>(Context)
  if (!ctx) throw Error('Cannot used useKoboSchemasContext outside of KoboSchemasProvider.')
  return ctx
}
