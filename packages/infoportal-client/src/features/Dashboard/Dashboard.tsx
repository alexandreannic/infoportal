import {Lazy, Page} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {useQueryMetrics} from '@/core/query/useQueryMetrics.js'
import {Ip} from 'infoportal-api-sdk'
import {ChartLine} from '@/shared/charts/ChartLine.js'
import {Grid} from '@mui/material'
import {BarChartData, ChartBar} from '@/shared/charts/ChartBar.js'
import {seq} from '@axanc/ts-utils'
import {useQueryForm} from '@/core/query/useQueryForm.js'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/dashboard',
  component: Dashboard,
})

function Dashboard() {
  const workspaceId = dashboardRoute.useParams().workspaceId as Ip.WorkspaceId
  const queryMetrics = useQueryMetrics({workspaceId})
  const querySubmissionByMonth = queryMetrics.getSubmissionsByMonth
  const querySubmissionsByForm = queryMetrics.getSubmissionsByForm
  const queryForms = useQueryForm().accessibleForms.
  return (
    <Page width="full">
      <Grid container>
        <Grid size={{xs: 12, sm: 6}}>
          <Panel>
            <PanelBody>
              <ChartLine
                data={querySubmissionByMonth.data?.map(_ => {
                  return {
                    name: _.date,
                    values: {count: _.count},
                  }
                })}
              />
            </PanelBody>
          </Panel>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Panel>
            <PanelBody>
              <Lazy
                deps={[querySubmissionsByForm.data]}
                fn={_ => {
                  if (!_) return
                  return seq(_).groupByAndApply(
                    _ => _.formId,
                    _ => {
                      const res: BarChartData = {
                        value: _.sum(_ => _.count),
                      }
                      return res
                    },
                  )
                }}
              >
                {_ => <ChartBar data={_} />}
              </Lazy>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
    </Page>
  )
}
