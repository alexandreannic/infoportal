import {Core} from '@/shared'
import {createRoute, useNavigate} from '@tanstack/react-router'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import {Box, Collapse, Icon, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {WidgetCreatorFormPanel, WidgetUpdatePayload} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import React, {useCallback, useMemo, useState} from 'react'
import {Widget} from '@/features/Dashboard/Widget/Widget'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {TabContent} from '@/shared/Tab/TabContent'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {SelectLangIndex} from '@/shared/SelectLangIndex'
import {alphaVar} from '@infoportal/client-core'
import {UseQueryDashboardSecion} from '@/core/query/dashboard/useQueryDashboardSection'
import {NotFoundContent} from '@/shared/PageNotFound'

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
  const navigate = useNavigate()

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

  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboard.id, sectionId})
  const queryWidgetUpdate = UseQueryDashboardWidget.update({workspaceId, dashboardId: dashboard.id, sectionId})
  const querySectionRemove = UseQueryDashboardSecion.remove({workspaceId, dashboardId: dashboard.id})

  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>()

  const createWidget = async (form: WidgetCreateForm) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const data = await queryWidgetCreate.mutateAsync({
      ...form,
      i18n_title: [],
      config: {},
      position: {x: 0, y: maxY, w: 6, h: 10},
    })
    setEditingWidgetId(data.id)
  }

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

  if (!sections.some(_ => _.id === sectionId)) return <NotFoundContent sx={{height: '100%'}} />

  const navigateToDefaultRoute = (deletedSectionId: Ip.Dashboard.SectionId) => {
    const firstSection = sections.filter(_ => _.id !== deletedSectionId)[0]
    if (firstSection) {
      navigate({
        to: '/$workspaceId/dashboard/$dashboardId/edit/s/$sectionId',
        params: {workspaceId, dashboardId: dashboard.id, sectionId: firstSection.id},
      })
    } else {
      navigate({
        to: '/$workspaceId/dashboard/$dashboardId/edit/settings',
        params: {workspaceId, dashboardId: dashboard.id},
      })
    }
  }

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
              background: alphaVar(t.vars.palette.text.disabled, 0.025),
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
            <Box sx={{p: 1, pt: 0}}>
              <Core.Modal
                loading={queryWidgetCreate.isPending}
                closeOnClickAway
                overrideActions={null}
                content={close => (
                  <WidgetCreate
                    close={close}
                    loading={queryWidgetCreate.isPending}
                    onSubmit={_ => createWidget(_).then(close)}
                  />
                )}
              >
                <Core.Btn
                  icon="add"
                  fullWidth
                  variant="outlined"
                  sx={{border: '1px dashed', borderColor: t.vars.palette.divider}}
                >
                  {m.create}
                </Core.Btn>
              </Core.Modal>
            </Box>
          </Box>
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
        </Box>
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

// function CreateWidgetBtn({loading}: {loading?: boolean}) {
//   const {m} = useI18n()
//   return (
//     <Core.Modal
//       overrideActions={null}
//       content={close => <WidgetCreate close={close} loading={queryWidgetCreate.isPending} onSubmit={createWidget} />}
//     >
//       <Core.Btn
//         icon="add"
//         fullWidth
//         variant="outlined"
//         sx={{border: '2px dashed', borderColor: t.vars.palette.divider}}
//       >
//         {m.create}
//       </Core.Btn>
//     </Core.Modal>
//   )
// }
