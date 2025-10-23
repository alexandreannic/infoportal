import {Ip} from 'infoportal-api-sdk'
import React from 'react'
import {Core} from '@/shared'
import {Icon} from '@mui/material'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function AlertWidget({widget, isEditing}: {isEditing?: boolean; widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['Alert']
  const {langIndex} = useDashboardContext()

  return (
    <Core.Alert
      sx={{height: '100%'}}
      severity={config.type}
      title={widget.i18n_title?.[langIndex]}
      children={config.i18n_content?.[langIndex]}
      deletable={!isEditing && config.canHide ? 'transient' : undefined}
      icon={config.iconName ? <Icon>{config.iconName}</Icon> : undefined}
    />
  )
}
