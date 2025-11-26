import {useI18n} from '@infoportal/client-i18n'
import {KoboMapper, Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {DialogProps} from '@toolpad/core'
import {SchemaInspector} from '@infoportal/kobo-helper'
import {useRef} from 'react'
import {XlsFormFiller, XlsFormFillerHandle} from 'xls-form-filler'
import {Ip} from '@infoportal/api-sdk'
import {Link} from '@tanstack/react-router'
import {Core} from '@/shared'

export const DialogAnswerEdit = ({
  onClose,
  payload: {inspector, workspaceId, formId, submission},
}: DialogProps<{
  inspector: SchemaInspector
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  submission: Submission
}>) => {
  const formRef = useRef<XlsFormFillerHandle>(null)
  const {m} = useI18n()
  return (
    <Dialog open={true}>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Link
            to="/$workspaceId/form/$formId/answer/$answerId"
            params={{workspaceId, formId, answerId: submission.id}}
            onClick={() => onClose()}
          >
            <Core.IconBtn color="primary">open_in_new</Core.IconBtn>
          </Link>
          {submission.id}
        </Box>
      </DialogTitle>
      <DialogContent>
        <XlsFormFiller
          ref={formRef}
          answers={KoboMapper.unmapSubmissionBySchema(inspector.lookup.questionIndex, submission)}
          survey={inspector.schema as any}
          hideActions
          onSubmit={_ => {
            console.log('HERE')
            console.log(_)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Core.Btn onClick={() => onClose()}>{m.close}</Core.Btn>
        <Core.Btn variant="contained" icon="check" onClick={() => formRef.current?.submit()}>
          {m.save}
        </Core.Btn>
      </DialogActions>
    </Dialog>
  )
}
