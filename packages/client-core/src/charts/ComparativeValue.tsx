import {Txt, TxtProps} from '../ui'
import {Box, Icon, Tooltip} from '@mui/material'
import React, {ReactNode} from 'react'

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
  return (
    <>
      <Txt
        sx={{
          color: t => (value > 0 ? t.vars.palette.success.main : t.vars.palette.error.main),
          display: 'inline-flex',
          alignItems: 'center',
          ...sx,
        }}
        {...props}
      >
        <Icon sx={{ml: 1}} fontSize="inherit">
          {value > 0 ? 'north' : 'south'}
        </Icon>
        <Box sx={{ml: 0.25}}>
          {value >= 0 && '+'}
          {value.toFixed(value >= 10 ? fractionDigits : 1)}
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
