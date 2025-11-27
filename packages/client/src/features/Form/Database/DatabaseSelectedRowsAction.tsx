import React from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Api} from '@infoportal/api-sdk'
import {Alert} from '@mui/material'
import {UseQuerySubmission} from '@/core/query/submission/useQuerySubmission.js'

export const DatabaseSelectedRowsAction = ({
  formId,
  canDelete,
  workspaceId,
  selectedIds,
}: {
  workspaceId: Api.WorkspaceId
  canDelete: boolean
  formId: Api.FormId
  selectedIds: Api.SubmissionId[]
}) => {
  const {formatLargeNumber, m} = useI18n()
  const queryRemove = UseQuerySubmission.remove()
  return (
    <>
      {canDelete && (
        <Core.Modal
          loading={queryRemove.isPending}
          onConfirm={(event, close) =>
            queryRemove
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
              {queryRemove.error && <Alert color="error">{m.somethingWentWrong}</Alert>}
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
