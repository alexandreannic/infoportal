import {Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SxProps, Theme} from '@mui/material'
import React, {ReactNode, useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {makeSx} from '@/core/theme'

type Option<T extends string | number = string> = {value: T; children: ReactNode; key?: string}

export class IpSelectMultipleHelper {
  static readonly makeOption = <T extends string | number = string>(_: Option<T>) => _
}

export interface IpSelectMultipleProps<T extends string | number = string> {
  placeholder?: string | undefined
  disabled?: boolean
  id?: string | undefined
  label?: ReactNode
  showUndefinedOption?: boolean
  options: Option<T>[] | string[]
  sx?: SxProps<Theme>
  defaultValue?: T[]
  value?: T[]
  onChange: (t: T[], e: any) => void
}

const style = makeSx({
  item: {
    py: 0,
    minHeight: '38px !important',
  },
})

const IGNORED_VALUE_FOR_SELECT_ALL_ITEM = 'IGNORED_VALUE'

export const IpSelectMultiple = <T extends string | number>({
  showUndefinedOption,
  label,
  id,
  onChange,
  sx,
  ...props
}: IpSelectMultipleProps<T>) => {
  const {m} = useI18n()
  const [uncontrolledInnerState, setUncontrolledInnerState] = useState<T[]>(props.defaultValue ?? [])

  const value = useMemo(() => {
    return props.value ?? uncontrolledInnerState
  }, [props.value, uncontrolledInnerState])

  const options = useMemo(() => {
    const _options = props.options ?? []
    if (typeof _options[0] === 'string') {
      return props.options.map((_) => ({value: _, children: _})) as Option<T>[]
    }
    return _options as Option<T>[]
  }, [props.options])

  const handleSelectAll = (e: any) => {
    const newValue = value.length === options.length ? [] : options.map((_) => _.value)
    onChange(newValue, e)
    setUncontrolledInnerState(newValue)
  }

  const allSelected = value.length === options.length

  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        label={label}
        size="small"
        margin="dense"
        id={id}
        defaultValue={props.defaultValue}
        multiple={true}
        renderValue={(v: T[]) =>
          options.find((_) => v.includes(_.value))?.children + (v.length > 1 ? ` +${v.length - 1}  selected` : '')
        }
        onChange={(e) => {
          if (e.target.value.includes(IGNORED_VALUE_FOR_SELECT_ALL_ITEM as any)) return
          const newValue = e.target.value as T[]
          onChange(newValue, e)
          setUncontrolledInnerState(newValue)
        }}
        input={
          <OutlinedInput
            label={label}
            // endAdornment={
            //   <CircularProgress size={24} color="secondary"/>
          />
        }
        {...props}
      >
        {options.length > 5 && (
          <MenuItem
            dense
            value={IGNORED_VALUE_FOR_SELECT_ALL_ITEM}
            onClick={handleSelectAll}
            divider
            sx={{
              py: 0,
              fontWeight: (t) => t.typography.fontWeightBold,
            }}
          >
            <Checkbox
              size="small"
              indeterminate={!allSelected && value.length > 0}
              checked={allSelected}
              sx={{
                paddingTop: `8px !important`,
                paddingBottom: `8px !important`,
              }}
            />
            {m.selectAll}
          </MenuItem>
        )}
        {showUndefinedOption && <MenuItem dense value={null as any} sx={style.item} />}
        {options.map((option, i) => (
          <MenuItem dense key={option.key ?? option.value} value={option.value} sx={style.item}>
            <Checkbox
              size="small"
              checked={value.includes(option.value)}
              sx={{
                paddingTop: `8px !important`,
                paddingBottom: `8px !important`,
              }}
            />
            {option.children}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
