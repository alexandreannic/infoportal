import {ReactNode} from 'react'
import {IpBtn, Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Kobo} from 'kobo-sdk'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export const useCustomSelectedHeader = ({
  formId,
  permission,
  workspaceId,
  selectedIds,
}: {
  workspaceId: UUID
  permission: Ip.Permission.Form
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
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
