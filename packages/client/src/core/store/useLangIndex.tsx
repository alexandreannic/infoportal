import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {useDialogs} from '@toolpad/core'
import {create} from 'zustand'
import {useQuerySchema} from '../query/useQuerySchema'
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
  submission: Submission
}

export const useKoboDialogs = ({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const dialogs = useDialogs()
  const querySchema = useQuerySchema({workspaceId, formId})

  return {
    openView: (params: OpenModalProps) => {
      const schema = querySchema.data
      if (!schema) {
        console.error(`Missing schema ${formId}`)
        return
      }
      dialogs.open(DialogAnswerView, {schema, workspaceId, formId, ...params})
    },
    openEdit: (params: OpenModalProps) => {
      const schema = querySchema.data
      if (!schema) {
        console.error(`Missing schema ${formId}`)
        return
      }
      dialogs.open(DialogAnswerEdit, {schema, workspaceId, formId, ...params})
    },
  }
}
