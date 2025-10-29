import {styleUtils} from '@infoportal/client-core'
import {Box, InputBase, InputLabel, Slider, SliderProps, useTheme} from '@mui/material'
import {useRef, useState} from 'react'

const sliderHeight = 4

export function SliderNumberInput({
  label,
  value,
  disabled,
  min,
  max,
  onChange,
  sx,
  ...props
}: Pick<SliderProps, 'disabled' | 'min' | 'max' | 'sx'> & {
  value?: number
  onChange: (e: any, value?: number) => void
  label?: string
}) {
  const t = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  return (
    <Box
      onClick={() => inputRef.current?.focus()}
      sx={{
        position: 'relative',
        ...styleUtils(t).color.input.default,
        // border: '1px solid',
        paddingBottom: sliderHeight + 'px',
        borderColor: focused ? t.vars.palette.primary.main : t.vars.palette.divider,
        mb: 1,
        boxShadow: focused ? `inset 0 0 0 1px ${t.vars.palette.primary.main}` : undefined,
        transition: t.transitions.create('all'),
        ...sx,
      }}
    >
      <Box sx={{px: t.vars.spacing, display: 'flex', alignItems: 'center'}}>
        <InputLabel sx={{ml: 0.5}}>{label}</InputLabel>
        <InputBase
          disabled={disabled}
          inputRef={inputRef}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          slotProps={{input: {min, max, sx: {textAlign: 'right'}}}}
          sx={{py: 0.25, pr: 0, flex: 1, textAlign: 'right'}}
          value={value}
          type="number"
          onChange={e => {
            onChange?.(+e.target.value)
          }}
        />
      </Box>
      <Slider
        sx={{
          height: sliderHeight,
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        }}
        disabled={disabled}
        onChange={(e, v) => onChange(v)}
        value={value}
        min={min}
        max={max}
        {...props}
      />
    </Box>
  )
}
