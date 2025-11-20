import {SelectSingle} from '@infoportal/client-core'
import {useCell, useXlsFormStore, XlsSurveyRow} from './useStore'
import {BoxProps} from '@mui/material'
import {seq} from '@axanc/ts-utils'
import {useMemo} from 'react'

export const CellSelectListName = ({
  rowKey,
  field,
  sx,
  ...props
}: Pick<BoxProps, 'sx'> & {
  rowKey: string
  field: keyof XlsSurveyRow
}) => {
  const choices = useXlsFormStore(s => s.schema.choices)

  const options = useMemo(() => {
    return seq(choices)
      ?.map(_ => _.list_name)
      .distinct(_ => _)
  }, [choices])

  const cell = useCell<string>(rowKey, field)
  return <SelectSingle<string> options={options} value={cell.value} onChange={(value, e) => cell.onChange(value)} />
}
