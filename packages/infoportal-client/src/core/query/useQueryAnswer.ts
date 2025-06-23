import {useQuery, useQueryClient} from '@tanstack/react-query'
import {ApiPaginate} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '../context/ConfigContext'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {KoboMappedAnswer, KoboMapper} from '../sdk/server/kobo/KoboMapper'
import {queryKeys} from './query.index'
import {useQueryKoboSchema} from './useQueryKoboSchema'
import {duration} from '@axanc/ts-utils'

export const useQueryAnswer = (formId: Kobo.FormId) => {
  const {api} = useAppSettings()
  const {workspaceId} = useWorkspaceRouter()
  const queryClient = useQueryClient()
  const querySchema = useQueryKoboSchema(formId)

  const query = useQuery<ApiPaginate<KoboMappedAnswer>>({
    queryKey: queryKeys.answers(formId),
    queryFn: async () => {
      const answersPromise = api.kobo.answer.searchByAccess({workspaceId, formId})
      const schema = querySchema.data// ?? (await querySchema.refetch().then(r => r.data!))
      const answers = await answersPromise
      return {
        ...answers,
        data: answers.data.map(_ => KoboMapper.mapAnswerBySchema(schema!.helper.questionIndex, _)),
      }
    },
    staleTime: duration(10, 'minute'),
  })

  const set = (value: ApiPaginate<KoboMappedAnswer>) => {
    queryClient.setQueryData(queryKeys.answers(formId), value)
  }

  const find = (submissionId: Kobo.SubmissionId): KoboMappedAnswer | undefined => {
    return query.data?.data.find(_ => _.id === submissionId)
  }

  return {
    ...query,
    set,
    find,
  }
}
