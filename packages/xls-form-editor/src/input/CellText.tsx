import {Box, BoxProps, styled} from '@mui/material'
import {CellPointer, useCell, XlsChoicesRow, XlsSurveyRow} from '../core/useStore'
import {memo} from 'react'

export const CellText = memo(
  ({
    isBoolean,
    cellPointer,
    sx,
    ...props
  }: Pick<BoxProps, 'sx'> & {
    cellPointer: CellPointer
    isBoolean?: false | undefined
  }) => {
    const cell = useCell<string>(cellPointer)
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
