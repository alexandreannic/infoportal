import {Txt, TxtProps} from '../ui'
import {Box, Icon, Tooltip, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {fnSwitch} from '@axanc/ts-utils'

export const ComparativeValue = ({
  value,
  children,
  fractionDigits = 0,
  tooltip,
  sx,
  ...props
}: TxtProps & {
  children?: ReactNode
  fractionDigits?: number
  value: number
  tooltip?: string
}) => {
  const t = useTheme()
  const type = value === 0 ? 'equal' : value > 0 ? 'more' : 'less'
  return (
    <>
      <Txt
        sx={{
          color: fnSwitch(type, {
            equal: t.vars.palette.info.main,
            more: t.vars.palette.success.main,
            less: t.vars.palette.error.main,
          }),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          ...sx,
        }}
        {...props}
      >
        <Icon sx={{ml: 1, width: 24}} fontSize="inherit">
          {fnSwitch(type, {
            equal: 'equal',
            more: 'north',
            less: 'south',
          }, () => '')}
        </Icon>
        <Box sx={{ml: 0.25}}>
          {value > 0 && '+'}
          {/*{value === 0 && '='}*/}
          {value !== 0 && value.toFixed(Math.abs(value) > 1 ? fractionDigits : 1)}
        </Box>
        {children}
      </Txt>
      {tooltip && (
        <Tooltip title={tooltip}>
          <Icon sx={{fontSize: '15px !important'}} color="disabled">
            info
          </Icon>
        </Tooltip>
      )}
    </>
  )
}
