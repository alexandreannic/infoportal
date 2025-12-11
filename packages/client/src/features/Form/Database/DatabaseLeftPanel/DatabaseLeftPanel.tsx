import {Dispatch, SetStateAction, useCallback} from 'react'
import {Box, Collapse, useTheme} from '@mui/material'
import {DatabaseViewEditor} from '@/features/Form/Database/DatabaseView/DatabaseView'
import {SubmissionEditorPanel} from '@/features/Form/Database/DatabaseLeftPanel/SubmissionEditorPanel'
import {SubmissionViewerPanel} from '@/features/Form/Database/DatabaseLeftPanel/SubmissionViewerPanel'
import {useFormContext} from '@/features/Form/Form'
import {Api} from '@infoportal/api-sdk'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {UseQuerySubmission} from '@/core/query/submission/useQuerySubmission'

export type DatabaseLeftPanelProps<T extends object | undefined> = {
  onClose: () => void
  payload: T
}

export type DatabaseLeftPanelState =
  | {
      type: 'SUBMISSION_VIEW'
      payload: {submission: Api.Submission}
    }
  | {
      type: 'SUBMISSION_EDIT'
      payload: {submission: Api.Submission}
    }
  | {
      type: 'DATABASE_VIEWS'
      payload?: undefined
    }

export const DatabaseLeftPanel = ({
  state,
  setState,
}: {
  state?: DatabaseLeftPanelState
  setState: Dispatch<SetStateAction<DatabaseLeftPanelState | undefined>>
}) => {
  const t = useTheme()

  const schemaXml = useFormContext(_ => _.schemaXml)
  const formId = useFormContext(_ => _.formId)
  const inspector = useFormContext(_ => _.inspector)
  const workspaceId = useFormContext(_ => _.workspaceId)
  const handleClose = useCallback(() => setState(undefined), [setState])
  const queryUpdate = UseQuerySubmission.updateSingle()

  return (
    <Collapse orientation="horizontal" in={!!state} sx={{flexShrink: 0}}>
      <Box sx={{width: state?.type === 'DATABASE_VIEWS' ? 340 : 420, transition: t.transitions.create('all'), mr: 1}}>
        {(() => {
          if (!state) return
          switch (state.type) {
            case 'DATABASE_VIEWS': {
              return <DatabaseViewEditor onClose={handleClose} payload={undefined} />
            }
            case 'SUBMISSION_VIEW': {
              if (!schemaXml || !inspector) {
                return <AlertMissingSchema />
              }
              return (
                <SubmissionViewerPanel
                  workspaceId={workspaceId}
                  formId={formId}
                  schemaInspector={inspector}
                  submission={state.payload.submission}
                  onClose={handleClose}
                />
              )
            }
            case 'SUBMISSION_EDIT': {
              if (!schemaXml || !inspector || !state.payload.submission) {
                return <AlertMissingSchema />
              }
              return (
                <SubmissionEditorPanel
                  schemaXml={schemaXml}
                  formId={formId}
                  schemaInspector={inspector}
                  workspaceId={workspaceId}
                  submission={state.payload.submission}
                  onSubmit={async _ =>
                    queryUpdate.mutateAsync({
                      formId,
                      submissionId: state.payload.submission.id,
                      workspaceId,
                      answers: _.answers,
                    })
                  }
                  onClose={handleClose}
                />
              )
            }
          }
        })()}
      </Box>
    </Collapse>
  )
}

function AlertMissingSchema() {
  const {m} = useI18n()
  return (
    <Core.Alert severity="error" title={m.cannotEditWithoutSchema}>
      <Core.Btn icon="refresh" onClick={() => location.reload()} color="primary" variant="contained" sx={{mr: 1}}>
        {m.refresh}
      </Core.Btn>
    </Core.Alert>
  )
}
