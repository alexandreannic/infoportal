import {Ip} from 'infoportal-api-sdk'
import React from 'react'
import {Core} from '@/shared'
import {Icon} from '@mui/material'

export function AlertWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['Alert']

  return (
    <Core.Alert
      sx={{height: '100%'}}
      severity={config.type}
      title={widget.title}
      children={config.content}
      deletable={config.canHide ? 'transient' : undefined}
      icon={config.iconName ? <Icon>{config.iconName}</Icon> : undefined}
    />
  )
}
