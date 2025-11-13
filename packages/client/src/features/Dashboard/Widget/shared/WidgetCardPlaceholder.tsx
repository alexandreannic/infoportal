import {Ip} from '@infoportal/api-sdk'
import {Box, Icon} from '@mui/material'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React from 'react'

export function WidgetCardPlaceholder({type}: {type: Ip.Dashboard.Widget.Type}) {
  return (
    <Box sx={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Icon sx={{fontSize: '3.5em'}} color="disabled">
        {widgetTypeToIcon[type]}
      </Icon>
    </Box>
  )
}