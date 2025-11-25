import {QueryClient, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {KoboMapper, Submission} from '../sdk/server/kobo/KoboMapper'
import {queryKeys} from './query.index'
import {Ip, Paginate} from '@infoportal/api-sdk'
import {produce} from 'immer'
import {useIpToast} from '@/core/useToast'
import {UseQuerySchema} from '@/core/query/useQuerySchema'

export class UseQuerySubmission {
  static cacheRemove({
    formId,
    queryClient,
    submissionIds,
  }: {
    submissionIds: Ip.SubmissionId[]
    formId: Ip.FormId
    workspaceId: Ip.WorkspaceId
    queryClient: QueryClient
  }) {
    queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(queryKeys.submission(formId), (old = {data: [], total: 0}) => {
      const idsToDelete = new Set(submissionIds)
      const newData = old.data.filter(sub => !idsToDelete.has(sub.id))
      return {
        data: newData,
        total: newData.length,
      }
    })
  }

  static cacheInsert({
    formId,
    workspaceId,
    queryClient,
    submission,
  }: {
    formId: Ip.FormId
    workspaceId: Ip.WorkspaceId
    queryClient: QueryClient
    submission: Ip.Submission
  }) {
    const schema = UseQuerySchema.getBundle({workspaceId, formId, langIndex: 0}).data
    if (!schema) {
      console.error('Cannot get schema from store.')
      return
    }
    const mapped = KoboMapper.mapSubmissionBySchema(schema.helper.questionIndex, Ip.Submission.map(submission))
    queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(queryKeys.submission(formId), (old = {data: [], total: 0}) => {
      return {
        total: old.total + 1,
        data: [...old.data, mapped],
      }
    })
  }

  static cacheUpdateValidation({
    queryClient,
    formId,
    submissionIds,
    status,
  }: {
    status: Ip.Submission.Validation
    queryClient: QueryClient
    formId: Ip.FormId
    submissionIds: Ip.SubmissionId[]
  }) {
    const queryKey = queryKeys.submission(formId)
    const previousValue = queryClient.getQueryData<Ip.Paginate<Submission>>(queryKey)
    queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(queryKeys.submission(formId), (old = {data: [], total: 0}) => {
      return produce(old ?? {data: [], total: 0}, draft => {
        const idsToUpdate = new Set(submissionIds)
        for (const submission of draft.data) {
          if (idsToUpdate.has(submission.id)) {
            submission.validationStatus = status
          }
        }
      })
    })
    return {previousValue}
  }

  static cacheUpdate({
    queryClient,
    formId,
    submissionIds,
    question,
    answer,
  }: {
    question: string
    answer: string
    queryClient: QueryClient
    formId: Ip.FormId
    submissionIds: Ip.SubmissionId[]
  }) {
    const queryKey = queryKeys.submission(formId)
    const previousValue = queryClient.getQueryData<Ip.Paginate<Submission>>(queryKey)
    queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(queryKey, (old = {data: [], total: 0}) => {
      return produce(old ?? {data: [], total: 0}, draft => {
        const idsToUpdate = new Set(submissionIds)
        for (const submission of draft.data) {
          if (idsToUpdate.has(submission.id)) {
            submission.answers[question] = answer
          }
        }
      })
    })
    return {previousValue}
  }

  static search({formId, workspaceId}: {formId?: Ip.FormId; workspaceId: Ip.WorkspaceId}) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const querySchema = UseQuerySchema.getBundle({workspaceId, formId, langIndex: 0})

    const query = useQuery({
      enabled: !!formId,
      queryKey: queryKeys.submission(formId),
      queryFn: async () => {
        const answersPromise = apiv2.submission.search({workspaceId, formId: formId!})
        const schema = querySchema.data // ?? (await querySchema.refetch().then(r => r.data!))
        const answers = await answersPromise
        return Paginate.map((_: Ip.Submission) => KoboMapper.mapSubmissionBySchema(schema!.helper.questionIndex, _))(
          answers,
        )
      },
    })

    const set = (value: Ip.Paginate<Ip.Submission>) => {
      queryClient.setQueryData(queryKeys.submission(formId), value)
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

  static submit() {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (params: Ip.Submission.Payload.Submit) => apiv2.submission.submit(params),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      },
    })
  }

  static updateValidation = () => {
    const queryClient = useQueryClient()
    const {apiv2: api} = useAppSettings()
    return useMutation({
      mutationFn: async (params: Ip.Submission.Payload.UpdateValidation) => {
        return api.submission.updateValidation(params)
      },
      onMutate: async ({formId, answerIds, status}) => {
        return UseQuerySubmission.cacheUpdateValidation({
          formId,
          queryClient,
          submissionIds: answerIds,
          status,
        })
      },
      onError: (err, variables, context) => {
        if (context?.previousValue) {
          queryClient.setQueryData(queryKeys.submission(variables.formId), context.previousValue)
        }
      },
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      },
    })
  }

  static readonly update = () => {
    const queryClient = useQueryClient()
    const {toastSuccess, toastHttpError} = useIpToast()
    const {apiv2: api} = useAppSettings()
    return useMutation({
      mutationFn: async (params: Ip.Submission.Payload.Update) => {
        return api.submission.updateAnswers(params)
      },
      onMutate: async ({formId, answerIds, question, answer}) => {
        return UseQuerySubmission.cacheUpdate({
          formId,
          submissionIds: answerIds,
          queryClient,
          question,
          answer,
        })
      },
      onError: (err, variables, context) => {
        toastHttpError(err)
        if (context?.previousValue) {
          queryClient.setQueryData(queryKeys.submission(variables.formId), context.previousValue)
        }
        queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      },
      // onSettled: (data, error, variables) => {
      //   queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      // },
    })
  }

  static readonly remove = () => {
    const queryClient = useQueryClient()
    const {apiv2: api} = useAppSettings()
    return useMutation({
      mutationFn: async ({workspaceId, formId, answerIds}: Ip.Submission.Payload.Remove) => {
        return api.submission.remove({workspaceId, formId, answerIds})
      },
      onMutate: async ({formId, answerIds}) => {
        await queryClient.cancelQueries({queryKey: queryKeys.submission(formId)})
        const previousData = queryClient.getQueryData<Ip.Paginate<Submission>>(queryKeys.submission(formId))
        queryClient.setQueryData<Ip.Paginate<Submission>>(queryKeys.submission(formId), old => {
          if (!old) return old
          const idsIndex = new Set(answerIds)
          return {
            ...old,
            data: old.data.filter(a => !idsIndex.has(a.id)),
          }
        })

        return {previousData}
      },
      onError: (_err, {formId}, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKeys.submission(formId), context.previousData)
        }
      },
      onSettled: (_data, _error, {formId}) => {
        queryClient.invalidateQueries({queryKey: queryKeys.submission(formId)})
      },
    })
  }
}
