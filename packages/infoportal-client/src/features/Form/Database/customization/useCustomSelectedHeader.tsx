import {ReactNode} from 'react'
import {IpBtn, Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {Ip} from 'infoportal-api-sdk'

export const useCustomSelectedHeader = ({
  formId,
  permission,
  workspaceId,
  selectedIds,
}: {
  workspaceId: Ip.WorkspaceId
  permission: Ip.Permission.Form
  formId: Ip.FormId
  selectedIds: Ip.SubmissionId[]
}): ReactNode => {
  const {m} = useI18n()
  const query = useQueryAnswerUpdate()
  return (
    <>
      {permission.answers_canUpdate && (
        <Modal
          loading={query.remove.isPending}
          onConfirm={(event, close) =>
            query.remove
              .mutateAsync({
                workspaceId,
                formId,
                answerIds: selectedIds,
              })
              .then(close)
          }
          title={m.confirmRemove}
          content={<Txt color="hint">{m.confirmRemoveDesc}</Txt>}
        >
          <IpBtn variant="contained" icon="delete">
            {m.deleteSelected}
          </IpBtn>
        </Modal>
      )}
    </>
  )
}
