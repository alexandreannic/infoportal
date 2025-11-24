import {Box, BoxProps} from '@mui/material'
import {CellPointer, useCell} from '../core/useCell'
import {ChangeEvent, memo} from 'react'

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
        onChange={(e: ChangeEvent<HTMLInputElement>) => cell.onChange(e.target.value)}
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
