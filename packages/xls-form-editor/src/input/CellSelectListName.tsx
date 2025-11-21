import {SelectSingle} from '@infoportal/client-core'
import {CellPointer, useCell, useXlsFormStore, XlsSurveyRow} from '../core/useStore'
import {BoxProps} from '@mui/material'
import {seq} from '@axanc/ts-utils'
import {useMemo} from 'react'

export const CellSelectListName = ({
  cellPointer,
  sx,
  ...props
}: Pick<BoxProps, 'sx'> & {
  cellPointer: CellPointer
}) => {
  const cell = useCell<string>(cellPointer)
  const choices = useXlsFormStore(s => s.schema.choices)

  const options = useMemo(() => {
    return seq(choices)
      ?.map(_ => _.list_name)
      .distinct(_ => _)
  }, [choices])

  return <SelectSingle<string> options={options} value={cell.value} onChange={(value, e) => cell.onChange(value)} />
}
