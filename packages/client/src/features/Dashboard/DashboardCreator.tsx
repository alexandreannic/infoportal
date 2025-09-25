import {Core, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import Grid from 'react-grid-layout'
import {Box, Collapse, Slide, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {UseQueryDashboard} from '@/core/query/useQueryDashboard'
import {seq, Seq} from '@axanc/ts-utils'
import {WidgetCreatorFormPanel, WidgetUpdatePayload} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import React, {useCallback, useMemo, useState} from 'react'
import {WidgetCard} from '@/features/Dashboard/Widget/WidgetCard'
import {KoboSchemaHelper, PartialExcept} from 'infoportal-common'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {DashboardHeader} from '@/features/Dashboard/DashboardHeader'
import {UseQueryDashboardWidget} from '@/core/query/useQueryDashboardWidget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {SubmissionMapped, SubmissionMappedType} from '@/core/sdk/server/kobo/KoboMapper'

export const dashboardCreatorRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/creator',
  component: DashboardCreator,
})

const layoutWidth = 1200
const sidePanelWidth = 300

type Context = {
  workspaceId: Ip.WorkspaceId
  submissions: Seq<Ip.Submission>
  dashboard: Ip.Dashboard
  answers: Seq<SubmissionMapped>
  schema: KoboSchemaHelper.Bundle
  widgets: Ip.Dashboard.Widget[]
}

const Context = React.createContext<Context>({} as Context)
export const useDashboardCreatorContext = () => React.useContext(Context)

export function DashboardCreator() {
  const params = dashboardCreatorRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId

  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const querySchema = useQuerySchema({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const querySubmissions = UseQuerySubmission.search({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const queryWidgets = UseQueryDashboardWidget.getByDashboard({workspaceId, dashboardId})
  return (
    <Page
      width="full"
      loading={
        queryWidgets.isLoading || querySubmissions.isLoading || queryDashboard.isLoading || querySchema.isLoading
      }
    >
      {querySubmissions.data && queryWidgets.data && queryDashboard.data && querySchema.data && (
        <Context.Provider
          value={{
            workspaceId,
            schema: querySchema.data,
            submissions: seq(querySubmissions.data.data),
            answers: seq(querySubmissions.data.data).map(_ => _.answers),
            dashboard: queryDashboard.data,
            widgets: queryWidgets.data,
          }}
        >
          <_DashboardCreator />
        </Context.Provider>
      )}
    </Page>
  )
}

export function _DashboardCreator() {
  const t = useTheme()
  const {m} = useI18n()
  const {workspaceId, schema, widgets, dashboard} = useDashboardCreatorContext()
  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboard.id})
  const queryWidgetUpdate = UseQueryDashboardWidget.update({workspaceId, dashboardId: dashboard.id})

  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>(
    '45bcd3c5-f6a3-40d7-a5b4-a008f4f390f0' as any,
  )

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

  const selectWidget = (widget: Ip.Dashboard.Widget) => {
    setEditingWidgetId(widget.id)
  }

  const editingWidget = useMemo(() => {
    return widgets.find(_ => _.id === editingWidgetId)
  }, [widgets, editingWidgetId])

  const updateWidget = useCallback((id: Ip.Dashboard.WidgetId, values: WidgetUpdatePayload) => {
    queryWidgetUpdate.mutateAsync({widgetId: id, ...values})
  }, [])

  const layout = useMemo(() => {
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
            width: layoutWidth,
          }}
        >
          <DashboardHeader />
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
            <Grid
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
                <div key={widget.id}>
                  <WidgetCard
                    onClick={() => selectWidget(widget)}
                    status={editingWidget?.id === widget.id ? 'editing' : undefined}
                    widget={widget}
                  />
                </div>
              ))}
            </Grid>
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
