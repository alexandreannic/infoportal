import {Core} from '@/shared'
import {UseQueryFromAction} from '@/core/query/useQueryFromAction.js'
import {useI18n} from '@/core/i18n/index.js'
import {useIpToast} from '@/core/useToast.js'
import {Ip} from 'infoportal-api-sdk'

export const FormActionRunBtn = ({
  workspaceId,
  formId,
  ...props
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
} & Core.BtnProps) => {
  const {m} = useI18n()
  const queryRunAllActionByForm = UseQueryFromAction.runAllActionByForm(workspaceId, formId)
  const {toastSuccess} = useIpToast()
  return (
    <Core.Modal
      title={m._formAction.reRunOnAllData}
      loading={queryRunAllActionByForm.isPending}
      content={<div dangerouslySetInnerHTML={{__html: m._formAction.reRunOnAllDataDetails}} />}
      onConfirm={(e, close) => {
        queryRunAllActionByForm.mutateAsync()
        toastSuccess(m._formAction.syncStarted)
        close()
      }}
    >
      <Core.Btn {...props} icon="refresh" variant="contained">
        {m._formAction.reRunOnAllData}
      </Core.Btn>
    </Core.Modal>
  )
}
