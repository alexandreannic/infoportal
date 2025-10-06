import {Core} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import {Box, Collapse, Icon, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {
  WidgetCreatorFormPanel,
  WidgetUpdatePayload,
} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import React, {useCallback, useMemo, useState} from 'react'
import {WidgetCard} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {TabContent} from '@/shared/Tab/TabContent'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

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
  const {workspaceId, filters, setFilters, dataRange, effectiveDataRange, schema, widgetsBySection, dashboard} =
    useDashboardContext()
  const widgets = widgetsBySection.get(sectionId) ?? []

  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboard.id, sectionId})
  const queryWidgetUpdate = UseQueryDashboardWidget.update({workspaceId, dashboardId: dashboard.id, sectionId})

  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>(
    '779af34c-3dbb-4e4c-ad2a-5a8ab72e7a58' as any,
  )

  const createWidget = async (form: WidgetCreateForm) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const data = await queryWidgetCreate.mutateAsync({
      ...form,
      // title: schema.translate.question(form.questionName),
      config: {},
      position: {x: 0, y: maxY, w: 6, h: 5},
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
          <Box
            sx={{
              background: 'rgba(0,0,0,.04)',
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
              rowHeight={30}
              width={layoutWidth}
              cols={12}
              draggableHandle=".drag-handle"
            >
              {widgets.map(widget => (
                <Box key={widget.id} sx={{height: '100%'}}>
                  <WidgetCard
                    onClick={selectWidget}
                    status={editingWidget?.id === widget.id ? 'editing' : undefined}
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
                  sx={{border: '2px dashed', borderColor: t.vars.palette.divider}}
                >
                  {m.create}
                </Core.Btn>
              </Core.Modal>
            </Box>
          </Box>
        </Box>
        <Collapse sx={{height: '100%'}} in={!!editingWidget} orientation="horizontal" mountOnEnter unmountOnExit>
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
