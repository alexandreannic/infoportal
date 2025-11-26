import {Api} from '@infoportal/api-sdk'
import {Icon, IconProps} from '@mui/material'

export const widgetTypeToIcon = {
  [Api.Dashboard.Widget.Type.Card]: 'pin',
  [Api.Dashboard.Widget.Type.PieChart]: 'data_usage',
  [Api.Dashboard.Widget.Type.GeoChart]: 'map',
  [Api.Dashboard.Widget.Type.LineChart]: 'line_axis',
  [Api.Dashboard.Widget.Type.GeoPoint]: 'location_on',
  [Api.Dashboard.Widget.Type.Alert]: 'text_fields',
  // [Api.Dashboard.Widget.Type.BarChart]: 'bar_chart',
  [Api.Dashboard.Widget.Type.BarChart]: 'align_horizontal_left',
  [Api.Dashboard.Widget.Type.Table]: 'table',
}

type Props = Omit<IconProps, 'children' | 'type'> & {type: Api.Dashboard.Widget.Type}

export const WidgetTypeIcon = ({type, sx, ...props}: Props) => {
  return <Icon sx={sx} children={widgetTypeToIcon[type]} {...props} />
}
