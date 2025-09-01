import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {useQueryClient} from '@tanstack/react-query'
import {useDialogs} from '@toolpad/core'
import {create} from 'zustand'
import {getSchema} from '../query/useQuerySchema'
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

export const useKoboDialogs = () => {
  const dialogs = useDialogs()
  const queryClient = useQueryClient()

  return {
    openView: (params: OpenModalProps) => {
      const schema = getSchema({queryClient, ...params})
      if (!schema) {
        console.error(`Missing schema ${params.formId}`)
        return
      }
      dialogs.open(DialogAnswerView, {schema, ...params})
    },
    openEdit: (params: OpenModalProps) => {
      const schema = getSchema({queryClient, ...params})
      if (!schema) {
        console.error(`Missing schema ${params.formId}`)
        return
      }
      dialogs.open(DialogAnswerEdit, {schema, ...params})
    },
  }
}
