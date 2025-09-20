import {Theme} from '@mui/material'
import {Kobo} from 'kobo-sdk'
import {alphaVar} from '@infoportal/client-core'

export const defaultColWidth = 120

export const colorRepeatedQuestionHeader = (t: Theme) => alphaVar(t.vars!.palette.info.light, 0.22)

export const ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['begin_group'])

export const editableColsType: Set<Kobo.Form.QuestionType> = new Set([
  'select_one',
  'calculate',
  'note',
  'select_multiple',
  'text',
  'integer',
  'decimal',
  'date',
  'datetime',
])
