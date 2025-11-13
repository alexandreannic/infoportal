import {Ip} from '@infoportal/api-sdk'
import {Kobo} from 'kobo-sdk'
import {Theme} from '@mui/material'
import {Messages} from '@infoportal/client-i18n'
import {KoboSchemaHelper, KoboFlattenRepeatedGroup} from '@infoportal/kobo-helper'

export type ExternalFilesChoices = {list_name: string; name: string; label: string}
export type KoboExternalFilesIndex = Record<string, Record<string, ExternalFilesChoices>>

export type Row = KoboFlattenRepeatedGroup.Data

export type Data = Record<string, any>
export type Question = Pick<
  Kobo.Form.Question,
  'select_from_list_name' | 'file' | '$xpath' | 'appearance' | 'type' | 'label' | 'name'
>
export type OnRepeatGroupClick = (_: {name: string; row: Row; event: any}) => void

export type ColumnQuestionProps = {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  q: Question
  isReadonly?: boolean
  getRow?: (_: any) => Data
  schema: KoboSchemaHelper.Bundle
  choicesIndex: KoboSchemaHelper.Helper['choicesIndex']
  translateQuestion: KoboSchemaHelper.Translation['question']
  translateChoice: KoboSchemaHelper.Translation['choice']
  externalFilesIndex?: KoboExternalFilesIndex
  onRepeatGroupClick?: OnRepeatGroupClick
  queryUpdateAnswer: Query<Ip.Submission.Payload.Update, Ip.BulkResponse<Ip.SubmissionId>>
  getFileUrl: (_: {
    formId: Ip.FormId
    submissionId: Ip.SubmissionId
    attachments: Kobo.Submission.Attachment[]
    fileName: string
  }) => string | undefined
  t: Theme
  m: Messages
}

export type ColumnQuestionBaseProps = Pick<
  ColumnQuestionProps,
  'schema' | 'isReadonly' | 'queryUpdateAnswer' | 'formId' | 'workspaceId' | 'getRow' | 'q' | 'translateQuestion' | 'm'
>

export type ColumnMetaProps = {
  formType: Ip.Form.Type
  workspaceId: Ip.WorkspaceId
  getRow?: (_: any) => Row
  formId: Ip.FormId
  koboEditEnketoUrl?: (answerId: Kobo.SubmissionId) => string
  isReadonly?: boolean
  queryUpdateValidation: Query<Ip.Submission.Payload.UpdateValidation, Ip.BulkResponse<Ip.SubmissionId>>
  dialog: {
    openView: (_: {submission: Ip.Submission<any>}) => void
    openEdit: (_: {submission: Ip.Submission<any>}) => void
  }
  m: Messages
}

export type Query<P, R> = {
  isPending?: boolean
  error?: {
    message: string
  } | null
  mutateAsync: (_: P) => Promise<R>
}
