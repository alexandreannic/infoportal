import {QueryClient, useMutation, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {queryKeys} from './query.index'
import {Submission} from '../sdk/server/kobo/KoboMapper'
import {Ip} from 'infoportal-api-sdk'

const onMutate = async (
  queryClient: QueryClient,
  {
    formId,
    key,
    value,
    answerIds,
  }: {
    answerIds: Ip.SubmissionId[]
    formId: Ip.FormId
    key: string
    value: any
  },
) => {
  const queryKey = queryKeys.submission(formId)
  await queryClient.cancelQueries({queryKey})
  const previous = queryClient.getQueryData<Ip.Paginate<Submission>>(queryKey)
  if (previous) {
    const idsIndex = new Set(answerIds)
    queryClient.setQueryData(queryKey, {
      ...previous,
      data: previous.data.map(a => (idsIndex.has(a.id) ? {...a, [key]: value} : a)),
    })
  }
  return {previous}
}

export const useQueryAnswerUpdate = () => {
  const queryClient = useQueryClient()
  const {apiv2: api} = useAppSettings()

  return {
    updateValidation: useMutation({
      mutationFn: async (params: Ip.Submission.Payload.UpdateValidation) => {
        return api.submission.updateValidation(params)
      },

      onMutate: async ({formId, answerIds, status}) => {
        return onMutate(queryClient, {
          formId,
          answerIds,
          key: 'validationStatus',
          value: status,
        })
      },

      onError: (err, variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(queryKeys.submission(variables.formId), context.previous)
        }
      },

      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      },
    }),

    update: useMutation({
      mutationFn: async (params: Ip.Submission.Payload.Update) => {
        return api.submission.updateAnswers(params)
      },

      onMutate: async ({formId, answerIds, question, answer}) => {
        return onMutate(queryClient, {
          formId,
          answerIds,
          key: question,
          value: answer,
        })
      },

      onError: (err, variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(queryKeys.submission(variables.formId), context.previous)
        }
      },

      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.submission(variables.formId)})
      },
    }),

    remove: useMutation({
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
    }),
  }
}
