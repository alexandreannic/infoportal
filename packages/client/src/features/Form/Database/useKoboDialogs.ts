import {useDialogs} from '@toolpad/core'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Ip} from '@infoportal/api-sdk'
import {useFormContext} from '@/features/Form/Form'

export interface OpenModalProps {
  submission: Submission
}

export const useKoboDialogs = ({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const dialogs = useDialogs()
  const {schema} = useFormContext()

  return {
    openView: (params: OpenModalProps) => {
      dialogs.open(DialogAnswerView, {schema, workspaceId, formId, ...params})
    },
    openEdit: (params: OpenModalProps) => {
      dialogs.open(DialogAnswerEdit, {schema, workspaceId, formId, ...params})
    },
  }
}
