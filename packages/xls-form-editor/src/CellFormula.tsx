import {Box, BoxProps} from '@mui/material'
import {memo} from 'react'
import {useCell, XlsSurveyRow} from './useStore'

export const CellFormula = memo(
  ({
    rowKey,
    field,
    fieldIndex,
    isBoolean,
    sx,
    ...props
  }: Pick<BoxProps, 'sx'> & {
    fieldIndex?: number
    rowKey: string
    field: keyof XlsSurveyRow
    isBoolean?: false | undefined
  }) => {
    const cell = useCell<string>(rowKey, field, fieldIndex)
    return (
      <Box
        component="input"
        value={cell.value}
        onChange={e => cell.onChange(e.target.value)}
        sx={{
          width: '100%',
          height: '100%',
          border: 'none',
          fontFamily: 'monospace',
          outline: 'none',
          background: 'transparent',
          font: 'inherit',
          padding: 0,
          pl: 0.5,
          margin: 0,
          color: 'inherit',
          boxSizing: 'border-box',
          ...sx,
        }}
      />
    )
  },
)
