import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {SchemaInspector} from '@infoportal/form-helper'
import React from 'react'
import {Api} from '@infoportal/api-sdk'
import {Link} from '@tanstack/react-router'
import {Core} from '@/shared'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'
import {DatabaseLeftPanelProps} from '@/features/Form/Database/DatabaseLeftPanel/DatabaseLeftPanel'

export type SubmissionEditorProps = {
  schemaInspector: SchemaInspector
  schemaXml: Api.Form.SchemaXml
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  submission: Submission
  onSubmit: (_: {answers: Record<string, any>; attachments: File[]}) => Promise<void>
}

export const SubmissionEditorPanel = ({
  onClose,
  payload: {schemaInspector, schemaXml, workspaceId, formId, submission, onSubmit},
}: DatabaseLeftPanelProps<SubmissionEditorProps>) => {
  return (
    <Core.Panel sx={{p: 1}}>
      <Core.PanelTitle
        action={
          <Core.IconBtn onClick={onClose} sx={{marginLeft: 'auto'}}>
            close
          </Core.IconBtn>
        }
      >
        <Link
          to="/$workspaceId/form/$formId/submission/$submissionId"
          params={{workspaceId, formId, submissionId: submission.id}}
          onClick={onClose}
        >
          <Core.IconBtn color="primary">open_in_new</Core.IconBtn>
        </Link>
        {submission.id}
      </Core.PanelTitle>
      <OdkWebForm
        questionIndex={schemaInspector.lookup.questionIndex}
        formXml={schemaXml as string}
        onSubmit={_ => onSubmit(_).then(onClose)}
      />
    </Core.Panel>
  )
}
