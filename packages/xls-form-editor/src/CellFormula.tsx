import {Box, BoxProps} from '@mui/material'
import {memo} from 'react'
import {CellPointer, useCell, XlsSurveyRow} from './useStore'

export const CellFormula = memo(
  ({
    cellPointer,
    isBoolean,
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
