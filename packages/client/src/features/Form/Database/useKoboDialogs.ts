import {useDialogs} from '@toolpad/core'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Api} from '@infoportal/api-sdk'
import {useFormContext} from '@/features/Form/Form'

export interface OpenModalProps {
  submission: Submission
}

export const useKoboDialogs = ({formId, workspaceId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) => {
  const dialogs = useDialogs()
  const schema = useFormContext(_ => _.inspector)

  return {
    openView: (params: OpenModalProps) => {
      if (!schema) return
      dialogs.open(DialogAnswerView, {schema, workspaceId, formId, ...params})
    },
    openEdit: (params: OpenModalProps) => {
      if (!schema) return
      dialogs.open(DialogAnswerEdit, {inspector: schema, workspaceId, formId, ...params})
    },
  }
}
