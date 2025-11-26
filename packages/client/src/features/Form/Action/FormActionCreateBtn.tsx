import {FormActionCreate} from '@/features/Form/Action/FormActionCreate.js'
import {useI18n} from '@infoportal/client-i18n'
import {UseQueryPermission} from '@/core/query/useQueryPermission.js'
import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'

export const FormActionCreateBtn = ({
  workspaceId,
  formId,
  ...props
}: {
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
} & Core.BtnProps) => {
  const {m} = useI18n()
  const queryPermission = UseQueryPermission.form({workspaceId, formId})
  if (!queryPermission.data || !queryPermission.data?.action_canCreate) return

  return (
    <Core.Modal
      overrideActions={null}
      content={onClose => <FormActionCreate onClose={onClose} />}
      onConfirm={console.log}
    >
      <Core.Btn icon="add" size="large" variant="outlined" fullWidth sx={{textAlign: 'center', mb: 1}}>
        {m._formAction.newAction}
      </Core.Btn>
    </Core.Modal>
  )
}
