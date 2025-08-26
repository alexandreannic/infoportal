import {AppAvatar, Core, Page, ViewMoreDiv} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {useQueryMetrics} from '@/core/query/useQueryMetrics.js'
import {Ip} from 'infoportal-api-sdk'
import {Box, BoxProps, CircularProgress, Grid, Icon, useTheme} from '@mui/material'
import {Obj, seq} from '@axanc/ts-utils'
import {useQueryForm} from '@/core/query/useQueryForm.js'
import {useSetState} from '@axanc/react-hooks'
import {SlideWidget} from '@/shared/PdfLayout/PdfSlide.js'
import {appConfig} from '@/conf/AppConfig.js'
import {useI18n} from '@/core/i18n/index.js'
import {useQueryUser} from '@/core/query/useQueryUser.js'
import {useEffect, useMemo, useState} from 'react'
import {SelectStatusConfig} from '@/shared/customInput/SelectStatus.js'
import {toPercent} from 'infoportal-common'
import {addDays, subYears} from 'date-fns'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout.js'
import {useLayoutContext} from '@/shared/Layout/LayoutContext.js'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/dashboard',
  component: Dashboard,
})

const PieChartStatus = ({
  percent,
  validation,
  ...props
}: {percent: number; validation: Ip.Submission.Validation} & BoxProps) => {
  const {m} = useI18n()
  const t = useTheme()
  const type = SelectStatusConfig.customStatusToStateStatus.KoboValidation[validation]
  const style = SelectStatusConfig.stateStatusStyle[type ?? 'disabled']
  return (
    <Box {...props}>
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
        <Core.ChartPie percent={percent} color={style.color(t)} size={55} sx={{margin: 'auto'}} />
      </Box>
      <Core.Txt block bold size="big" sx={{mt: 0.5, lineHeight: 1, textAlign: 'center'}}>
        {toPercent(percent)}
      </Core.Txt>
      <Core.Txt block color="hint" size="small" sx={{textAlign: 'center'}}>
        {validation ?? m.blank}
      </Core.Txt>
    </Box>
  )
}

function Dashboard() {
  const {m, formatLargeNumber} = useI18n()
  const t = useTheme()
  const {setTitle} = useLayoutContext()
  const workspaceId = dashboardRoute.useParams().workspaceId as Ip.WorkspaceId

  useEffect(() => {
    setTitle(m.overview)
  }, [])

  const selectedFormsSet = useSetState<Ip.FormId>()
  const today = new Date()
  const defaultaPeriod = {
    start: subYears(today, 1),
    end: addDays(today, 1),
  }
  const [period, setPeriod] = useState<Partial<Ip.Period>>(defaultaPeriod)

  const queryUsers = useQueryUser.getAll(workspaceId)
  const queryForms = useQueryForm(workspaceId).accessibleForms
  const queryMetrics = useQueryMetrics({
    workspaceId,
    formIds: selectedFormsSet.toArray,
    start: period.start,
    end: period.end,
  })
  const querySubmissionByMonth = queryMetrics.getSubmissionsByMonth
  const querySubmissionsByForm = queryMetrics.getSubmissionsByForm
  const querySubmissionsByCategory = queryMetrics.getSubmissionsByCategory
  const querySubmissionsByStatus = queryMetrics.getSubmissionsByStatus
  const querySubmissionsByUser = queryMetrics.getSubmissionsByUser
  const queryUsersByIsoCode = queryMetrics.getUsersByIsoCode
  const getUsersByDate = queryMetrics.getUsersByDate
  const formIndex = useQueryForm(workspaceId).formIndex

  const loading =
    querySubmissionByMonth.isFetching ||
    querySubmissionsByForm.isFetching ||
    querySubmissionsByCategory.isFetching ||
    querySubmissionsByStatus.isFetching ||
    querySubmissionsByUser.isFetching ||
    getUsersByDate.isFetching

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
      {formatLargeNumber(queryForms.data?.length)}
    </SlideWidget>
  )

  const formsLinkedToKobo = useMemo(() => {
    if (!queryForms.data) return <Core.Panel sx={{height: '100%'}} />
    const value = queryForms.data.count(_ => !!_.kobo) ?? 0
    const base = queryForms.data.length ?? 1
    if (value === 0) {
      return (
        <SlideWidget title={m.users} icon={appConfig.icons.users}>
          {formatLargeNumber(queryUsers.data?.length)}
        </SlideWidget>
      )
    }
    return (
      <Core.Panel sx={{height: '100%', py: 1, px: 2, display: 'flex', alignItems: 'center'}}>
        <Core.ChartPieWidget title={m.linkedToKobo} dense showValue showBase value={value} base={base} />
      </Core.Panel>
    )
  }, [queryForms.data])

  const pieChartValidation = (
    <Core.Panel>
      <Core.PanelBody sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        {Obj.keys(Ip.Submission.Validation).map(status => (
          <PieChartStatus
            key={status}
            validation={status as Ip.Submission.Validation}
            percent={
              (querySubmissionsByStatus.data?.find(_ => _.key === status)?.count ?? 0) /
              Math.max(submissionsCount ?? 0, 1)
            }
            sx={{flex: 1}}
          />
        ))}
      </Core.PanelBody>
    </Core.Panel>
  )

  const map = (
    <Core.ChartGeo
      panelTitle={m.submissionsByLocation}
      data={queryUsersByIsoCode.data?.map(_ => ({iso: _.key, count: _.count}))}
    />
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
      <Core.PanelWBody title={m.submissions}>
        <Core.ChartLine hideLabelToggle hideLegend data={data} />
      </Core.PanelWBody>
    )
  }, [querySubmissionByMonth.data])

  const submissionsByForm = useMemo(() => {
    if (!querySubmissionsByForm.data || !formIndex) return
    const data = seq(querySubmissionsByForm.data).groupByAndApply(
      _ => _.key,
      _ => {
        const formId = _[0]?.key as Ip.FormId
        const res: Core.BarChartData = {
          value: _.sum(_ => _.count),
          label: formIndex?.get(formId)?.name ?? formId,
        }
        return res
      },
    )
    return (
      <Core.Panel title={m.submissionsByForm}>
        <Core.PanelBody>
          <ViewMoreDiv>
            <Core.ChartBar
              dense
              data={data}
              checked={selectedFormsSet.toArray}
              onClickData={_ => selectedFormsSet.toggle(_)}
            />
          </ViewMoreDiv>
        </Core.PanelBody>
      </Core.Panel>
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
      <Core.PanelWBody title={m.submissionsByCategory}>
        <Core.ChartBar dense data={data} />
      </Core.PanelWBody>
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
      <Core.PanelWBody title={m.users}>
        <Core.ChartLine hideLabelToggle hideLegend data={data} />
      </Core.PanelWBody>
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
              {_.key === '' ? <Core.Txt color="disabled">{m.anonymous}</Core.Txt> : _.key}
            </Box>
          ),
        }
      })
      .get()
    return (
      <Core.PanelWBody title={m.submissionsByUser + ` (${querySubmissionsByUser.data?.length})`}>
        {querySubmissionsByUser.data?.some(_ => _.key && _.key.length > 1 && !_.key.includes('@')) && (
          <Core.Alert sx={{mb: 1}} severity="info">
            {m.includeKoboAccountNames}
          </Core.Alert>
        )}
        <ViewMoreDiv>
          <Core.ChartBar dense data={data} />
        </ViewMoreDiv>
      </Core.PanelWBody>
    )
  }, [querySubmissionsByUser.data])
  return (
    <Page width="full">
      <DataFilterLayout
        hidePopup
        onClear={() => {
          selectedFormsSet.clear()
          setPeriod(defaultaPeriod)
        }}
        filters={{}}
        setFilters={console.log}
        shapes={{}}
        after={loading && <CircularProgress size={30} />}
        before={
          <Core.PeriodPicker
            sx={{mt: 0, mb: 0, mr: 1}}
            value={[period.start, period.end]}
            onChange={([start, end]) => {
              setPeriod(prev => ({...prev, start: start ?? undefined, end: end ?? undefined}))
            }}
            label={[m.start, m.endIncluded]}
            max={addDays(new Date(), 1)}
            fullWidth={false}
          />
        }
      />
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
          {map}
          {usersByDate}
          {submissionsByUser}
        </Grid>
      </Grid>
    </Page>
  )
}
