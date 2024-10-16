'use client'
import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {KoboApiSchema, KoboFormName, KoboId, KoboIndex, KoboSchemaHelper} from 'infoportal-common'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/shared/hook/useFetchers'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Obj} from '@alexandreannic/ts-utils'

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
  fetchById: (id: KoboId) => Promise<KoboApiSchema>
  fetchByName: (name: KoboFormName) => Promise<KoboApiSchema>
  byId: Record<KoboId, SchemaContextRes | undefined>
  byId2: (_: KoboId) => SchemaContextRes
  byName: Record<KoboFormName, SchemaContextRes>
}

const Context = React.createContext({} as KoboSchemaContext)

export const KoboSchemaProvider = ({
  defaultLangIndex = 0,
  children,
}: KoboSchemaProviderProps) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const [langIndex, setLangIndex] = useState<number>(defaultLangIndex)
  const {toastHttpError} = useIpToast()

  const {anyLoading, anyError, clearCache, ...fetchers} = useFetchers((id: KoboId) => {
    return api.koboApi.getForm({id}).catch(e => {
      toastHttpError(e)
      throw e
    })
  }, {
    requestKey: _ => _[0],
  })

  const by = useMemo(() => {
    const bundles: {
      byId: Record<KoboId, SchemaContextRes | undefined>
      byName: Record<KoboFormName, SchemaContextRes>
    } = {byId: {}, byName: {} as any}
    Obj.entries(fetchers.get).forEach(([id, schema]) => {
      const r = {
        get: KoboSchemaHelper.buildBundle({schema, langIndex}),
        loading: fetchers.loading[id],
        error: fetchers.error[id],
      }
      bundles.byId[id] = r
      const name = KoboIndex.searchById(id)?.name
      if (name) bundles.byName[name] = r
    })
    KoboIndex.names.forEach(name => {
      if (!bundles.byName[name]) bundles.byName[name] = {get: undefined, loading: undefined, error: undefined}
    })
    return bundles
  }, [fetchers.get, langIndex])

  return (
    <Context.Provider value={{
      langIndex,
      setLangIndex,
      anyLoading,
      anyError,
      clearCache,
      fetchById: (id: KoboId) => fetchers.fetch({force: false, clean: false}, id),
      fetchByName: (name: KoboFormName) => fetchers.fetch({force: false, clean: false}, KoboIndex.byName(name).id),
      byId: by.byId,
      byId2: (_: KoboId) => by.byId[_] ?? {},
      byName: by.byName,
    }}>
      {children}
    </Context.Provider>
  )
}

export const useKoboSchemaContext = ({autoFetch}: {autoFetch?: KoboFormName[]} = {}) => {
  const ctx = useContext<KoboSchemaContext>(Context)
  if (!ctx) throw Error('Cannot used useKoboSchemasContext outside of KoboSchemasProvider.')
  useEffect(() => {
    if (autoFetch) autoFetch.forEach(name => {
      ctx.fetchByName(name)
    })
  }, [])
  return ctx
}
