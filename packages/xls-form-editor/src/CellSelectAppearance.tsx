import {BoxProps} from '@mui/material'
import {useCell, XlsSurveyRow} from './useStore'
import {SelectSingle} from '@infoportal/client-core'
import {useMemo} from 'react'
import {Kobo} from 'kobo-sdk'
import {appearances} from './settings'

export const CellSelectAppearance = ({
  rowKey,
  field,
  sx,
  questionType,
  ...props
}: Pick<BoxProps, 'sx'> & {
  questionType?: Kobo.Form.QuestionType
  rowKey: string
  field: keyof XlsSurveyRow
}) => {
  const cell = useCell<string>(rowKey, field)
  const options = useMemo(() => {
    if (!questionType) return []
    const names = appearances.filter(_ => _.questionTypes.includes(questionType)).map(_ => _.name)
    return names
  }, [questionType])
  if (options.length === 0) return
  return (
    <SelectSingle
      options={options}
      disabled={!questionType}
      hideNullOption
      value={cell.value}
      onChange={(value, e) => cell.onChange(value)}
    />
  )
}
