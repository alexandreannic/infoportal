import {Ip} from 'infoportal-api-sdk'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/Card/CardWidget'
import React from 'react'

export function TableWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['Table']

  if (!config.column?.questionName || !config.row?.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return <></>
}
