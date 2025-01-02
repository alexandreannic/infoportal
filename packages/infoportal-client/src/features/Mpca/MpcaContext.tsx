import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {CashStatus, MpcaEntity, NonNullableKey} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {MpcaTypeTag} from '@/core/sdk/server/mpca/MpcaEntity'
import {Obj, Seq, seq} from '@alexandreannic/ts-utils'
import {useFetcher, UseFetcher} from '@/shared/hook/useFetcher'
import {useAsync, UseAsyncSimple} from '@/shared/hook/useAsync'
import {Kobo} from 'kobo-sdk'

// [DONORS according to Alix]

// CASH for Repairs
//  si c'est le cash for repair a Mykolaiv c'est Danish MFA - UKR-000301
//  Si c'est celui de Lviv, c'est Pooled Funds: 000270

// Emergency DAM:
//   Danish MFA - UKR-000301 & Pooled Funds: 000270 (Kherson Registration); Novo Nordisk 000298 (Mykolaiv Registration)

interface UpdateTag<K extends keyof MpcaTypeTag> {
  formId?: Kobo.FormId
  answerIds: Kobo.SubmissionId[],
  key: K,
  value: MpcaTypeTag[K] | null
}

export interface MpcaContext {
  refresh: UseAsyncSimple<() => Promise<void>>
  data?: Seq<MpcaEntity>
  asyncUpdates: UseAsyncSimple<<K extends keyof MpcaTypeTag>(_: UpdateTag<K>) => Promise<void>>
  fetcherData: UseFetcher<(filters?: KoboAnswerFilter) => Promise<Seq<MpcaEntity>>>
}

const Context = React.createContext({} as MpcaContext)

export const useMpcaContext = () => useContext(Context)

export const MpcaProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()

  const fetcherData = useFetcher((_?: KoboAnswerFilter) => api.mpca.search(_).then(_ => seq(_.data)) as Promise<Seq<MpcaEntity>>)
  const dataIndex = useMemo(() => {
    const index: Record<Kobo.SubmissionId, number> = {}
    fetcherData.get?.forEach((_, i) => {
      index[_.id] = i
    })
    return index
  }, [fetcherData.get])

  const asyncRefresh = useAsync(async () => {
    await api.mpca.refresh()
    await fetcherData.fetch({clean: false, force: true})
  })

  useEffect(() => {
    fetcherData.fetch()
  }, [])

  const mappedData = useMemo(() => {
    return fetcherData.get?.map(_ => {
      _.amountUahCommitted = _.tags?.status === CashStatus.Paid ? _.amountUahFinal : 0
      return _
    })
  }, [fetcherData.get])

  const asyncUpdates = useAsync(async <K extends keyof MpcaTypeTag>({
    formId,
    answerIds,
    key,
    value
  }: UpdateTag<K>) => {
    if (formId) {
      await updateByFormId({
        formId,
        answerIds,
        key,
        value,
      })
    } else {
      const data = answerIds.map(_ => fetcherData.get![dataIndex[_]])
      const gb = seq(data).groupBy(_ => _.formId)
      await Promise.all(Obj.entries(gb).map(([formId, answers]) => {
        return updateByFormId({
          formId,
          answerIds: answers.map(_ => _.id),
          key,
          value,
        })
      }))
    }
  })

  const updateByFormId = async <K extends keyof MpcaTypeTag>({
    formId,
    answerIds,
    key,
    value
  }: NonNullableKey<UpdateTag<K>, 'formId'>) => {
    const newTags = {[key]: value}
    await api.kobo.answer.updateTag({
      formId,
      answerIds: answerIds,
      tags: newTags,
    })
    fetcherData.set(prev => {
      const copy = prev ? seq([...prev]) : seq([])
      answerIds.forEach(id => {
        copy[dataIndex[id]].tags = {
          ...copy[dataIndex[id]].tags,
          ...newTags,
        }
      })
      return copy
    })
  }


  return (
    <Context.Provider value={{
      data: mappedData,
      fetcherData,
      refresh: asyncRefresh,
      asyncUpdates,
    }}>
      {children}
    </Context.Provider>
  )
}