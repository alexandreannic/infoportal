import React, {useCallback} from 'react'
import {BoxProps, Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import {Txt, useMultipleChoices} from '@/shared'
import {DashboardFilterLabel} from './DashboardFilterLabel'
import {useI18n} from '@/core/i18n'
import {DatatableOptions} from '@/shared/Datatable/util/datatableType'
import {makeStyles} from 'tss-react/mui'

const useStyles = makeStyles<{dense?: boolean}>()((t, {dense}) => ({
  optionSelectAll: {
    display: 'block',
    borderBottom: `1px solid ${t.palette.divider}`,
    height: dense ? 32 : undefined,
  },
  option: {
    whiteSpace: 'nowrap',
    paddingRight: t.spacing(1),
    paddingLeft: t.spacing(1),
    marginRight: 0,
    fontSize: dense ? '.825em' : undefined,
    transition: t.transitions.create('all'),
    height: dense ? 28 : undefined,
    '&:hover': {
      background: t.palette.action.hover,
    },
  },
}))

type SelectProps = {
  onChange: (_: string[]) => void
  value: string[]
  addBlankOption?: boolean
  options: () => undefined | DatatableOptions[]
}

export const DashboardFilterOptions = ({
  value = [],
  label,
  icon,
  onChange,
  ...props
}: {
  icon?: string
  label: string
  dense?: boolean
} & SelectProps &
  Pick<BoxProps, 'sx'>) => {
  const options = useCallback(() => props.options(), [props.options])
  const valuesLabel = useCallback(() => {
    return value.map((_) => (options() ?? []).find((o) => o.value === _)?.label)
  }, [value, options])

  return (
    <DashboardFilterLabel
      icon={icon}
      active={value.length > 0}
      label={
        <>
          {value.length > 0 ? valuesLabel()[0] : label}
          {value.length > 1 && <>&nbsp;+ {value.length - 1}</>}
        </>
      }
      children={(open) => open && <DashboardFilterOptionsContent {...props} value={value} onChange={onChange} />}
      {...props}
    />
  )
}

export const DashboardFilterOptionsContent = ({
  addBlankOption,
  onChange,
  value,
  options,
  dense,
}: SelectProps & {
  dense?: boolean
}) => {
  const {classes, cx} = useStyles({dense})
  const {m} = useI18n()
  const choices = useMultipleChoices({
    addBlankOption,
    value,
    options: options(),
    onChange,
  })
  return (
    <>
      <FormControlLabel
        onClick={choices.toggleAll}
        control={
          <Checkbox
            size="small"
            checked={choices.allChecked}
            indeterminate={choices.allChecked && choices.someChecked}
          />
        }
        label={
          // <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Txt bold sx={{mr: 1.5}} fontSize={dense ? 'small' : undefined}>
            {m.selectAll}
          </Txt>
          // <AAIconBtn icon="clear" size="small" sx={{ml: 1.5}}/>
          // </Box>
        }
        className={cx(classes.option, classes.optionSelectAll)}
      />
      <FormGroup
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          choices.onClick(e.target.name)
        }}
      >
        {choices.options.map((o) => (
          <FormControlLabel
            key={o.value}
            control={<Checkbox size="small" name={o.value ?? undefined} checked={o.checked} />}
            label={<Txt fontSize={dense ? 'small' : undefined}>{o.label}</Txt>}
            className={classes.option}
          />
        ))}
      </FormGroup>
    </>
  )
}
