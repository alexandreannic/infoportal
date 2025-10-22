import {useDialogs} from '@toolpad/core'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Ip} from 'infoportal-api-sdk'

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