import {AppAvatar, Core, Page, ViewMoreDiv} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {useQueryMetrics} from '@/core/query/useQueryMetrics.js'
import {Ip} from 'infoportal-api-sdk'
import {Box, Grid, useTheme} from '@mui/material'
import {Obj, seq} from '@axanc/ts-utils'
import {UseQueryForm} from '@/core/query/useQueryForm.js'
import {usePersistentState} from '@axanc/react-hooks'
import {appConfig} from '@/conf/AppConfig.js'
import {useI18n} from '@infoportal/client-i18n'
import {UseQueryUser} from '@/core/query/useQueryUser.js'
import {useEffect, useMemo, useState} from 'react'
import {addDays, subYears} from 'date-fns'
import {useLayoutContext} from '@/shared/Layout/LayoutContext.js'
import {PanelWidget} from '@/shared/PdfLayout/PanelWidget'
import {SwitchBox} from '@/shared/customInput/SwitchBox'
import {PieChartStatus} from '@/features/Overview/PieChartStatus'
import {OverviewFiltersBar} from '@/features/Overview/OverviewFiltersBar'

export const overviewRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'overview',
  component: Overview,
})

export type OverviewFilters = {
  period: Partial<Ip.Period>
  folderNames: string[]
  formIds: Ip.FormId[]
  formTypes: Ip.Form.Type[]
}

function Overview() {
  const {m, formatLargeNumber} = useI18n()
  const t = useTheme()
  const {setTitle} = useLayoutContext()
  const workspaceId = overviewRoute.useParams().workspaceId as Ip.WorkspaceId

  const [includeKoboAccounts, setIncludeKoboAccounts] = usePersistentState(false, {
    storageKey: 'Overview-includeKoboAccounts',
  })

  useEffect(() => {
    setTitle(m.overview)
  }, [])

  const today = useMemo(() => new Date(), [])

  const defaultFilters = useMemo(() => {
    return {
      period: {
        start: subYears(today, 1),
        end: addDays(today, 1),
      },
      folderNames: [],
      formIds: [],
      formTypes: [Ip.Form.Type.internal, Ip.Form.Type.kobo],
    }
  }, [])

  const [filters, setFilters] = useState<OverviewFilters>(defaultFilters)

  const queryUsers = UseQueryUser.getAll(workspaceId)
  const queryForms = UseQueryForm.getAccessibles(workspaceId)
  const queryMetrics = useQueryMetrics({
    workspaceId,
    formIds: filters.formIds,
    start: filters.period.start,
    end: filters.period.end,
  })
  const querySubmissionByMonth = queryMetrics.getSubmissionsByMonth
  const querySubmissionsByForm = queryMetrics.getSubmissionsByForm
  const querySubmissionsByCategory = queryMetrics.getSubmissionsByCategory
  const querySubmissionsByStatus = queryMetrics.getSubmissionsByStatus
  const querySubmissionsByUser = queryMetrics.getSubmissionsByUser
  const queryUsersByIsoCode = queryMetrics.getUsersByIsoCode
  const getUsersByDate = queryMetrics.getUsersByDate
  const formIndex = UseQueryForm.getAsMap(workspaceId)

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

  const filteredForms = useMemo(() => {
    return queryForms.data?.filter((_: Ip.Form) => {
      if (filters.folderNames.length > 0 && !filters.folderNames.includes(_.category ?? '')) return false
      if (filters.formTypes.length > 0 && !filters.formTypes.includes(_.type)) return false
      return true
    })
  }, [queryForms.data, filters.folderNames, filters.formTypes])

  const widgetSubmissionsCount = (
    <PanelWidget sx={{height: '100%'}} title={m.submissions} icon={appConfig.icons.submission}>
      {formatLargeNumber(submissionsCount)}
    </PanelWidget>
  )

  const formsCount = (
    <PanelWidget sx={{height: '100%'}} title={m.forms} icon={appConfig.icons.database}>
      {formatLargeNumber(filters.formIds.length)}
    </PanelWidget>
  )

  const formsImportedToKoboCount = useMemo(() => {
    return filteredForms?.count(_ => Ip.Form.isKobo(_)) ?? 0
  }, [filteredForms])

  const formsImportedFromKobo = useMemo(() => {
    if (!filteredForms) return <Core.Panel sx={{height: '100%'}} />
    const base = filteredForms.length ?? 1
    return (
      <Core.Panel sx={{height: '100%', py: 1, px: 2, display: 'flex', alignItems: 'center'}}>
        <Core.ChartPieWidget
          title={m.importedFromKobo}
          dense
          showValue
          showBase
          value={formsImportedToKoboCount}
          base={base}
        />
      </Core.Panel>
    )
  }, [formsImportedToKoboCount])

  const formsLinkedToKobo = useMemo(() => {
    if (!filteredForms) return <Core.Panel sx={{height: '100%'}} />
    const value = filteredForms.count(_ => Ip.Form.isConnectedToKobo(_)) ?? 0
    const base = filteredForms.length ?? 1
    //     <PanelWidget title={m.users} icon={appConfig.icons.users}>
    //       {formatLargeNumber(queryUsers.data?.length)}
    //     </PanelWidget>
    return (
      <Core.Panel sx={{height: '100%', py: 1, px: 2, display: 'flex', alignItems: 'center'}}>
        <Core.ChartPieWidget
          title={m.connectedToKobo}
          fractionDigits={0}
          evolution={value - formsImportedToKoboCount}
          dense
          showValue
          showBase
          value={value}
          base={base}
        />
      </Core.Panel>
    )
  }, [filteredForms])

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
    <Core.Panel title={m.submissionsByLocation}>
      <Core.ChartGeo data={queryUsersByIsoCode.data?.map(_ => ({iso: _.key, count: _.count}))} />
    </Core.Panel>
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
              // checked={selectedFormsSet.toArray}
              // onClickData={_ => selectedFormsSet.toggle(_)}
            />
          </ViewMoreDiv>
        </Core.PanelBody>
      </Core.Panel>
    )
  }, [querySubmissionsByForm.data, formIndex, filters])

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
      <Core.PanelWBody title={`${m.users} (${queryUsers.data?.length ?? '-'})`}>
        <Core.ChartLine hideLabelToggle hideLegend data={data} />
      </Core.PanelWBody>
    )
  }, [getUsersByDate.data])

  const submissionsByUser = useMemo(() => {
    if (!querySubmissionsByUser.data) return

    const hasKoboAccounts = querySubmissionsByUser.data.some(_ => Ip.User.isKoboUserName(_.key))

    const dataFiltered =
      hasKoboAccounts && includeKoboAccounts
        ? querySubmissionsByUser.data
        : querySubmissionsByUser.data.filter(_ => !Ip.User.isKoboUserName(_.key))
    const byUser = seq(dataFiltered).groupByFirst(_ => _.key)
    const data = new Obj(byUser)
      .mapValues(_ => {
        return {
          value: _.count,
          label: _.key,
        }
      })
      .get()

    const labels = Obj.mapValues(data, _ => (
      <Box display="flex" alignItems="center">
        {!_.label || _.label === '' ? (
          <AppAvatar sx={{mr: 1}} size={24} icon="domino_mask" />
        ) : _.label.includes('@') ? (
          <AppAvatar sx={{mr: 1}} size={24} email={_.label as Ip.User.Email} />
        ) : (
          <AppAvatar sx={{mr: 1}} size={24} />
        )}
        {_.label === '' ? <Core.Txt color="disabled">{m.anonymous}</Core.Txt> : _.label}
      </Box>
    ))

    return (
      <Core.Panel>
        <Core.PanelHead
          action={
            hasKoboAccounts && (
              <SwitchBox
                size="small"
                value={includeKoboAccounts}
                onChange={(e, c) => setIncludeKoboAccounts(c)}
                label={m._overview.includeKoboUsers}
              />
            )
          }
        >
          {m.submissionsByUser + ` (${querySubmissionsByUser.data?.length})`}
        </Core.PanelHead>
        <Core.PanelBody>
          <ViewMoreDiv>
            <Core.ChartBar dense data={data} labels={labels} />
          </ViewMoreDiv>
        </Core.PanelBody>
      </Core.Panel>
    )
  }, [includeKoboAccounts, querySubmissionsByUser.data])

  return (
    <Page width="lg" pending={loading}>
      <OverviewFiltersBar
        onClear={() => setFilters(defaultFilters)}
        filteredForms={filteredForms}
        forms={queryForms.data}
        filters={filters}
        setFilters={setFilters}
      />
      <Grid container>
        <Grid container size={{xs: 12}}>
          <Grid size={{xs: 6, sm: 3}}>{widgetSubmissionsCount}</Grid>
          <Grid size={{xs: 6, sm: 3}}>{formsCount}</Grid>
          <Grid size={{xs: 6, sm: 3}}>{formsImportedFromKobo}</Grid>
          <Grid size={{xs: 6, sm: 3}}>{formsLinkedToKobo}</Grid>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
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
