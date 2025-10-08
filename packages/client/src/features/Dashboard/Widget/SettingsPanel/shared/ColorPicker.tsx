import {Core} from '@/shared'
import {Box, BoxProps, useTheme} from '@mui/material'
import {useState} from 'react'
import {useI18n} from '@infoportal/client-i18n'

const Dot = ({color, selected, sx, ...props}: BoxProps & {color: string; selected?: boolean}) => {
  const t = useTheme()
  return (
    <Box
      {...props}
      sx={{
        height: 22,
        width: 22,
        borderRadius: 22,
        background: color,
        border: '2px solid',
        borderColor: selected ? t.vars.palette.background.paper : color,
        boxShadow: selected ? `0 0 0 2px ${color}` : undefined,
        ...sx,
      }}
    />
  )
}

export const ColorPicker = ({
  value: valueProp,
  defaultValue,
  onChange,
  label,
  sx,
  ...props
}: BoxProps & {
  label?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string | null) => void
}) => {
  const {m} = useI18n()
  const t = useTheme()
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const handleSelect = (color: string | null) => {
    if (!isControlled) setUncontrolledValue(color ?? '')
    onChange?.(color)
  }
  const colors = [
    t.palette.primary.dark,
    t.palette.primary.main,
    t.palette.primary.light,
    t.palette.info.dark,
    t.palette.info.main,
    t.palette.info.light,
    t.palette.success.dark,
    t.palette.success.main,
    t.palette.success.light,
    t.palette.warning.dark,
    t.palette.warning.main,
    t.palette.warning.light,
    t.palette.error.dark,
    t.palette.error.main,
    t.palette.error.light,
    t.palette.text.primary,
    t.palette.text.secondary,
    t.palette.text.disabled,
  ]
  return (
    <Core.PopoverWrapper
      content={close => (
        <Box
          sx={{
            p: 1,
            display: 'grid',
            gap: '0.5rem',
            gridTemplateColumns: 'repeat(6, 1fr)',
          }}
        >
          <Core.Btn
            onClick={() => handleSelect(null as any)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{textAlign: 'center', gridColumn: '1/7'}}
          >
            {m.none}
          </Core.Btn>
          {colors.map(color => (
            <Dot
              color={color}
              key={color}
              onClick={() => {
                handleSelect(color)
                close()
              }}
              selected={value === color}
            />
          ))}
        </Box>
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
        {...props}
      >
        {label ?? m.color}
        {value && value !== '' && <Dot color={value} />}
      </Box>
    </Core.PopoverWrapper>
  )
}
