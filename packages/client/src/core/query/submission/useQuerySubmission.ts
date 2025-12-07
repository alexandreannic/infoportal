import {QueryClient, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../../context/ConfigContext.js'
import {KoboMapper, Submission} from '../../sdk/server/kobo/KoboMapper.js'
import {queryKeys} from '../query.index.js'
import {Api} from '@infoportal/api-sdk'
import {produce} from 'immer'
import {useIpToast} from '@/core/useToast.js'
import {UseQuerySchema} from '@/core/query/form/useQuerySchema.js'

export class UseQuerySubmission {
  static cacheRemove({
    formId,
    queryClient,
    submissionIds,
  }: {
    submissionIds: Api.SubmissionId[]
    formId: Api.FormId
    workspaceId: Api.WorkspaceId
    queryClient: QueryClient
  }) {
    queryClient.setQueryData<Api.Paginate<Api.Submission>>(
      queryKeys.submission(formId),
      (old = {data: [], total: 0}) => {
        const idsToDelete = new Set(submissionIds)
        const newData = old.data.filter(sub => !idsToDelete.has(sub.id))
        return {
          data: newData,
          total: newData.length,
        }
      },
    )
  }

  static cacheInsert({
    formId,
    workspaceId,
    queryClient,
    submission,
  }: {
    formId: Api.FormId
    workspaceId: Api.WorkspaceId
    queryClient: QueryClient
    submission: Api.Submission
  }) {
    const schema = UseQuerySchema.getInspector({workspaceId, formId, langIndex: 0}).data
    if (!schema) {
      console.error('Cannot get schema from store.')
      return
    }
    const mapped = KoboMapper.mapSubmissionBySchema(schema.lookup.questionIndex, Api.Submission.map(submission))
    queryClient.setQueryData<Api.Paginate<Api.Submission>>(
      queryKeys.submission(formId),
      (old = {data: [], total: 0}) => {
        return {
          total: old.total + 1,
          data: [...old.data, mapped],
        }
      },
    )
  }

  static cacheUpdateValidation({
    queryClient,
    formId,
    submissionIds,
    status,
  }: {
    status: Api.Submission.Validation
    queryClient: QueryClient
    formId: Api.FormId
    submissionIds: Api.SubmissionId[]
  }) {
    const queryKey = queryKeys.submission(formId)
    const previousValue = queryClient.getQueryData<Api.Paginate<Submission>>(queryKey)
    queryClient.setQueryData<Api.Paginate<Api.Submission>>(
      queryKeys.submission(formId),
      (old = {data: [], total: 0}) => {
        return produce(old ?? {data: [], total: 0}, draft => {
          const idsToUpdate = new Set(submissionIds)
          for (const submission of draft.data) {
            if (idsToUpdate.has(submission.id)) {
              submission.validationStatus = status
            }
          }
        })
      },
    )
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
    formId: Api.FormId
    submissionIds: Api.SubmissionId[]
  }) {
    const queryKey = queryKeys.submission(formId)
    const previousValue = queryClient.getQueryData<Api.Paginate<Submission>>(queryKey)
    queryClient.setQueryData<Api.Paginate<Api.Submission>>(queryKey, (old = {data: [], total: 0}) => {
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

  static search({formId, workspaceId}: {formId?: Api.FormId; workspaceId: Api.WorkspaceId}) {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const querySchema = UseQuerySchema.getInspector({workspaceId, formId, langIndex: 0})

    const query = useQuery({
      enabled: !!formId,
      queryKey: queryKeys.submission(formId),
      queryFn: async () => {
        const answersPromise = apiv2.submission.search({workspaceId, formId: formId!})
        const schema = querySchema.data // ?? (await querySchema.refetch().then(r => r.data!))
        const answers = await answersPromise
        return Api.Paginate.map((_: Api.Submission) =>
          KoboMapper.mapSubmissionBySchema(schema!.lookup.questionIndex, _),
        )(answers)
      },
    })

    const set = (value: Api.Paginate<Api.Submission>) => {
      queryClient.setQueryData(queryKeys.submission(formId), value)
    }

    const find = (submissionId: Api.SubmissionId): Api.Submission | undefined => {
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
      mutationFn: (params: Api.Submission.Payload.Submit) => apiv2.submission.submit(params),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      },
    })
  }

  static bulkUpdateValidation = () => {
    const queryClient = useQueryClient()
    const {apiv2: api} = useAppSettings()
    return useMutation({
      mutationFn: async (params: Api.Submission.Payload.BulkUpdateValidation) => {
        return api.submission.bulkUpdateValidation(params)
      },
      onMutate: async ({formId, submissionIds, status}) => {
        return UseQuerySubmission.cacheUpdateValidation({
          formId,
          queryClient,
          submissionIds,
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

  static readonly bulkUpdateQuestion = () => {
    const queryClient = useQueryClient()
    const {toastSuccess, toastHttpError} = useIpToast()
    const {apiv2: api} = useAppSettings()
    return useMutation({
      mutationFn: async (params: Api.Submission.Payload.BulkUpdateQuestion) => {
        return api.submission.bulkUpdateQuestion(params)
      },
      onMutate: async ({formId, submissionIds, question, answer}) => {
        return UseQuerySubmission.cacheUpdate({
          formId,
          submissionIds: submissionIds,
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
      mutationFn: async ({workspaceId, formId, submissionIds}: Api.Submission.Payload.Remove) => {
        return api.submission.remove({workspaceId, formId, submissionIds})
      },
      onMutate: async ({formId, submissionIds}) => {
        await queryClient.cancelQueries({queryKey: queryKeys.submission(formId)})
        const previousData = queryClient.getQueryData<Api.Paginate<Submission>>(queryKeys.submission(formId))
        queryClient.setQueryData<Api.Paginate<Submission>>(queryKeys.submission(formId), old => {
          if (!old) return old
          const idsIndex = new Set(submissionIds)
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
