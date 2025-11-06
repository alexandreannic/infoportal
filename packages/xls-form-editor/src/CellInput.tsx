import {Box, BoxProps, styled} from '@mui/material'
import {useCell, XlsSurveyRow} from './useStore'
import {memo} from 'react'

export const CellInput = memo(
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
          outline: 'none',
          background: 'transparent',
          font: 'inherit',
          padding: 0,
          pl: .5,
          margin: 0,
          color: 'inherit',
          boxSizing: 'border-box',
          ...sx,
        }}
      />
    )
  },
)
