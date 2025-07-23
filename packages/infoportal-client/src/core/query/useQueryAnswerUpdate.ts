import {QueryClient, useMutation, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {Kobo} from 'kobo-sdk'
import {queryKeys} from './query.index'
import {ApiPaginate, UUID} from 'infoportal-common'
import {Submission} from '../sdk/server/kobo/KoboMapper'
import {Ip} from 'infoportal-api-sdk'

export type DeleteAnswersParams = {
  formId: string
  answerIds: Kobo.SubmissionId[]
  workspaceId: UUID
}

export type UpdateAnswersParams = {
  answerIds: Kobo.SubmissionId[]
  workspaceId: UUID
  formId: string
  question: string
  answer: any | null
}

export type KoboUpdateValidation = {
  workspaceId: UUID
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  status: Ip.Submission.Validation | null
}

const onMutate = async (
  queryClient: QueryClient,
  {
    formId,
    key,
    value,
    answerIds,
  }: {
    answerIds: Kobo.SubmissionId[]
    formId: string
    key: string
    value: any
  },
) => {
  const queryKey = queryKeys.answers(formId)
  await queryClient.cancelQueries({queryKey})
  const previous = queryClient.getQueryData<ApiPaginate<Submission>>(queryKey)
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
  const {api} = useAppSettings()

  return {
    updateValidation: useMutation({
      mutationFn: async (params: KoboUpdateValidation) => {
        return api.kobo.answer.updateValidation(params)
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
          queryClient.setQueryData(queryKeys.answers(variables.formId), context.previous)
        }
      },

      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.answers(variables.formId)})
      },
    }),

    update: useMutation({
      mutationFn: async (params: UpdateAnswersParams) => {
        return api.kobo.answer.updateAnswers(params)
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
          queryClient.setQueryData(queryKeys.answers(variables.formId), context.previous)
        }
      },

      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.answers(variables.formId)})
      },
    }),

    remove: useMutation({
      mutationFn: async ({workspaceId, formId, answerIds}: DeleteAnswersParams) => {
        return api.kobo.answer.delete({workspaceId, formId, answerIds})
      },

      onMutate: async ({formId, answerIds}) => {
        await queryClient.cancelQueries({queryKey: queryKeys.answers(formId)})

        const previousData = queryClient.getQueryData<ApiPaginate<Submission>>(queryKeys.answers(formId))

        queryClient.setQueryData<ApiPaginate<Submission>>(queryKeys.answers(formId), old => {
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
          queryClient.setQueryData(queryKeys.answers(formId), context.previousData)
        }
      },

      onSettled: (_data, _error, {formId}) => {
        queryClient.invalidateQueries({queryKey: queryKeys.answers(formId)})
      },
    }),
  }
}
