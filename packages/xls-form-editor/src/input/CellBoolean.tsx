import {Box, BoxProps, Checkbox} from '@mui/material'
import {CellPointer, useCell, XlsSurveyRow} from '../core/useStore'

export const CellBoolean = ({
  cellPointer,
  sx,
  ...props
}: Pick<BoxProps, 'sx'> & {
  cellPointer: CellPointer
}) => {
  const cell = useCell<boolean>(cellPointer)
  return <Checkbox checked={cell.value ?? false} onChange={(e, checked) => cell.onChange(checked)} />
}
