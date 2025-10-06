import {Box, Icon, useTheme} from '@mui/material'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React, {memo} from 'react'
import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import {fnSwitch} from '@axanc/ts-utils'
import {WidgetCardPieChart} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardPieChart'
import {WidgetCardBarChart} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardBarChart'
import {WidgetCardLineChart} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardLineChart'
import {WidgetCardGeoPoint} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardGeoPoint'
import {WidgetCardGeoChart} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardGeoChart'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

type Status = 'editing'

export const WidgetCard = memo(
  ({
    status,
    widget,
    onClick,
  }: {
    status?: Status
    widget: Ip.Dashboard.Widget
    onClick: (_: Ip.Dashboard.WidgetId) => void
  }) => {
    const t = useTheme()
    const {dashboard} = useDashboardContext()
    const content = (
      <Core.Panel
        className="WidgetCard"
        onClick={() => onClick(widget.id)}
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: t.transitions.create('box-shadow'),
          boxShadow: status === 'editing' ? t.vars.shadows[2] : undefined,
          border: '2px solid',
          borderColor: status === 'editing' ? t.vars.palette.primary.main : 'transparent',
        }}
      >
        {widget.type !== 'PieChart' && (
          <Core.Txt title={widget.title} block size="big" bold sx={{mb: 1}}>
            {widget.title}
          </Core.Txt>
        )}
        <Box className="WidgetCard-content" sx={{flex: 1}}>
          {fnSwitch(
            widget.type,
            {
              BarChart: <WidgetCardBarChart widget={widget} />,
              PieChart: <WidgetCardPieChart widget={widget} />,
              LineChart: <WidgetCardLineChart widget={widget} />,
              GeoPoint: <WidgetCardGeoPoint widget={widget} />,
              GeoChart: <WidgetCardGeoChart widget={widget} />,
            },
            () => (
              <></>
            ),
          )}
        </Box>
      </Core.Panel>
    )

    if (dashboard.enableChartFullSize || dashboard.enableChartDownload) {
      return (
        <Core.PanelFeatures
          sx={{right: `calc(${t.vars.spacing} * 3)`}}
          expendable={dashboard.enableChartFullSize}
          savableAsImg={dashboard.enableChartDownload}
        >
          {content}
        </Core.PanelFeatures>
      )
    }
    return content
  },
)

export function WidgetCardPlaceholder({type}: {type: Ip.Dashboard.Widget.Type}) {
  return (
    <Box sx={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Icon sx={{fontSize: '3.5em'}} color="disabled">
        {widgetTypeToIcon[type]}
      </Icon>
    </Box>
  )
}
