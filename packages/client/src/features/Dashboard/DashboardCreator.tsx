import {Core, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import Grid from 'react-grid-layout'
import {Box, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreateForm.js'
import {Ip} from 'infoportal-api-sdk'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {UseQueryDashboard} from '@/core/query/useQueryDashboard'
import {map} from '@axanc/ts-utils'

export const dashboardCreatorRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/creator',
  component: DashboardCreator,
})

const width = 1000

export function DashboardCreator() {
  const t = useTheme()
  const {m} = useI18n()

  const params = dashboardCreatorRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId
  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const widgets: Grid.Layout[] = [
    {i: 'create', x: 0, y: 0, w: 4, h: 3},
    {i: 'chart1', x: 4, y: 0, w: 4, h: 3},
    {i: 'chart2', x: 8, y: 0, w: 4, h: 3},
    {i: 'chart2', x: 12, y: 0, w: 4, h: 3},
  ]

  return (
    <Page width={width} loading={queryDashboard.isLoading}>
      {map(queryDashboard.data, dashboard => (
        <>
          <Core.Modal
            overrideActions={null}
            content={_ => <WidgetCreateForm workspaceId={workspaceId} dashboard={dashboard} onClose={_} />}
          >
            <Core.Btn icon="add" fullWidth sx={{mb: 1}} variant="outlined">
              {m.create}
            </Core.Btn>
          </Core.Modal>
          <Grid
            style={{
              margin: '0 auto',
              width: width,
              background: 'rgba(0,0,0,.08)',
              borderRadius: `calc(${t.vars.shape.borderRadius} + 4px)`,
            }}
            layout={widgets}
            margin={[8, 8]}
            rowHeight={30}
            width={width}
            cols={12}
          >
            <Box
              key="create"
              sx={{border: '2px dashed', borderRadius: t.vars.shape.borderRadius, borderColor: t.vars.palette.divider}}
            >
              Create
            </Box>
            <Core.Panel key="chart1">Chart</Core.Panel>
          </Grid>
        </>
      ))}
    </Page>
  )
}
