import {Core, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import Grid from 'react-grid-layout'
import {Box, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {UseQueryDashboard} from '@/core/query/useQueryDashboard'
import {map, seq, Seq} from '@axanc/ts-utils'
import {WidgetCreatorFormPanel} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import React, {useCallback, useMemo, useState} from 'react'
import {WidgetCard} from '@/features/Dashboard/Widget/WidgetCard'
import {KoboSchemaHelper, PartialExcept} from 'infoportal-common'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {DashboardHeader} from '@/features/Dashboard/DashboardHeader'
import {UseQueryDashboardWidget} from '@/core/query/useQueryDashboardWidget'
import {WidgetCreate, WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreate'
import {useQuerySchema} from '@/core/query/useQuerySchema'

export const dashboardCreatorRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/creator',
  component: DashboardCreator,
})

const width = 1000

export type WidgetDraft = PartialExcept<Ip.Dashboard.Widget, 'id' | 'type' | 'position'>

type Context = {
  workspaceId: Ip.WorkspaceId
  submissions: Seq<Ip.Submission>
  dashboard: Ip.Dashboard
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
  const {workspaceId, widgets, dashboard} = useDashboardCreatorContext()
  const queryWidgetCreate = UseQueryDashboardWidget.create({workspaceId, dashboardId: dashboard.id})

  const [drafts, setDrafts] = useState<WidgetDraft[]>([])
  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>()

  const createWidget = async (form: WidgetCreateForm) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const data = await queryWidgetCreate.mutateAsync({
      ...form,
      title: '',
      config: {},
      position: {x: 0, y: maxY, w: 6, h: 5},
    })
    setEditingWidgetId(data.id)
  }

  const selectWidget = (draft: WidgetDraft) => {
    setEditingWidgetId(draft.id)
  }

  const editingWidget = useMemo(() => {
    return widgets.find(_ => _.id === editingWidgetId)
  }, [widgets])

  const onUpdateDraft = useCallback(
    (draft: WidgetDraft) => {
      console.log('>>> UPDATE', draft)
      setDrafts(prev =>
        prev.map(_ => {
          console.log(prev, draft.id, _.id === draft.id)
          return _.id === draft.id ? (draft as WidgetDraft) : _
        }),
      )
    },
    [drafts],
  )

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
            maxWidth: width,
            width: width,
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
              onLayoutChange={console.log}
              layout={layout}
              margin={[8, 8]}
              rowHeight={30}
              width={width}
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
        {editingWidget && (
          <WidgetCreatorFormPanel widget={editingWidget} onChange={onUpdateDraft} onClose={console.log} />
        )}
      </Box>
    </>
  )
}
