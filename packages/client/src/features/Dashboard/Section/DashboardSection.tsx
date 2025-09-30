import {Core} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import {Box, Collapse, Icon, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {seq, Seq} from '@axanc/ts-utils'
import {
  WidgetCreatorFormPanel,
  WidgetUpdatePayload,
} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsPanel'
import React, {useCallback, useMemo, useState} from 'react'
import {WidgetCard} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {KoboSchemaHelper} from 'infoportal-common'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {TabContent} from '@/shared/Tab/TabContent'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'

const GridLayout = WidthProvider(ReactGridLayout)

export const dashboardSectionRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 's/$sectionId',
  component: DashboardSection,
})

const layoutWidth = 1200
const sidePanelWidth = 300

type Context = {
  sectionId: Ip.Dashboard.SectionId
  workspaceId: Ip.WorkspaceId
  flatSubmissions: Seq<Record<string, any>>
  dashboard: Ip.Dashboard
  schema: KoboSchemaHelper.Bundle<true>
  widgets: Ip.Dashboard.Widget[]
}

const Context = React.createContext<Context>({} as Context)
export const useDashboardEditorContext = () => React.useContext(Context)

export function DashboardSection() {
  const {m} = useI18n()
  const params = dashboardSectionRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const sectionId = params.sectionId as Ip.Dashboard.SectionId
  const dashboardId = params.dashboardId as Ip.DashboardId

  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const querySchema = useQuerySchema({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const querySubmissions = UseQuerySubmission.search({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const queryWidgets = UseQueryDashboardWidget.search({workspaceId, dashboardId, sectionId})

  const schemaWithMeta = useMemo(() => {
    if (!querySchema.data) return
    return KoboSchemaHelper.upgradeIncludingMeta(querySchema.data, m._meta, {validationStatus: m.validation_})
  }, [querySchema.data])

  return (
    <TabContent
      width="full"
      loading={
        queryWidgets.isLoading || querySubmissions.isLoading || queryDashboard.isLoading || querySchema.isLoading
      }
    >
      {querySubmissions.data && queryWidgets.data && queryDashboard.data && schemaWithMeta && (
        <Context.Provider
          value={{
            workspaceId,
            sectionId,
            schema: schemaWithMeta,
            flatSubmissions: seq(querySubmissions.data.data.map(({answers, ...rest}) => ({...answers, ...rest}))),
            dashboard: queryDashboard.data,
            widgets: queryWidgets.data,
          }}
        >
          <_DashboardCreator />
        </Context.Provider>
      )}
    </TabContent>
  )
}

export function _DashboardCreator() {
  const t = useTheme()
  const {m} = useI18n()
  const {workspaceId, schema, widgets, sectionId, dashboard} = useDashboardEditorContext()
  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboard.id, sectionId})
  const queryWidgetUpdate = UseQueryDashboardWidget.update({workspaceId, dashboardId: dashboard.id, sectionId})

  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>()
  // 'f09e16c2-b77b-4985-9457-0d68967a0b88' as any,

  const createWidget = async (form: WidgetCreateForm) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const data = await queryWidgetCreate.mutateAsync({
      ...form,
      title: schema.translate.question(form.questionName),
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
    console.log(widgets)
    return widgets.map(_ => ({i: _.id, ..._.position}))
  }, [widgets])

  return (
    <>
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
                  console.log(i)
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
                <div key={widget.id}>
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
                </div>
              ))}
            </GridLayout>
            <Box sx={{p: 1, pt: 0}}>
              <Core.Modal
                overrideActions={null}
                content={close => (
                  <WidgetCreate close={close} loading={queryWidgetCreate.isPending} onSubmit={createWidget} />
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
                key={editingWidgetId}
                widget={editingWidget}
                onChange={(...args) => updateWidget(editingWidget.id, ...args)}
                onClose={() => setEditingWidgetId(undefined)}
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </>
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
