import {StateStatus} from 'infoportal-common'
import {Icon, SxProps, useTheme} from '@mui/material'
import React from 'react'
import {statusConfig} from './statusConfig.js'

export const StatusIcon = ({type, filled, sx}: {type: StateStatus; filled?: boolean; sx?: SxProps}) => {
  const t = useTheme()
  const style = statusConfig[type]
  if (!style) {
    return null
  }

  return <Icon title={type} sx={{color: style.color(t), ...sx}} children={filled ? style.icon : style.iconOutlined} />
}
