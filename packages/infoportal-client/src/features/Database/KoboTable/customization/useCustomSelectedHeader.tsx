import {ReactNode} from 'react'
import {IpBtn, Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {Kobo} from 'kobo-sdk'
import {AccessSum} from '@/core/sdk/server/access/Access'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {UUID} from 'infoportal-common'

export const useCustomSelectedHeader = ({
  formId,
  access,
  workspaceId,
  selectedIds,
}: {
  workspaceId: UUID
  access: AccessSum
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
}): ReactNode => {
  const {m} = useI18n()
  const query = useQueryAnswerUpdate()
  return (
    <>
      {access.write && (
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
