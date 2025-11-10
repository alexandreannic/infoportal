import {Box, BoxProps, Checkbox} from '@mui/material'
import {useCell, XlsSurveyRow} from './useStore'

export const CellBoolean = ({
  rowKey,
  field,
  sx,
  ...props
}: Pick<BoxProps, 'sx'> & {
  rowKey: string
  field: keyof XlsSurveyRow
}) => {
  const cell = useCell<boolean>(rowKey, field)
  return <Checkbox checked={cell.value ?? false} onChange={(e, checked) => cell.onChange(checked)} />
}
