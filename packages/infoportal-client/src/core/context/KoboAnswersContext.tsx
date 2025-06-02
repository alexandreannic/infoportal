import {useAppSettings} from '@/core/context/ConfigContext'
import {FetchParams, useFetchers} from '@/shared/hook/useFetchers'
import React, {ReactNode, useContext, useMemo, useState} from 'react'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {KoboMappedAnswer, KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {DatabaseKoboAnswerViewDialog} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {Kobo} from 'kobo-sdk'
import {KoboSchemaHelper, KoboSubmissionFlat} from 'infoportal-common'

const Context = React.createContext({} as KoboAnswersContext)

export interface OpenModalProps {
  answer: KoboSubmissionFlat<any, any>
  formId: Kobo.FormId
}

export type KoboAnswersContext = {
  openView: (_: OpenModalProps) => void
  byId: (id: Kobo.FormId) => {
    find: (_: Kobo.SubmissionId) => KoboMappedAnswer | undefined
    set: (value: ApiPaginate<KoboMappedAnswer>) => void
    fetch: (p?: FetchParams) => Promise<ApiPaginate<KoboMappedAnswer>>
    get: undefined | ApiPaginate<KoboMappedAnswer>
    loading: boolean | undefined
  }
}

export const KoboAnswersProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()
  const ctxSchema = useKoboSchemaContext()

  const fetcher = useFetchers(
    async (id: Kobo.SubmissionId) => {
      const [schema, answers] = await Promise.all([
        ctxSchema.fetchById(id).then(_ => KoboSchemaHelper.buildHelper({schema: _})),
        api.kobo.answer.searchByAccess({formId: id}),
      ])
      return {
        ...answers,
        data: answers.data.map(_ => KoboMapper.mapAnswerBySchema(schema.questionIndex, _)),
      }
    },
    {requestKey: _ => _[0]},
  )

  const byId = useMemo(() => {
    return (id: Kobo.SubmissionId) => ({
      set: (value: ApiPaginate<KoboMappedAnswer>) => {
        fetcher.getAsMap.set(id, value as any)
      },
      get: fetcher.get[id] as undefined | ApiPaginate<KoboMappedAnswer>,
      fetch: (p: FetchParams = {}): Promise<ApiPaginate<KoboMappedAnswer>> => {
        return fetcher.fetch(p, id) as any
      },
      find: (answerId: Kobo.SubmissionId) => {
        return fetcher.get[id]?.data.find(_ => _.id === answerId) as KoboMappedAnswer
      },
      loading: fetcher.loading[id],
    })
  }, [fetcher.getAsMap])

  const [editPopup, setEditPopup] = useState<OpenModalProps | undefined>()

  return (
    <Context.Provider
      value={{
        byId,
        openView: setEditPopup,
      }}
    >
      {children}
      {editPopup && (
        <DatabaseKoboAnswerViewDialog
          open={true}
          onClose={() => setEditPopup(undefined)}
          answer={editPopup.answer}
          formId={editPopup.formId}
        />
      )}
    </Context.Provider>
  )
}

export const useKoboAnswersContext = () => useContext<KoboAnswersContext>(Context)
