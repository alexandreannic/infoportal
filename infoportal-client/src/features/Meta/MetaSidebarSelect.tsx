import React, {useCallback} from 'react'
import {BoxProps, Checkbox, FormControlLabel, FormGroup, useTheme} from '@mui/material'
import {makeSx, Txt} from 'mui-extension'
import {useI18n} from '@/core/i18n'
import {combineSx} from '@/core/theme'
import {DatatableOptions} from '@/shared/Datatable/util/datatableType'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'

const css = makeSx({
  optionSelectAll: {
    display: 'block',
    borderBottom: t => `1px solid ${t.palette.divider}`,
    height: 30,
  },
  option: {
    height: 26,
    whiteSpace: 'nowrap',
    px: 1,
    mr: 0,
    transition: t => t.transitions.create('all'),
    '&:hover': {
      background: t => t.palette.action.hover,
    }
  }
})

export const MetaSidebarSelect = ({
  value = [],
  label,
  addBlankOption,
  icon,
  onChange,
  isCollapsed,
  ...props
}: {
  addBlankOption?: boolean
  icon?: string
  value: string[]
  label: string
  options: () => undefined | DatatableOptions[]// {value: string, label?: string}[]
  onChange?: (_: string[]) => void
  isCollapsed: boolean
} & Pick<BoxProps, 'sx'>) => {
  const {m} = useI18n()
  const t = useTheme()
  const options = useCallback(() => props.options(), [props.options])

  const valuesLabel = useCallback(() => {
    return value.map(_ => (options() ?? []).find(o => o.value === _)?.label)
  }, [value, options])

  const allValues = useCallback(() => (options() ?? []).map(_ => _.value), [options])

  const someChecked = useCallback(() => !!allValues().find(_ => value?.includes(_ as any)), [value, allValues])

  const allChecked = useCallback(() => allValues().length === value?.length, [value, allValues])

  const toggleAll = useCallback(() => onChange?.(value?.length === 0 ? allValues() : []), [onChange, allValues])

  if (isCollapsed) {
    return null
  }

  return (
    <>
      {/*< sx={{borderRadius: t.shape.borderRadius + 'px', background: styleUtils(t).color.toolbar, p: .5, ...props.sx}}>*/}
      {/*  <Txt uppercase color="hint" size="small" block>*/}
      {/*    {label}*/}
      {/*  </Txt>*/}
      <FormControlLabel
        onClick={toggleAll}
        control={<Checkbox size="small" checked={allChecked()} indeterminate={!allChecked() && someChecked()}/>}
        label={
          // <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Txt bold size="small" sx={{mr: 1.5}}>{m.selectAll}</Txt>
          // <AAIconBtn icon="clear" size="small" sx={{ml: 1.5}}/>
          // </Box>
        }
        sx={combineSx(css.option, css.optionSelectAll)}
      />
      <FormGroup onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) return
        if (e.target.checked) {
          onChange([...value, e.target.name])
        } else {
          onChange(value.filter(_ => _ !== e.target.name))
        }
      }}>
        {addBlankOption && (
          <FormControlLabel
            control={<Checkbox size="small" name={DatatableUtils.blank} checked={value.includes(DatatableUtils.blank)}/>}
            label={DatatableUtils.blankLabel}
            sx={css.option}
          />
        )}
        {(options() ?? []).map(o =>
          <FormControlLabel
            key={o.value}
            title={o.label as string}
            control={<Checkbox size="small" name={o.value ?? undefined} checked={value.includes(o.value as any)}/>}
            label={<Txt size="small">{o.label}</Txt>}
            sx={css.option}
          />
        )}
      </FormGroup>
    </>
  )
}
