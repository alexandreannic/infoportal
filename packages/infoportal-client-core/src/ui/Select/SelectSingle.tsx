import {
  Box,
  CircularProgress,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
  SvgIconTypeMap,
  SxProps,
  Theme,
} from '@mui/material'
import React, {ReactNode, useMemo} from 'react'
import {makeSx} from 'infoportal-client/src/core/theme.js'
import {Txt} from 'infoportal-client/src/shared/index.js'
import {OverridableComponent} from '@mui/material/OverridableComponent'
import {ArrowDropDownIcon} from '@mui/x-date-pickers-pro'

export type IpSelectOption<T extends string | number = string> = {
  value: T
  children: ReactNode
  key?: string
}

type TType = string | number

export type IpSelectSingleBaseProps<T extends TType = string> = {
  placeholder?: string | undefined
  disabled?: boolean
  id?: string | undefined
  label?: ReactNode
  options: IpSelectOption<T>[] | string[]
  sx?: SxProps<Theme>
  defaultValue?: T
  value?: T | null
  loading?: boolean
  multiple?: false
  hideNullOption?: boolean
  renderValue?: SelectProps<T>['renderValue']
  startAdornment?: SelectProps<T>['startAdornment']
}

export type IpSelectSingleNullableProps<T extends TType = string> = IpSelectSingleBaseProps<T> & {
  hideNullOption?: false
  onChange: (t: T | null, e: any) => void
}

export type IpSelectSingleNonNullableProps<T extends TType = string> = IpSelectSingleBaseProps<T> & {
  hideNullOption: true
  onChange: (t: T, e: any) => void
}

export type IpSelectSingleProps<T extends TType = string> =
  | IpSelectSingleNonNullableProps<T>
  | IpSelectSingleNullableProps<T>

const style = makeSx({
  item: {
    py: 0,
    minHeight: '38px !important',
  },
})

const IGNORED_VALUE_EMPTY = ''

export const ipSelectItem = <T extends any>({
  icon,
  desc,
  value,
  title,
}: {
  icon?: string
  desc: string
  title: string
  value: T
}) => {
  return {
    value,
    children: (
      <Box sx={{display: 'flex', py: 0.5}}>
        {icon && <Icon sx={{mr: 1, color: t => t.vars.palette.text.secondary}}>{icon}</Icon>}
        <Box>
          <Box>{title}</Box>
          <Txt color="hint" size="small" sx={{lineHeight: 1}}>
            {desc}
          </Txt>
        </Box>
      </Box>
    ),
  }
}

const LoadingIcon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> = (props: any) => (
  <CircularProgress
    {...props}
    color="primary"
    size={20}
    sx={{
      color: t => t.palette.primary.main + ' !important',
      marginTop: '-3px',
      padding: 0,
    }}
  />
)

export const IpSelectSingle = <T extends TType>({
  defaultValue,
  hideNullOption,
  label,
  disabled,
  id,
  loading,
  onChange,
  sx,
  value,
  placeholder,
  ...props
}: IpSelectSingleProps<T>) => {
  const options = useMemo(() => {
    const _options = props.options ?? []
    if (typeof _options[0] === 'string') {
      return props.options.map(_ => ({value: _, children: _})) as IpSelectOption<T>[]
    }
    return _options as IpSelectOption<T>[]
  }, [props.options])

  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        label={label}
        size="small"
        disabled={loading || disabled}
        IconComponent={loading ? LoadingIcon : ArrowDropDownIcon}
        margin="dense"
        id={id}
        value={value ?? IGNORED_VALUE_EMPTY}
        defaultValue={defaultValue}
        //<div style={{minWidth: 20}}>
        //  <CircularProgress size={20}/>
        //</div>
        multiple={false}
        onChange={e => {
          const value = e.target.value as T
          if (value === IGNORED_VALUE_EMPTY) onChange(null as any, e)
          onChange(value, e)
          // setInnerValue(value)
        }}
        input={<OutlinedInput label={label} placeholder={placeholder} />}
        {...props}
      >
        {(!hideNullOption || placeholder) && (
          <MenuItem dense value={null as any} sx={style.item}>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option, i) => (
          <MenuItem dense key={option.key ?? option.value} value={option.value} sx={style.item}>
            {option.children}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
