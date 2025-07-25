import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {useQueryClient} from '@tanstack/react-query'
import {useDialogs} from '@toolpad/core'
import {create} from 'zustand'
import {getKoboSchema} from '../query/useQuerySchema'
import {KoboUpdateModal} from '@/shared/koboEdit/KoboUpdateModal'
import {Ip} from 'infoportal-api-sdk'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'

type LangIndex = {
  langIndex: number
  setLangIndex: (value: number) => void
}

export const useLangIndex = create<LangIndex>(set => ({
  langIndex: 0, // default value
  setLangIndex: value =>
    set(state => ({
      langIndex: value,
    })),
}))

export interface OpenModalProps {
  workspaceId: Ip.WorkspaceId
  answer: Submission
  formId: Ip.FormId
}

export type KoboUpdateValidation = {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  answerIds: Ip.SubmissionId[]
  // status: KoboValidation | null
  onSuccess?: () => void
}

export type KoboUpdateAnswers = {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  answerIds: Ip.SubmissionId[]
  question: string
  // answer: any | null
  onSuccess?: () => void
}

export const useKoboDialogs = () => {
  const dialogs = useDialogs()
  const queryClient = useQueryClient()

  return {
    openBulkEditAnswers: (params: KoboUpdateAnswers) => {
      dialogs.open(KoboUpdateModal.Answer, {
        workspaceId: params.workspaceId,
        formId: params.formId,
        columnName: params.question,
        answerIds: params.answerIds,
        onUpdated: params.onSuccess,
      })
    },
    openBulkEditValidation: (params: KoboUpdateValidation) => {
      dialogs.open(KoboUpdateModal.Validation, {
        workspaceId: params.workspaceId,
        formId: params.formId,
        answerIds: params.answerIds,
        onUpdated: params.onSuccess,
      })
    },
    openView: (params: OpenModalProps) => {
      const schema = getKoboSchema(queryClient, params.formId)
      if (!schema) {
        console.error(`Missing schema ${params.formId}`)
        return
      }
      dialogs.open(DialogAnswerView, {schema, ...params})
    },
    openEdit: (params: OpenModalProps) => {
      const schema = getKoboSchema(queryClient, params.formId)
      if (!schema) {
        console.error(`Missing schema ${params.formId}`)
        return
      }
      dialogs.open(DialogAnswerEdit, {schema, ...params})
    },
  }
}
