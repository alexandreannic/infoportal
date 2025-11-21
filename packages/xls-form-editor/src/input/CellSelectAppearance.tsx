import {BoxProps} from '@mui/material'
import {CellPointer, useCell, XlsSurveyRow} from '../core/useStore'
import {SelectSingle} from '@infoportal/client-core'
import {useMemo} from 'react'
import {appearances} from '../core/settings'
import {Ip} from '@infoportal/api-sdk'

export const CellSelectAppearance = ({
  cellPointer,
  sx,
  questionType,
  ...props
}: Pick<BoxProps, 'sx'> & {
  questionType?: Ip.Form.QuestionType
  cellPointer: CellPointer
}) => {
  const cell = useCell<string>(cellPointer)
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
