import {Ip} from '@infoportal/api-sdk'
import {Theme} from '@mui/material'
import {Messages} from '@infoportal/client-i18n'
import {
  FormDataFlattenRepeatGroup,
  SchemaInspector,
  SchemaInspectorLookup,
  SchemaInspectorTranslate,
} from '@infoportal/kobo-helper'

export type ExternalFilesChoices = {list_name: string; name: string; label: string}
export type KoboExternalFilesIndex = Record<string, Record<string, ExternalFilesChoices>>

export type Row = FormDataFlattenRepeatGroup.Data

export type Data = Record<string, any>
export type Question = Pick<
  Ip.Form.Question,
  'select_from_list_name' | 'file' | '$xpath' | 'appearance' | 'type' | 'label' | 'name'
>
export type OnRepeatGroupClick = (_: {name: string; row: Row; event: any}) => void

export type ColumnQuestionProps = {
  q: Question
  formId: Ip.FormId
  isReadonly?: boolean
  getRow?: (_: any) => Data
  inspector: SchemaInspector
  choicesIndex: SchemaInspectorLookup['choicesIndex']
  translateQuestion: SchemaInspectorTranslate['question']
  translateChoice: SchemaInspectorTranslate['choice']
  externalFilesIndex?: KoboExternalFilesIndex
  onRepeatGroupClick?: OnRepeatGroupClick
  getFileUrl: (_: {
    formId: Ip.FormId
    submissionId: Ip.SubmissionId
    attachments: Ip.Submission.Attachment[]
    fileName: string
  }) => string | undefined
  t: Theme
  m: Messages
}

export type ColumnQuestionBaseProps = Pick<
  ColumnQuestionProps,
  'inspector' | 'isReadonly' | 'getRow' | 'q' | 'translateQuestion' | 'm'
>

export type ColumnMetaProps = {
  formType: Ip.Form.Type
  getRow?: (_: any) => Row
  koboEditEnketoUrl?: (answerId: Ip.SubmissionId) => string
  isReadonly?: boolean
  dialog: {
    openView: (_: {submission: Ip.Submission<any>}) => void
    openEdit: (_: {submission: Ip.Submission<any>}) => void
  }
  m: Messages
}
