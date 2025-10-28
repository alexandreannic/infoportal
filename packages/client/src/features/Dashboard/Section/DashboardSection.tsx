import {UseQueryDashboardSecion} from '@/core/query/dashboard/useQueryDashboardSection'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {muiTheme} from '@/core/theme'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {Widget} from '@/features/Dashboard/Widget/Widget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {WidgetCreatorFormPanel, WidgetUpdatePayload} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Core} from '@/shared'
import {NotFoundContent} from '@/shared/PageNotFound'
import {SelectLangIndex} from '@/shared/SelectLangIndex'
import {TabContent} from '@/shared/Tab/TabContent'
import {alphaVar} from '@infoportal/client-core'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Collapse, Icon, Theme, ThemeProvider, useTheme} from '@mui/material'
import {createRoute, useNavigate} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {useCallback, useMemo, useState} from 'react'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'

const GridLayout = WidthProvider(ReactGridLayout)

export const dashboardSectionRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 's/$sectionId',
  component: DashboardSection,
})

const layoutWidth = 1200
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
    filters,
    setFilters,
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

  const layout = useMemo(() => {
    return widgets.map(_ => ({i: _.id, ..._.position}))
  }, [widgets])

  const theme: Theme = useMemo(() => {
    return muiTheme({
      cssVarPrefix: 'dashboard',
      ...dashboard.theme,
    })
  }, [dashboard.theme])

  if (!sections.some(_ => _.id === sectionId)) return <NotFoundContent sx={{height: '100%'}} />

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
              flex: 1,
              margin: '0 auto',
              mb: 1,
              maxWidth: layoutWidth,
              width: '100%',
            }}
          >
            <Core.DebouncedInput<[Date | null | undefined, Date | null | undefined]>
              debounce={800}
              value={[filters.period.start, filters.period.end]}
              onChange={([start, end]) => {
                setFilters(prev => ({
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
              <GridLayout
                onLayoutChange={layout => {
                  layout.forEach(({i, x, y, h, w}) => {
                    updateWidget(i as Ip.Dashboard.WidgetId, {position: {x, y, h, w}})
                  })
                }}
                layout={layout}
                margin={[8, 8]}
                rowHeight={10}
                width={layoutWidth}
                cols={12}
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
              <CreateSectionBtn
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

function CreateSectionBtn({
  sectionId,
  workspaceId,
  dashboardId,
  widgets,
  onCreate,
}: {
  workspaceId: Ip.WorkspaceId
  dashboardId: Ip.DashboardId
  sectionId: Ip.Dashboard.SectionId
  widgets: Ip.Dashboard.Widget[]
  onCreate: (_: Ip.Dashboard.WidgetId) => void
}) {
  const {m} = useI18n()
  const t = useTheme()
  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboardId, sectionId})

  const createWidget = async (form: WidgetCreateForm) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const data = await queryWidgetCreate.mutateAsync({
      ...form,
      i18n_title: [],
      config: {},
      position: {x: 0, y: maxY, w: 6, h: 10},
    })
    onCreate(data.id)
  }
  return (
    <Core.Modal
      loading={queryWidgetCreate.isPending}
      closeOnClickAway
      overrideActions={null}
      content={close => (
        <WidgetCreate close={close} loading={queryWidgetCreate.isPending} onSubmit={_ => createWidget(_).then(close)} />
      )}
    >
      <Core.Btn
        icon="add"
        variant="outlined"
        sx={{
          m: 1,
          mt: 0,
          width: `calc(100% - ${t.vars.spacing} * 2)`,
          border: '1px dashed',
          borderColor: t.vars.palette.divider,
        }}
      >
        {m.create}
      </Core.Btn>
    </Core.Modal>
  )
}

function DeleteSectionBtn({
  sectionId,
  workspaceId,
  dashboardId,
  sections,
}: {
  workspaceId: Ip.WorkspaceId
  dashboardId: Ip.DashboardId
  sectionId: Ip.Dashboard.SectionId
  sections: Ip.Dashboard.Section[]
}) {
  const querySectionRemove = UseQueryDashboardSecion.remove({workspaceId, dashboardId})
  const navigate = useNavigate()
  const {m} = useI18n()
  const navigateToDefaultRoute = (deletedSectionId: Ip.Dashboard.SectionId) => {
    const firstSection = sections.filter(_ => _.id !== deletedSectionId)[0]
    if (firstSection) {
      navigate({
        to: '/$workspaceId/dashboard/$dashboardId/edit/s/$sectionId',
        params: {workspaceId, dashboardId: dashboardId, sectionId: firstSection.id},
      })
    } else {
      navigate({
        to: '/$workspaceId/dashboard/$dashboardId/edit/settings',
        params: {workspaceId, dashboardId: dashboardId},
      })
    }
  }

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
      <Core.Modal
        loading={querySectionRemove.pendingIds.has(sectionId)}
        title={m.deleteSection}
        onConfirm={(e, close) =>
          querySectionRemove
            .mutateAsync({id: sectionId})
            .then(close)
            .then(() => navigateToDefaultRoute(sectionId))
        }
      >
        <Core.Btn color="error" icon="delete" variant="outlined">
          {m.deleteSection}
        </Core.Btn>
      </Core.Modal>
    </Box>
  )
}
