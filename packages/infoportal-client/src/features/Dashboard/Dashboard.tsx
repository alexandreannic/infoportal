import {Lazy, Page} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {useQueryMetrics} from '@/core/query/useQueryMetrics.js'
import {Ip} from 'infoportal-api-sdk'
import {ChartLine} from '@/shared/charts/ChartLine.js'
import {Checkbox, Grid} from '@mui/material'
import {BarChartData, ChartBar} from '@/shared/charts/ChartBar.js'
import {seq} from '@axanc/ts-utils'
import {useQueryForm} from '@/core/query/useQueryForm.js'
import {useSetState} from '@axanc/react-hooks'

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
  const formIndex = useQueryForm(workspaceId).formIndex
  const selectedFormsSet = useSetState<Ip.FormId>()

  return (
    <Page width="full">
      <Grid container>
        <Grid size={{xs: 12, sm: 6}}>
          <Panel>
            <PanelBody>
              <Lazy
                deps={[querySubmissionByMonth.data]}
                fn={data => {
                  return data?.map(_ => {
                    return {
                      name: _.date,
                      values: {count: _.count},
                    }
                  })
                }}
              >
                {_ => <ChartLine data={_} />}
              </Lazy>
            </PanelBody>
          </Panel>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Panel>
            <PanelBody>
              <Lazy
                deps={[querySubmissionsByForm.data, formIndex, selectedFormsSet]}
                fn={(data, index, set) => {
                  if (!data || !index) return
                  return seq(data).groupByAndApply(
                    _ => _.formId,
                    _ => {
                      const formId = _[0]?.formId as Ip.FormId
                      const res: BarChartData = {
                        value: _.sum(_ => _.count),
                        label: formIndex?.get(formId)?.name ?? formId,
                      }
                      return res
                    },
                  )
                }}
              >
                {_ => (
                  <ChartBar
                    dense
                    data={_}
                    checked={selectedFormsSet.toArray}
                    onClickData={_ => selectedFormsSet.toggle(_)}
                    labels={seq(Array.from(formIndex?.values() ?? [])).reduceObject(_ => [_.id, _.name])}
                  />
                )}
              </Lazy>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
    </Page>
  )
}
