import {AppAvatar, Lazy, Page, Txt} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {useQueryMetrics} from '@/core/query/useQueryMetrics.js'
import {Ip} from 'infoportal-api-sdk'
import {ChartLine} from '@/shared/charts/ChartLine.js'
import {Box, Grid} from '@mui/material'
import {BarChartData, ChartBar} from '@/shared/charts/ChartBar.js'
import {Obj, seq} from '@axanc/ts-utils'
import {useQueryForm} from '@/core/query/useQueryForm.js'
import {useSetState} from '@axanc/react-hooks'
import {SlideWidget} from '@/shared/PdfLayout/PdfSlide.js'
import {appConfig} from '@/conf/AppConfig.js'
import {useI18n} from '@/core/i18n/index.js'
import {useQueryUser} from '@/core/query/useQueryUser.js'
import {useMemo} from 'react'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/dashboard',
  component: Dashboard,
})

function Dashboard() {
  const {m, formatLargeNumber} = useI18n()
  const workspaceId = dashboardRoute.useParams().workspaceId as Ip.WorkspaceId

  const queryUsers = useQueryUser.getAll(workspaceId)
  const queryMetrics = useQueryMetrics({workspaceId})
  const querySubmissionByMonth = queryMetrics.getSubmissionsByMonth
  const querySubmissionsByForm = queryMetrics.getSubmissionsByForm
  const querySubmissionsByCategory = queryMetrics.getSubmissionsByCategory
  const querySubmissionsByStatus = queryMetrics.getSubmissionsByStatus
  const querySubmissionsByUser = queryMetrics.getSubmissionsByUser
  const formIndex = useQueryForm(workspaceId).formIndex
  const selectedFormsSet = useSetState<Ip.FormId>()

  const submissionsCount = useMemo(
    () => seq(querySubmissionByMonth.data ?? []).sum(_ => _.count),
    [querySubmissionByMonth.data],
  )

  return (
    <Page width="full">
      <Grid container sx={{mb: 1}}>
        <Grid size={{xs: 6, sm: 3}}>
          <SlideWidget title={m.forms} icon={appConfig.icons.database}>
            {formatLargeNumber(querySubmissionsByForm.data?.length)}
          </SlideWidget>
        </Grid>
        <Grid size={{xs: 6, sm: 3}}>
          <SlideWidget title={m.submissions} icon={appConfig.icons.submission}>
            {formatLargeNumber(submissionsCount)}
          </SlideWidget>
        </Grid>
        <Grid size={{xs: 6, sm: 3}}>
          <SlideWidget title={m.users} icon={appConfig.icons.users}>
            {formatLargeNumber(queryUsers.data?.length)}
          </SlideWidget>
          {/*<ChartPieWidget*/}
          {/*  title={m.average}*/}
          {/*  value={submissionsCount}*/}
          {/*  base={queryUsers.data?.length ?? 1}*/}
          {/*></ChartPieWidget>*/}
        </Grid>
      </Grid>
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
                  />
                )}
              </Lazy>
            </PanelBody>
          </Panel>
          <Panel>
            <PanelBody>
              <Lazy
                deps={[querySubmissionsByUser.data]}
                fn={data => {
                  if (!data) return
                  const byUser = seq(data).groupByFirst(_ => _.user)
                  return new Obj(byUser)
                    .mapValues(_ => {
                      return {
                        value: _.count,
                        label: (
                          <Box display="flex" alignItems="center">
                            {_.user === '' ? (
                              <AppAvatar sx={{mr: 1}} size={24} icon="domino_mask" />
                            ) : _.user.includes('@') ? (
                              <AppAvatar sx={{mr: 1}} size={24} email={_.user as Ip.User.Email} />
                            ) : (
                              <AppAvatar sx={{mr: 1}} size={24} />
                            )}
                            {_.user === '' ? <Txt color="disabled">{m.anonymous}</Txt> : _.user}
                          </Box>
                        ),
                      }
                    })
                    .sort(([ka, va], [kb, vb]) => vb.value - va.value)
                    .get()
                }}
              >
                {_ => <ChartBar dense data={_} />}
              </Lazy>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
    </Page>
  )
}
