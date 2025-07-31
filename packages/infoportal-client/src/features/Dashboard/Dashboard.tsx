import {AppAvatar, IpAlert, Page, Txt, ViewMoreDiv} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
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
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget.js'
import {PanelWBody} from '@/shared/Panel/PanelWBody.js'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/dashboard',
  component: Dashboard,
})

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

  const selectedFormsSet = useSetState<Ip.FormId>()

  const queryUsers = useQueryUser.getAll(workspaceId)
  const queryForms = useQueryForm(workspaceId).accessibleForms
  const queryMetrics = useQueryMetrics({workspaceId, formIds: selectedFormsSet.toArray})
  const querySubmissionByMonth = queryMetrics.getSubmissionsByMonth
  const querySubmissionsByForm = queryMetrics.getSubmissionsByForm
  const querySubmissionsByCategory = queryMetrics.getSubmissionsByCategory
  const querySubmissionsByStatus = queryMetrics.getSubmissionsByStatus
  const querySubmissionsByUser = queryMetrics.getSubmissionsByUser
  const getUsersByDate = queryMetrics.getUsersByDate
  const formIndex = useQueryForm(workspaceId).formIndex


  const submissionsCount = useMemo(
    () => seq(querySubmissionByMonth.data ?? []).sum(_ => _.count),
    [querySubmissionByMonth.data],
  )

  const widgetSubmissionsCount = (
    <SlideWidget title={m.submissions} icon={appConfig.icons.submission}>
      {formatLargeNumber(submissionsCount)}
    </SlideWidget>
  )
  const formsCount = (
    <SlideWidget title={m.forms} icon={appConfig.icons.database}>
      {formatLargeNumber(querySubmissionsByForm.data?.length)}
    </SlideWidget>
  )

  const formsLinkedToKobo = useMemo(() => {
    if (!queryForms.data) return <Panel sx={{height: '100%'}} />
    const value = queryForms.data.count(_ => !!_.kobo) ?? 0
    const base = queryForms.data.length ?? 1
    if (value === 0) {
      return (
        <Panel sx={{height: '100%', py: 1, px: 2}}>
          <SlideWidget title={m.users} icon={appConfig.icons.users}>
            {formatLargeNumber(queryUsers.data?.length)}
          </SlideWidget>
        </Panel>
      )
    }
    return (
      <Panel sx={{height: '100%', py: 1, px: 2}}>
        <ChartPieWidget title={m.linkedToKobo} dense showValue showBase value={value} base={base} />
      </Panel>
    )
  }, [queryForms.data])

  const pieChartValidation = (
    <Panel>
      <PanelBody sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        {querySubmissionsByStatus.data?.map(_ => (
          <PieChartStatus validation={_.key as Ip.Submission.Validation} percent={_.count / submissionsCount} />
        ))}
      </PanelBody>
    </Panel>
  )

  const submissionByTime = useMemo(() => {
    if (!querySubmissionByMonth.data) return
    const data = querySubmissionByMonth.data?.map(_ => {
      return {
        name: _.key,
        values: {count: _.count},
      }
    })
    return (
      <PanelWBody title={m.submissions}>
        <ChartLine hideLabelToggle hideLegend data={data} />
      </PanelWBody>
    )
  }, [querySubmissionByMonth.data])

  const submissionsByForm = useMemo(() => {
    if (!querySubmissionsByForm.data || !formIndex) return
    const data = seq(querySubmissionsByForm.data).groupByAndApply(
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
    return (
      <Panel title={m.submissionsByForm}>
        <PanelBody>
          <ViewMoreDiv>
            <ChartBar
              dense
              data={data}
              checked={selectedFormsSet.toArray}
              onClickData={_ => selectedFormsSet.toggle(_)}
            />
          </ViewMoreDiv>
        </PanelBody>
      </Panel>
    )
  }, [querySubmissionsByForm.data, formIndex, selectedFormsSet])

  const submissionsByCategory = useMemo(() => {
    const byKey = seq(querySubmissionsByCategory.data).groupByFirst(_ => _.key)
    const data = Obj.mapValues(byKey, _ => {
      return {
        label: _.key,
        value: _.count,
      }
    })
    return (
      <PanelWBody title={m.submissionsByCategory}>
        <ChartBar dense data={data} />
      </PanelWBody>
    )
  }, [querySubmissionsByCategory.data])

  const usersByDate = useMemo(() => {
    const data = getUsersByDate.data?.map(_ => {
      return {
        name: _.date,
        values: {
          countCreatedAt: _.countCreatedAt,
          countLastConnectedCount: _.countLastConnectedCount,
        },
      }
    })
    return (
      <PanelWBody title={m.users}>
        <ChartLine hideLabelToggle hideLegend data={data} />
      </PanelWBody>
    )
  }, [getUsersByDate.data])

  const submissionsByUser = useMemo(() => {
    if (!querySubmissionsByUser.data) return
    const byUser = seq(querySubmissionsByUser.data).groupByFirst(_ => _.key)
    const data = new Obj(byUser)
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
    return (
      <PanelWBody title={m.submissionsByUser + ` (${querySubmissionsByUser.data?.length})`}>
        {querySubmissionsByUser.data?.some(_ => _.key.length > 1 && !_.key.includes('@')) && (
          <IpAlert sx={{mb: 1}} severity="info">
            {m.includeKoboAccountNames}
          </IpAlert>
        )}
        <ViewMoreDiv>
          <ChartBar dense data={data} />
        </ViewMoreDiv>
      </PanelWBody>
    )
  }, [querySubmissionsByUser.data])
  return (
    <Page width="full">
      <Grid container>
        <Grid size={{xs: 12, sm: 6}}>
          <Grid container sx={{mb: 1}}>
            <Grid size={{xs: 6, sm: 4}}>{widgetSubmissionsCount}</Grid>
            <Grid size={{xs: 6, sm: 4}}>{formsCount}</Grid>
            <Grid size={{xs: 6, sm: 4}}>{formsLinkedToKobo}</Grid>
          </Grid>
          {pieChartValidation}
          {submissionByTime}
          {submissionsByForm}
          {submissionsByCategory}
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          {usersByDate}
          {submissionsByUser}
        </Grid>
      </Grid>
    </Page>
  )
}
