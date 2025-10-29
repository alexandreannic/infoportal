import React from 'react'
import {Select, MenuItem, FormControl, InputLabel, Box, Typography, SelectChangeEvent, SxProps} from '@mui/material'

const webSafeFonts = [
  'Arial',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Lucida Console',
  'Comic Sans MS',
  'Impact',
  'System-ui',
  'Segoe UI',
  'Open Sans',
] as const

export type WebSafeFont = (typeof webSafeFonts)[number]

interface FontSelectProps {
  value: WebSafeFont
  onChange: (font: WebSafeFont) => void
  sx?: SxProps
}

export const FontSelect: React.FC<FontSelectProps> = ({sx, value, onChange}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as WebSafeFont)
  }

  return (
    <FormControl fullWidth size="small" sx={sx}>
      <InputLabel>Font</InputLabel>
      <Select
        label="Font"
        value={value}
        onChange={handleChange}
        renderValue={font => <Box sx={{fontFamily: font, display: 'flex', alignItems: 'center'}}>{font}</Box>}
      >
        {webSafeFonts.map(font => (
          <MenuItem key={font} value={font}>
            <Typography sx={{fontFamily: font}}>{font}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
