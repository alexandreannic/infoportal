import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {muiTheme} from '@/core/theme'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {Widget} from '@/features/Dashboard/Widget/Widget'
import {WidgetCreatorFormPanel, WidgetUpdatePayload} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Core} from '@/shared'
import {SelectLangIndex} from '@/shared/customInput/SelectLangIndex'
import {ErrorContent} from '@/shared/PageError'
import {TabContent} from '@/shared/Tab/TabContent'
import {alphaVar} from '@infoportal/client-core'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Collapse, Icon, Theme, ThemeProvider, useTheme} from '@mui/material'
import {createRoute} from '@tanstack/react-router'
import {Ip} from '@infoportal/api-sdk'
import {useCallback, useMemo, useState} from 'react'
import {Responsive, WidthProvider} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import {DeleteSectionBtn} from '@/features/Dashboard/Section/DashboardSectionBtnDelete'
import {DashboardSectionBtnCreate} from '@/features/Dashboard/Section/DashboardSectionBtnCreate'

const GridLayout = WidthProvider(Responsive)

export const dashboardSectionRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 's/$sectionId',
  component: DashboardSection,
})

const sidePanelWidth = 300

export function DashboardSection() {
  const t = useTheme()
  const {m} = useI18n()
  const params = dashboardSectionRoute.useParams()
  const sectionId = params.sectionId as Ip.Dashboard.SectionId

  const {
    langIndex,
    setLangIndex,
    workspaceId,
    filter,
    effectiveDataRange,
    schema,
    sections,
    widgetsBySection,
    dashboard,
  } = useDashboardContext(_ => _)

  const widgets = widgetsBySection.get(sectionId) ?? []

  const queryWidgetUpdate = UseQueryDashboardWidget.update({workspaceId, dashboardId: dashboard.id, sectionId})

  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>()

  const selectWidget = useCallback(
    (id: Ip.Dashboard.WidgetId) => {
      setEditingWidgetId(id)
    },
    [setEditingWidgetId],
  )

  const editingWidget = useMemo(() => {
    return widgets.find(_ => _.id === editingWidgetId)
  }, [widgets, editingWidgetId])

  const updateWidget = useCallback((id: Ip.Dashboard.WidgetId, values: WidgetUpdatePayload) => {
    queryWidgetUpdate.mutateAsync({id, ...values})
  }, [])

  const layout = useDashboardContext(_ => _.gridLayout)

  const theme: Theme = useMemo(() => {
    return muiTheme({
      cssVarPrefix: 'dashboard',
      ...dashboard.theme,
    })
  }, [dashboard.theme])

  if (!sections.some(_ => _.id === sectionId)) return <ErrorContent sx={{height: '100%'}} />

  return (
    <TabContent width="full">
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          pb: 1,
          flexDirection: 'row',
        }}
      >
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              fontFamily: dashboard.theme?.fontFamily,
              fontSize: dashboard.theme?.fontSize,
              flex: 1,
              margin: '0 auto',
              mb: 1,
              maxWidth: layout.width,
              width: '100%',
            }}
          >
            <Core.DebouncedInput<[Date | null | undefined, Date | null | undefined]>
              debounce={800}
              value={[filter.get.period.start, filter.get.period.end]}
              onChange={([start, end]) => {
                filter.set(prev => ({
                  ...prev,
                  period: {start: start ?? effectiveDataRange.start, end: end ?? effectiveDataRange.end},
                }))
              }}
            >
              {(value, onChange) => (
                <Core.PeriodPicker
                  sx={{mt: 0, mb: 1, mr: 1}}
                  value={value}
                  onChange={onChange}
                  label={[m.start, m.endIncluded]}
                  min={effectiveDataRange.start}
                  max={effectiveDataRange.end}
                  fullWidth={false}
                />
              )}
            </Core.DebouncedInput>
            <SelectLangIndex schema={schema} sx={{maxWidth: 128, mr: 1}} value={langIndex} onChange={setLangIndex} />
            <Core.IconBtn children="filter_list_off" tooltip={m.clearFilter} onClick={() => filter.reset()} />
            <Box
              sx={{
                background: dashboard.theme.bgColor ?? alphaVar(t.vars.palette.text.disabled, 0.025),
                borderRadius: `calc(${t.vars.shape.borderRadius} + 4px)`,
                '.react-grid-item.react-grid-placeholder': {
                  background: t.vars.palette.primary.light,
                  borderRadius: t.vars.shape.borderRadius,
                },
              }}
            >
              <Box sx={{position: 'relative'}}>
                <GridResponsiveDivider />
                <GridLayout
                  onLayoutChange={layout => {
                    layout.forEach(({i, x, y, h, w}) => {
                      const widget = widgets?.find(_ => _.id === i)
                      if (!widget) return
                      const p = widget.position
                      if (p.x === x && p.y === y && p.h === h && p.w === w) return
                      updateWidget(i as Ip.Dashboard.WidgetId, {position: {x, y, h, w}})
                    })
                  }}
                  {...layout}
                  draggableHandle=".drag-handle"
                >
                  {widgets.map(widget => (
                    <Box key={widget.id} height="100%">
                      <Widget
                        dashboard={dashboard}
                        onClick={selectWidget}
                        status={editingWidget?.id === widget.id ? 'editing' : 'selected'}
                        widget={widget}
                      />
                      <Icon
                        fontSize="small"
                        sx={{
                          position: 'absolute',
                          top: `calc(${t.vars.spacing} / 2)`,
                          right: `calc(${t.vars.spacing} / 2)`,
                          color: t.vars.palette.text.secondary,
                        }}
                        className="drag-handle"
                      >
                        drag_indicator
                      </Icon>
                    </Box>
                  ))}
                </GridLayout>
              </Box>
              <DashboardSectionBtnCreate
                sectionId={sectionId}
                dashboardId={dashboard.id}
                workspaceId={workspaceId}
                onCreate={_ => setEditingWidgetId(_)}
                widgets={widgets}
              />
            </Box>
            <DeleteSectionBtn
              sections={sections}
              sectionId={sectionId}
              dashboardId={dashboard.id}
              workspaceId={workspaceId}
            />
          </Box>
        </ThemeProvider>
        <Collapse
          sx={{height: '100%', position: 'sticky', top: t.vars.spacing}}
          in={!!editingWidget}
          orientation="horizontal"
          mountOnEnter
          unmountOnExit
        >
          <Box sx={{height: '100%', width: sidePanelWidth}}>
            {editingWidget && (
              <WidgetCreatorFormPanel
                sectionId={sectionId}
                key={editingWidgetId}
                widget={editingWidget}
                onChange={(...args) => updateWidget(editingWidget.id, ...args)}
                onClose={() => setEditingWidgetId(undefined)}
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </TabContent>
  )
}

function GridResponsiveDivider() {
  const t = useTheme()
  return (
    <Box
      sx={{
        width: '1px',
        border: '1px dashed',
        borderColor: t.vars.palette.divider,
        position: 'absolute',
        right: 'calc(50% - 1px)',
        top: t.vars.spacing,
        bottom: t.vars.spacing,
      }}
    />
  )
}
