import {DialogAnswerEdit} from '@/features/Database/Dialog/DialogAnswerEdit'
import {DialogAnswerView} from '@/features/Database/Dialog/DialogAnswerView'
import {useQueryClient} from '@tanstack/react-query'
import {useDialogs} from '@toolpad/core'
import {KoboSubmissionFlat, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {create} from 'zustand'
import {getKoboSchema} from '../query/useQueryKoboSchema'
import {KoboUpdateModal} from '@/shared/koboEdit/KoboUpdateModal'

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
  answer: KoboSubmissionFlat
  formId: Kobo.FormId
}

export type KoboUpdateValidation = {
  workspaceId: UUID
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  // status: KoboValidation | null
  onSuccess?: () => void
}

export type KoboUpdateAnswers = {
  workspaceId: UUID
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
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
