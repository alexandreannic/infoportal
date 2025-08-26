import React, {ReactNode} from 'react'
import {IpBtn, Modal, Txt} from '@/shared'
import {useI18n} from '@/core/i18n'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {Ip} from 'infoportal-api-sdk'
import {Alert} from '@mui/material'

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
      {permission.answers_canDelete && (
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
          content={
            <>
              {query.remove.error && <Alert color="error">{m.somethingWentWrong}</Alert>}
              <Core.Txt color="hint">{m.confirmRemoveDesc}</Core.Txt>
            </>
          }
        >
          <Core.Btn variant="contained" icon="delete">
            {m.deleteSelected}
          </CoreBtn>
        </Modal>
      )}
    </>
  )
}
