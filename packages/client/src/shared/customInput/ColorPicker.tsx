import React from 'react'
import {HexColorPicker} from 'react-colorful'
import {Box, InputBase, SxProps, useTheme} from '@mui/material'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {DotColor} from './ColorPickerLimited'

type Rgba = {r: number; g: number; b: number; a: number}

export interface ColorPickerProps {
  value?: string
  label?: string
  onChange: (color: string) => void
  sx?: SxProps
}

export function ColorPicker({label, value, sx, onChange}: ColorPickerProps) {
  // const colorObj = React.useMemo(() => parseRgbaString(value), [value])
  const t = useTheme()
  const {m} = useI18n()
  return (
    <Core.PopoverWrapper
      content={close => (
        <>
          <HexColorPicker color={value} onChange={value => onChange(value)} />
          <InputBase
            value={value}
            onChange={e => onChange(e.target.value)}
            fullWidth
            slotProps={{input: {sx: {textAlign: 'center'}}}}
          />
        </>
      )}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          m: 0,
          px: 1,
          borderRadius: Core.styleUtils(t).color.input.default.borderRadius,
          minHeight: Core.styleUtils(t).color.input.default.minHeight,
          border: '1px solid',
          borderColor: t.vars.palette.divider,
          justifyContent: 'space-between',
          cursor: 'pointer',
          ...sx,
        }}
      >
        {label ?? m.color}
        {value && value !== '' && <DotColor color={value} />}
      </Box>
    </Core.PopoverWrapper>
  )
}

// function rgbaToString({r, g, b, a}: Rgba): string {
//   return `rgba(${r}, ${g}, ${b}, ${a})`
// }

// function parseRgbaString(value?: string): Rgba {
//   const match = value?.match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/)
//   if (!match) return {r: 0, g: 0, b: 0, a: 1}
//   const [, r, g, b, a] = match
//   return {r: +r, g: +g, b: +b, a: a ? +a : 1}
// }
