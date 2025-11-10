import React from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {Ip} from 'infoportal-api-sdk'
import {Alert} from '@mui/material'

export const DatabaseSelectedRowsAction = ({
  formId,
  canDelete,
  workspaceId,
  selectedIds,
}: {
  workspaceId: Ip.WorkspaceId
  canDelete: boolean
  formId: Ip.FormId
  selectedIds: Ip.SubmissionId[]
}) => {
  const {formatLargeNumber, m} = useI18n()
  const query = useQueryAnswerUpdate()
  return (
    <>
      {canDelete && (
        <Core.Modal
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
          <Core.Btn variant="outlined" color="error" size="small" icon="delete">
            {m.deleteNRows(formatLargeNumber(selectedIds.length))}
          </Core.Btn>
        </Core.Modal>
      )}
    </>
  )
}
