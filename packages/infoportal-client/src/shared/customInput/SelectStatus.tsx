import {KeyOf, Obj} from '@axanc/ts-utils'
import React, {ReactNode, useMemo} from 'react'
import {StateStatus} from 'infoportal-common'
import {Box, Icon, SxProps, Theme, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {Ip} from 'infoportal-api-sdk'
import {Core} from '@/shared'

export namespace SelectStatusConfig {
  export const enumStatus = {
    KoboValidation: Ip.Submission.Validation,
  }

  export type EnumStatus = keyof typeof enumStatus

  export const stateStatusStyle: Record<
    StateStatus,
    {color: (t: Theme) => string; colorContrast: (t: Theme) => string; iconOutlined: string; icon: string}
  > = {
    error: {
      color: t => t.vars.palette.error.main,
      colorContrast: t => t.vars.palette.error.contrastText,
      icon: 'error',
      iconOutlined: 'error_outline',
    },
    warning: {
      color: t => t.vars.palette.warning.main,
      colorContrast: t => t.vars.palette.warning.contrastText,
      icon: 'access_time_filled',
      iconOutlined: 'schedule',
    },
    info: {
      color: t => t.vars.palette.info.main,
      colorContrast: t => t.vars.palette.info.contrastText,
      icon: 'info',
      iconOutlined: 'info',
    },
    success: {
      color: t => t.vars.palette.success.main,
      colorContrast: t => t.vars.palette.success.contrastText,
      icon: 'check_circle',
      iconOutlined: 'check_circle_outline',
    },
    disabled: {
      color: t => t.vars.palette.text.disabled,
      colorContrast: t => t.vars.palette.divider,
      icon: 'remove_circle',
      iconOutlined: 'remove_circle_outline',
    },
  }

  export const customStatusToStateStatus = {
    KoboValidation: {
      Approved: 'success',
      Pending: 'warning',
      Rejected: 'error',
      Flagged: 'info',
      UnderReview: 'warning',
    } as Record<Ip.Submission.Validation, StateStatus>,
  }
}

export const OptionLabelType = ({
  type,
  iconFilled,
  children,
}: {
  iconFilled?: boolean
  type: StateStatus
  children: ReactNode
}) => {
  const t = useTheme()
  const style = SelectStatusConfig.stateStatusStyle[type]
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <StateStatusIcon filled={iconFilled} type={type} />
      <Box sx={{ml: 0.5, color: style.color(t), fontWeight: 700}}>{children}</Box>
    </Box>
  )
}

export const StateStatusIcon = ({type, filled, sx}: {type: StateStatus; filled?: boolean; sx?: SxProps}) => {
  const t = useTheme()
  const style = SelectStatusConfig.stateStatusStyle[type]
  if (!style) {
    return null
  }

  return <Icon title={type} sx={{color: style.color(t), ...sx}} children={filled ? style.icon : style.iconOutlined} />
}

type SelectStatusProps<T extends string> = Omit<Core.SelectSingleNullableProps<T>, 'hideNullOption' | 'options'> & {
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
  const options: Core.SelectOption<any>[] = useMemo(() => {
    return Obj.keys(status).map(_ => ({
      value: _,
      children: (
        <OptionLabelType iconFilled={iconFilled} type={labels[_]}>
          {_ as string}
        </OptionLabelType>
      ),
    }))
  }, [labels, status])
  return (
    <Core.SelectSingle
      renderValue={_ =>
        compact ? (
          <StateStatusIcon filled={iconFilled} type={labels[_]} sx={{display: 'block'}} />
        ) : (
          <OptionLabelType type={labels[_]}>{_ as string}</OptionLabelType>
        )
      }
      placeholder={placeholder ?? m.status}
      hideNullOption={false}
      options={options}
      {...props}
    />
  )
}

export const SelectStatusBy = <
  K extends SelectStatusConfig.EnumStatus,
  V extends (typeof SelectStatusConfig.enumStatus)[K][KeyOf<(typeof SelectStatusConfig.enumStatus)[K]>],
>(
  // @ts-ignore
  props: Omit<SelectStatusProps<V>, 'status' | 'labels'> & {
    enum: K
  },
) => {
  return (
    // @ts-ignore
    <SelectStatus
      {...props}
      iconFilled={props.enum === 'KoboValidation'}
      labels={SelectStatusConfig.customStatusToStateStatus[props.enum]}
      status={SelectStatusConfig.enumStatus[props.enum]}
    />
  )
}
