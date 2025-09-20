import {StateStatus} from 'infoportal-common'
import React, {ReactNode, useMemo} from 'react'
import {Box, useTheme} from '@mui/material'
import {statusConfig} from './statusConfig'
import {StatusIcon} from './StatusIcon'
import {Obj} from '@axanc/ts-utils'
import {SelectOption, SelectSingle, SelectSingleNullableProps} from '../Select/SelectSingle'
import {useI18n} from '@infoportal/client-i18n'

export type SelectStatusProps<T extends string> = Omit<SelectSingleNullableProps<T>, 'hideNullOption' | 'options'> & {
  status: Record<T, string>
  labels: Record<T, StateStatus>
  compact?: boolean
  iconFilled?: boolean
}

export const SelectStatus = <T extends string>({
  status,
  placeholder,
  compact,
  labels,
  iconFilled,
  ...props
}: SelectStatusProps<T>) => {
  const {m} = useI18n()
  const options: SelectOption<any>[] = useMemo(() => {
    return Obj.keys(status).map(_ => ({
      value: _,
      children: (
        <StatusOption iconFilled={iconFilled} type={labels[_]}>
          {_ as string}
        </StatusOption>
      ),
    }))
  }, [labels, status])
  return (
    <SelectSingle
      renderValue={_ =>
        compact ? (
          <StatusIcon filled={iconFilled} type={labels[_]} sx={{display: 'block'}} />
        ) : (
          <StatusOption type={labels[_]}>{_ as string}</StatusOption>
        )
      }
      placeholder={placeholder ?? m.status}
      hideNullOption={false}
      options={options}
      {...props}
    />
  )
}

function StatusOption({type, iconFilled, children}: {iconFilled?: boolean; type: StateStatus; children: ReactNode}) {
  const t = useTheme()
  const style = statusConfig[type]
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <StatusIcon filled={iconFilled} type={type} />
      <Box sx={{ml: 0.5, color: style.color(t), fontWeight: 700}}>{children}</Box>
    </Box>
  )
}
