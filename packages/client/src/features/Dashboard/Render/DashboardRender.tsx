import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'
import {PeriodPicker} from '@infoportal/client-core'
import {DataFilterLayout} from '@/shared/DataFilter/DataFilterLayout'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import React, {useMemo, useState} from 'react'
import {DashboardLayout} from '@/shared/DashboardLayout/DashboardLayout'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {Widget} from '@/features/Dashboard/Widget/Widget'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import {DashboardProvider} from '@/features/Dashboard/DashboardContext'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {Core} from '@/shared'
import {GlobalStyles, Theme, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {fontFamily, fontSize} from '@mui/system'

const GridLayout = WidthProvider(ReactGridLayout)

export const dashboardRenderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'd/$workspaceSlug/$dashboardSlug',
  component: DashboardRender,
})

type Filters = {
  period: Ip.Period
}

export function DashboardRender() {
  const {workspaceSlug, dashboardSlug} = dashboardRenderRoute.useParams()
  const {m} = useI18n()
  const queryDashboard = UseQueryDashboard.getPublished({workspaceSlug, dashboardSlug})
  const workspaceId = '1783255f-564c-4286-9338-a4d77bb912f6' as Ip.WorkspaceId
  const querySubmissions = UseQuerySubmission.search({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const querySchema = useQuerySchema({workspaceId, formId: queryDashboard.data?.sourceFormId})

  const [filters, setFilters] = useState<Filters>({
    period: {start: new Date(), end: new Date()},
  })

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

  if (!dashboard || !querySchema.data || !querySubmissions.data) return 'Loading...'

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
        submissions={querySubmissions.data.data}
        dashboard={dashboard}
        sections={dashboard.snapshot}
      >
        <DashboardLayout
          loading={queryDashboard.isLoading}
          title={dashboard?.name ?? ''}
          subTitle={dashboard?.description ?? ''}
          header={
            <DataFilterLayout
              filters={{}}
              setFilters={console.log}
              shapes={{}}
              hidePopup
              sx={{mb: 0}}
              onClear={() => {
                // ctx.setPeriod(ctx.periodDefault)
                // ctx.setFilterOptions({})
              }}
              // shapes={ctx.filterShape}
              // data={ctx.data}
              // filters={ctx.filterOptions}
              // setFilters={ctx.setFilterOptions}
              before={
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
                  // min={ctx.fetcherPeriod.get?.start}
                  // max={ctx.fetcherPeriod.get?.end}
                  fullWidth={false}
                />
              }
            />
          }
          sections={dashboard?.snapshot.map(section => {
            return {
              icon: 'rocket_launch',
              name: section.id,
              title: section.title,
              component: () => <Section dashboard={dashboard} widgets={section.widgets} />,
            }
          })}
        />
      </DashboardProvider>
    </ThemeProvider>
  )
}

function Section({widgets, dashboard}: {dashboard: Ip.Dashboard; widgets: Ip.Dashboard.Widget[]}) {
  const layout = useMemo(() => {
    return widgets.map(_ => ({i: _.id, ..._.position}))
  }, [widgets])

  return (
    <GridLayout
      layout={layout}
      isDraggable={false}
      isResizable={false}
      isDroppable={false}
      isBounded={false}
      margin={[8, 8]}
      rowHeight={10}
      style={{margin: -8}}
      width={1200}
      cols={12}
    >
      {widgets.map(widget => (
        <div key={widget.id} style={{height: '100%'}}>
          <Widget key={widget.id} dashboard={dashboard} widget={widget} />
        </div>
      ))}
    </GridLayout>
  )
}
