import {useAppSettings} from '@/core/context/ConfigContext'
import {FetchParams, useFetchers} from '@/shared/hook/useFetchers'
import React, {ReactNode, useContext, useMemo} from 'react'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {useKoboSchemaContext} from '@/core/store/useLangIndex'
import {KoboMappedAnswer, KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {Kobo} from 'kobo-sdk'
import {KoboSchemaHelper} from 'infoportal-common'
import {useWorkspaceRouter} from './WorkspaceContext'

const Context = React.createContext({} as KoboAnswersContext)

export type KoboAnswersContext = {
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
  const {workspaceId} = useWorkspaceRouter()
  const ctxSchema = useKoboSchemaContext()

  const fetcher = useFetchers(
    async (id: Kobo.SubmissionId) => {
      const [schema, answers] = await Promise.all([
        ctxSchema.fetchById(id).then(_ => KoboSchemaHelper.buildHelper({schema: _})),
        api.kobo.answer.searchByAccess({workspaceId, formId: id}),
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

  return (
    <Context.Provider
      value={{
        byId,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useKoboAnswersContext = () => useContext<KoboAnswersContext>(Context)
