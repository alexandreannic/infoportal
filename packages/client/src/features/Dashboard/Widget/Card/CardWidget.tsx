import {Box, Icon, useTheme} from '@mui/material'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React, {memo} from 'react'
import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import {fnSwitch} from '@axanc/ts-utils'
import {PieChartWidget} from '@/features/Dashboard/Widget/PieChart/PieChartWidget'
import {BarChartWidget} from '@/features/Dashboard/Widget/BarChart/BarChartWidget'
import {LineChartWidget} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {GeoPointWidget} from '@/features/Dashboard/Widget/GeoPoint/GeoPointWidget'
import {GeoChartWidget} from '@/features/Dashboard/Widget/GeoChart/GeoChartWidget'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {TableWidget} from '@/features/Dashboard/Widget/Table/TableWidget'

type Status = 'editing'

export const CardWidget = memo(
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
              Table: <TableWidget widget={widget} />,
              BarChart: <BarChartWidget widget={widget} />,
              PieChart: <PieChartWidget widget={widget} />,
              LineChart: <LineChartWidget widget={widget} />,
              GeoPoint: <GeoPointWidget widget={widget} />,
              GeoChart: <GeoChartWidget widget={widget} />,
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
