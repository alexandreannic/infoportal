import {useQuery, useQueryClient} from '@tanstack/react-query'
import {ApiPaginate} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useAppSettings} from '../context/ConfigContext'
import {KoboMappedAnswer, KoboMapper} from '../sdk/server/kobo/KoboMapper'
import {queryKeys} from './query.index'
import {useQuerySchema} from './useQuerySchema'
import {duration} from '@axanc/ts-utils'
import {Ip, Paginate} from 'infoportal-api-sdk'

export const useQuerySubmissionSearch = ({formId, workspaceId}: {formId: Kobo.FormId; workspaceId: Ip.Uuid}) => {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  const querySchema = useQuerySchema({workspaceId, formId})

  const query = useQuery({
    queryKey: queryKeys.answers(formId),
    queryFn: async () => {
      const answersPromise = apiv2.submission.search({workspaceId, formId})
      const schema = querySchema.data // ?? (await querySchema.refetch().then(r => r.data!))
      const answers = await answersPromise
      return Paginate.map((_: Ip.Submission) => KoboMapper.mapSubmissionBySchema(schema!.helper.questionIndex, _))(
        answers,
      )
    },
    staleTime: duration(10, 'minute'),
  })

  const set = (value: Ip.Paginate<Ip.Submission>) => {
    queryClient.setQueryData(queryKeys.answers(formId), value)
  }

  const find = (submissionId: Ip.SubmissionId): Ip.Submission | undefined => {
    return query.data?.data.find(_ => _.id === submissionId)
  }

  return {
    ...query,
    set,
    find,
  }
}
