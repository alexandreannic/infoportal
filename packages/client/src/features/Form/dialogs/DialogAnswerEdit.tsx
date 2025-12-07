import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {SchemaInspector} from '@infoportal/form-helper'
import React from 'react'
import {Api} from '@infoportal/api-sdk'
import {Link} from '@tanstack/react-router'
import {Core} from '@/shared'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'
import {DatabaseLeftPanelProps} from '@/features/Form/Database/DatabaseLeftPanel'

export type DialogAnswerEditProps = {
  schemaInspector: SchemaInspector
  schemaXml: Api.Form.SchemaXml
  workspaceId: Api.WorkspaceId
  formId: Api.FormId
  submission: Submission
  onSubmit: (_: {answers: Record<string, any>; attachments: File[]}) => Promise<void>
}

export const DialogAnswerEdit = ({
  onClose,
  payload: {schemaInspector, schemaXml, workspaceId, formId, submission, onSubmit},
}: DatabaseLeftPanelProps<DialogAnswerEditProps>) => {
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
          to="/$workspaceId/form/$formId/answer/$answerId"
          params={{workspaceId, formId, answerId: submission.id}}
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
    </Core.Panel>
  )
}
