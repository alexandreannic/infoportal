import {useI18n} from '@infoportal/client-i18n'
import {KoboMapper, Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import {DialogProps} from '@toolpad/core'
import {SchemaInspector} from '@infoportal/form-helper'
import React, {useRef} from 'react'
import {XlsFormFiller, XlsFormFillerHandle} from 'xls-form-filler'
import {Api} from '@infoportal/api-sdk'
import {Link} from '@tanstack/react-router'
import {Core} from '@/shared'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'

export const DialogAnswerEdit = ({
  onClose,
  payload: {schemaInspector, schemaXml, workspaceId, formId, submission, onSubmit},
}: DialogProps<{
  schemaInspector: SchemaInspector
  schemaXml: Api.Form.SchemaXml
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  submission: Submission
  onSubmit: (_: {answers: Record<string, any>; attachments: File[]}) => Promise<void>
}>) => {
  const formRef = useRef<XlsFormFillerHandle>(null)
  const {m} = useI18n()
  return (
    <Dialog open={true} maxWidth="md" fullWidth>
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
        <OdkWebForm
          questionIndex={schemaInspector.lookup.questionIndex}
          formXml={schemaXml as string}
          onSubmit={onSubmit}
        />
        {/*<XlsFormFiller*/}
        {/*  ref={formRef}*/}
        {/*  answers={KoboMapper.unmapSubmissionBySchema(inspector.lookup.questionIndex, submission)}*/}
        {/*  survey={inspector.schema as any}*/}
        {/*  hideActions*/}
        {/*  onSubmit={_ => {*/}
        {/*    console.log('HERE')*/}
        {/*    console.log(_)*/}
        {/*  }}*/}
        {/*/>*/}
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
