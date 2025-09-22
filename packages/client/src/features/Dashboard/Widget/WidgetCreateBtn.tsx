import {Ip} from 'infoportal-api-sdk'
import {Icon} from '@mui/material'

export const widgetTypeToIcon = {
  [Ip.Dashboard.Widget.Type.PieChart]: 'data_usage',
  [Ip.Dashboard.Widget.Type.GeoChart]: 'map',
  [Ip.Dashboard.Widget.Type.LineChart]: 'line_axis',
  [Ip.Dashboard.Widget.Type.BarChart]: 'bar_chart',
  [Ip.Dashboard.Widget.Type.Table]: 'table',
}

export const WidgetCreateBtn = ({type}: {type: Ip.Dashboard.Widget.Type}) => {
  return <Icon sx={{my: 1, fontSize: '3em'}} children={widgetTypeToIcon[type]} />
}
