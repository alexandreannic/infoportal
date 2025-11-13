import {Ip} from '@infoportal/api-sdk'
import {Icon, IconProps} from '@mui/material'

export const widgetTypeToIcon = {
  [Ip.Dashboard.Widget.Type.Card]: 'pin',
  [Ip.Dashboard.Widget.Type.PieChart]: 'data_usage',
  [Ip.Dashboard.Widget.Type.GeoChart]: 'map',
  [Ip.Dashboard.Widget.Type.LineChart]: 'line_axis',
  [Ip.Dashboard.Widget.Type.GeoPoint]: 'location_on',
  [Ip.Dashboard.Widget.Type.Alert]: 'text_fields',
  // [Ip.Dashboard.Widget.Type.BarChart]: 'bar_chart',
  [Ip.Dashboard.Widget.Type.BarChart]: 'align_horizontal_left',
  [Ip.Dashboard.Widget.Type.Table]: 'table',
}

type Props = Omit<IconProps, 'children' | 'type'> & {type: Ip.Dashboard.Widget.Type}

export const WidgetTypeIcon = ({type, sx, ...props}: Props) => {
  return <Icon sx={sx} children={widgetTypeToIcon[type]} {...props} />
}
