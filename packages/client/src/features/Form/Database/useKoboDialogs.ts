import {useDialogs} from '@toolpad/core'
import {DialogAnswerView} from '@/features/Form/dialogs/DialogAnswerView'
import {DialogAnswerEdit} from '@/features/Form/dialogs/DialogAnswerEdit'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Api} from '@infoportal/api-sdk'
import {useFormContext} from '@/features/Form/Form'
import {UseQuerySubmission} from '@/core/query/submission/useQuerySubmission.js'

export interface OpenModalProps {
  submission: Submission
}

export const useKoboDialogs = ({formId, workspaceId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) => {
  const dialogs = useDialogs()
  const schemaInspector = useFormContext(_ => _.inspector)
  const schemaXml = useFormContext(_ => _.schemaXml)
  const z = UseQuerySubmission.bulkUpdateQuestion()

  return {
    openView: (params: OpenModalProps) => {
      if (!schemaInspector) return
      dialogs.open(DialogAnswerView, {schemaInspector, workspaceId, formId, ...params})
    },
    openEdit: (params: OpenModalProps) => {
      if (!schemaInspector || !schemaXml) return
      dialogs.open(DialogAnswerEdit, {
        schemaInspector,
        schemaXml,
        workspaceId,
        formId,
        onSubmit: async _ => console.log(_),
        ...params,
      })
    },
  }
}
