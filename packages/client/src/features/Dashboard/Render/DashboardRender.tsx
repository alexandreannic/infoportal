import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {muiTheme} from '@/core/theme'
import {DashboardProvider, useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {Widget} from '@/features/Dashboard/Widget/Widget'
import {rootRoute} from '@/Router'
import {CenteredContent, Core} from '@/shared'
import {SelectLangIndex} from '@/shared/customInput/SelectLangIndex'
import {DashboardLayout} from '@/shared/DashboardLayout/DashboardLayout'
import {PeriodPicker} from '@infoportal/client-core'
import {useI18n} from '@infoportal/client-i18n'
import {Badge, GlobalStyles, Theme, ThemeProvider} from '@mui/material'
import {createRoute} from '@tanstack/react-router'
import {Ip} from '@infoportal/api-sdk'
import {SchemaInspector} from '@infoportal/kobo-helper'
import {useMemo} from 'react'
import {Responsive, WidthProvider} from 'react-grid-layout'
import {DashboardRenderFilterChips} from './DashboardRenderFilterChips'
import {UseQuerySchema} from '@/core/query/form/useQuerySchema'

const GridLayout = WidthProvider(Responsive)

export const dashboardRenderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'd/$workspaceSlug/$dashboardSlug',
  component: DashboardRender,
})

export function DashboardRender() {
  const {workspaceSlug, dashboardSlug} = dashboardRenderRoute.useParams()
  const queryDashboard = UseQueryDashboard.getPublished({workspaceSlug, dashboardSlug})
  const workspaceId = '1783255f-564c-4286-9338-a4d77bb912f6' as Ip.WorkspaceId
  const querySubmissions = UseQueryDashboard.getProtectedSubmission({workspaceSlug, dashboardSlug})
  const querySchema = UseQuerySchema.get({workspaceId, formId: queryDashboard.data?.sourceFormId})

  const mappedSubmissions = useMemo(() => {
    if (!querySubmissions.data || !querySchema.data) return
    const schemaInspector = new SchemaInspector(querySchema.data)
    return querySubmissions.data.map(_ => {
      return KoboMapper.mapSubmissionBySchema(schemaInspector.lookup.questionIndex, _)
    })
  }, [querySubmissions.data, querySchema.data])

  const queries = [queryDashboard, querySchema, querySubmissions]
  const dashboard = queryDashboard.data

  const theme: Theme = useMemo(() => {
    if (!dashboard) return muiTheme()
    return muiTheme({
      cssVarPrefix: 'dashboard',
      ...dashboard.theme,
    })
  }, [dashboard?.theme])

  if (queries.some(_ => _.error)) {
    return <Core.Fender type="error" />
  }

  if (!dashboard || !querySchema.data || !mappedSubmissions)
    return (
      <CenteredContent>
        <Core.Fender type="loading" />
      </CenteredContent>
    )

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={t => ({
          body: {
            fontFamily: dashboard.theme.fontFamily,
            fontSize: dashboard.theme.fontSize,
            background: dashboard.theme.bgColor,
          },
        })}
      />
      <DashboardProvider
        workspaceId={workspaceId}
        widgets={dashboard.snapshot.flatMap(_ => _.widgets)}
        schema={querySchema.data}
        submissions={mappedSubmissions}
        dashboard={dashboard}
        sections={dashboard.snapshot}
      >
        <WithContext snapshot={dashboard.snapshot} />
      </DashboardProvider>
    </ThemeProvider>
  )
}

function WithContext({snapshot}: {snapshot: Ip.DashboardWithSnapshot['snapshot']}) {
  const {m} = useI18n()

  const dashboard = useDashboardContext(_ => _.dashboard)
  const filters = useDashboardContext(_ => _.filter.get)
  const resetFilters = useDashboardContext(_ => _.filter.reset)
  const setFilters = useDashboardContext(_ => _.filter.set)
  const schemaInspector = useDashboardContext(_ => _.schemaInspector)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const setLangIndex = useDashboardContext(_ => _.setLangIndex)

  return (
    <DashboardLayout
      loading={false}
      title={dashboard.name ?? ''}
      subTitle={dashboard.description ?? ''}
      header={
        <>
          <PeriodPicker
            sx={{mt: 0, mb: 0, mr: 1}}
            value={[filters.period.start, filters.period.end]}
            onChange={([start, end]) => {
              setFilters(prev => ({
                ...prev,
                period: {start: start!, end: end!},
              }))
            }}
            label={[m.start, m.endIncluded]}
            min={filters.period.start}
            max={filters.period.end}
            fullWidth={false}
          />
          <SelectLangIndex
            inspector={schemaInspector}
            sx={{maxWidth: 128, mr: 1}}
            value={langIndex}
            onChange={setLangIndex}
          />
          <DashboardRenderFilterChips />
          <Badge
            color="primary"
            sx={{marginLeft: 'auto'}}
            overlap="circular"
            badgeContent={Object.keys(filters.questions).length}
          >
            <Core.IconBtn children="filter_list_off" tooltip={m.clearFilter} onClick={resetFilters} />
          </Badge>
        </>
      }
      sections={snapshot.map(section => {
        return {
          name: section.id,
          title: section.title,
          component: () => <Section dashboard={dashboard} widgets={section.widgets} />,
        }
      })}
    />
  )
}

function Section({widgets, dashboard}: {dashboard: Ip.Dashboard; widgets: Ip.Dashboard.Widget[]}) {
  const layout = useDashboardContext(_ => _.gridLayout)

  return (
    <GridLayout
      isDraggable={false}
      isResizable={false}
      isDroppable={false}
      isBounded={false}
      {...layout}
      style={{margin: -8}}
      // cols={12}
    >
      {widgets.map(widget => (
        <div key={widget.id} style={{height: '100%'}}>
          <Widget key={widget.id} dashboard={dashboard} widget={widget} />
        </div>
      ))}
    </GridLayout>
  )
}
