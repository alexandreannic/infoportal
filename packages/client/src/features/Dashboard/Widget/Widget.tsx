import {Box, useTheme} from '@mui/material'
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
import {CardWidget} from '@/features/Dashboard/Widget/Card/CardWidget'
import {AlertWidget} from '@/features/Dashboard/Widget/Alert/AlertWidget'
import {WidgetErrorBoundary} from '@/features/Dashboard/Widget/shared/WidgetErrorBoundary'

type Status = 'editing'

export const Widget = memo(
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
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: t.transitions.create('box-shadow'),
          boxShadow: status === 'editing' ? theme => `0 0 0 2px ${theme.palette.primary.main}` : undefined,
          // boxShadow: status === 'editing' ? t.shadows[10] : undefined,
          // border: '2px solid',
          // borderColor: status === 'editing' ? t.vars.palette.primary.main : 'transparent',
        }}
      >
        <WidgetErrorBoundary>
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
                Card: <CardWidget widget={widget} />,
                Alert: <AlertWidget widget={widget} />,
              },
              () => (
                <></>
              ),
            )}
          </Box>
        </WidgetErrorBoundary>
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
