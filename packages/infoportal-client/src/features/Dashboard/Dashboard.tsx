import {AppAvatar, IpAlert, Lazy, Page, Txt, ViewMoreDiv} from '@/shared'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {useQueryMetrics} from '@/core/query/useQueryMetrics.js'
import {Ip} from 'infoportal-api-sdk'
import {ChartLine} from '@/shared/charts/ChartLine.js'
import {Box, Grid, Icon, useTheme} from '@mui/material'
import {BarChartData, ChartBar} from '@/shared/charts/ChartBar.js'
import {Obj, seq} from '@axanc/ts-utils'
import {useQueryForm} from '@/core/query/useQueryForm.js'
import {useSetState} from '@axanc/react-hooks'
import {SlideWidget} from '@/shared/PdfLayout/PdfSlide.js'
import {appConfig} from '@/conf/AppConfig.js'
import {useI18n} from '@/core/i18n/index.js'
import {useQueryUser} from '@/core/query/useQueryUser.js'
import {useMemo} from 'react'
import {SelectStatusConfig} from '@/shared/customInput/SelectStatus.js'
import {ChartPie} from '@/shared/charts/ChartPie.js'
import {toPercent} from 'infoportal-common'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/dashboard',
  component: Dashboard,
})

// const validationColor: Record<Ip.Submission.Validation, (t: Theme) => any> = {
//   Approved: t => t.palette.success.main,
//   Pending: t => t.palette.warning.main,
//   Approved: t => t.palette.success.main,
//   Approved: t => t.palette.success.main,
// }

const PieChartStatus = ({percent, validation}: {percent: number; validation: Ip.Submission.Validation}) => {
  const {m} = useI18n()
  const t = useTheme()
  const type = SelectStatusConfig.customStatusToStateStatus.KoboValidation[validation]
  const style = SelectStatusConfig.stateStatusStyle[type ?? 'disabled']
  return (
    <Box>
      <Box sx={{position: 'relative'}}>
        <Box
          sx={{
            zIndex: 1000,
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{color: style.color(t)}}>{style.icon}</Icon>
        </Box>
        <ChartPie percent={percent} color={style.color(t)} size={55} />
      </Box>
      <Txt block bold size="big" sx={{mt: 0.5, lineHeight: 1, textAlign: 'center'}}>
        {toPercent(percent)}
      </Txt>
      <Txt block color="hint" size="small" sx={{textAlign: 'center'}}>
        {validation ?? m.blank}
      </Txt>
    </Box>
  )
}

function Dashboard() {
  const {m, formatLargeNumber} = useI18n()
  const t = useTheme()
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
        <Grid size={{xs: 6, sm: 2}}>
          <SlideWidget title={m.forms} icon={appConfig.icons.database}>
            {formatLargeNumber(querySubmissionsByForm.data?.length)}
          </SlideWidget>
        </Grid>
        <Grid size={{xs: 6, sm: 2}}>
          <SlideWidget title={m.submissions} icon={appConfig.icons.submission}>
            {formatLargeNumber(submissionsCount)}
          </SlideWidget>
        </Grid>
        <Grid size={{xs: 6, sm: 2}}>
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
            <PanelBody sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
              {querySubmissionsByStatus.data?.map(_ => (
                <PieChartStatus validation={_.key as Ip.Submission.Validation} percent={_.count / submissionsCount} />
              ))}
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHead>{m.submissions}</PanelHead>
            <PanelBody>
              <Lazy
                deps={[querySubmissionByMonth.data]}
                fn={data => {
                  return data?.map(_ => {
                    return {
                      name: _.key,
                      values: {count: _.count},
                    }
                  })
                }}
              >
                {_ => <ChartLine hideLabelToggle hideLegend data={_} />}
              </Lazy>
            </PanelBody>
          </Panel>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <Panel>
            <PanelHead>{m.submissionsByForm}</PanelHead>
            <PanelBody>
              <ViewMoreDiv>
                <Lazy
                  deps={[querySubmissionsByForm.data, formIndex, selectedFormsSet]}
                  fn={(data, index, set) => {
                    if (!data || !index) return
                    return seq(data).groupByAndApply(
                      _ => _.key,
                      _ => {
                        const formId = _[0]?.key as Ip.FormId
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
              </ViewMoreDiv>
            </PanelBody>
          </Panel>
          <Panel>
            <PanelBody>
              <Lazy
                deps={[querySubmissionsByCategory.data]}
                fn={data => {
                  if (!data) return
                  const byKey = seq(data).groupByFirst(_ => _.key)
                  return Obj.mapValues(byKey, _ => {
                    return {
                      label: _.key,
                      value: _.count,
                    }
                  })
                }}
              >
                {_ => <ChartBar dense data={_} />}
              </Lazy>
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHead>
              {m.submissionsByUser} ({querySubmissionsByUser.data?.length})
            </PanelHead>
            <PanelBody>
              {querySubmissionsByUser.data?.some(_ => _.key.length > 1 && !_.key.includes('@')) && (
                <IpAlert sx={{mb: 1}} severity="info">
                  {m.includeKoboAccountNames}
                </IpAlert>
              )}
              <ViewMoreDiv>
                <Lazy
                  deps={[querySubmissionsByUser.data]}
                  fn={data => {
                    if (!data) return
                    const byUser = seq(data).groupByFirst(_ => _.key)
                    return new Obj(byUser)
                      .mapValues(_ => {
                        return {
                          value: _.count,
                          label: (
                            <Box display="flex" alignItems="center">
                              {!_.key || _.key === '' ? (
                                <AppAvatar sx={{mr: 1}} size={24} icon="domino_mask" />
                              ) : _.key.includes('@') ? (
                                <AppAvatar sx={{mr: 1}} size={24} email={_.key as Ip.User.Email} />
                              ) : (
                                <AppAvatar sx={{mr: 1}} size={24} />
                              )}
                              {_.key === '' ? <Txt color="disabled">{m.anonymous}</Txt> : _.key}
                            </Box>
                          ),
                        }
                      })
                      .get()
                  }}
                >
                  {_ => <ChartBar dense data={_} />}
                </Lazy>
              </ViewMoreDiv>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
    </Page>
  )
}
