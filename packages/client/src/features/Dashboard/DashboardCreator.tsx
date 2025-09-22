import {Core, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import Grid from 'react-grid-layout'
import {Box, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {UseQueryDashboard} from '@/core/query/useQueryDashboard'
import {map, Obj, seq, Seq} from '@axanc/ts-utils'
import {WidgetCreatorFormPanel} from '@/features/Dashboard/Widget/WidgetCreatorPanel'
import {WidgetCreateBtn} from '@/features/Dashboard/Widget/WidgetCreateBtn'
import React, {useCallback, useMemo, useState} from 'react'
import {WidgetCard} from '@/features/Dashboard/Widget/WidgetCard'
import {PartialExcept} from 'infoportal-common'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'

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
}

const Context = React.createContext<Context>({} as Context)
export const useDashboardCreatorContext = () => React.useContext(Context)

export function DashboardCreator() {
  const t = useTheme()
  const {m} = useI18n()

  const params = dashboardCreatorRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId

  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const querySubmissions = UseQuerySubmission.search({workspaceId, formId: queryDashboard.data?.sourceFormId})

  const [drafts, setDrafts] = useState<WidgetDraft[]>([])
  const [editingWidgetId, setEditingWidgetId] = useState<Ip.Dashboard.WidgetId | undefined>()

  const widgets: Ip.Dashboard.Widget[] = useMemo(() => {
    return [
      {id: 'create', position: {x: 0, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
      {id: 'chart1', position: {x: 4, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
      // {id: 'chart2', position: {x: 8, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
      // {id: 'chart3', position: {x: 12, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
    ]
  }, [queryDashboard.data])

  const allWidgets = [...widgets, ...drafts]

  const createDraft = (type: Ip.Dashboard.Widget.Type) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    const newDraft = {
      id: ('draft' + drafts.length) as any,
      type,
      position: {x: 0, y: maxY, w: 6, h: 5},
    }
    setDrafts(_ => {
      return [..._, newDraft]
    })
    setEditingWidgetId(newDraft.id)
  }

  const selectWidget = (draft: WidgetDraft) => {
    setEditingWidgetId(draft.id)
  }

  const editingWidget = useMemo(() => {
    return allWidgets.find(_ => _.id === editingWidgetId)
  }, [allWidgets])

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
    return allWidgets.map(_ => ({i: _.id, ..._.position}))
  }, [allWidgets])

  return (
    <Page
      width="full"
      loading={querySubmissions.isLoading || queryDashboard.isLoading}
      sx={{
        display: 'flex',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        pb: 1,
        flexDirection: 'row',
      }}
    >
      {map(queryDashboard.data, querySubmissions.data, (dashboard, submissions) => (
        <Context.Provider
          value={{
            workspaceId,
            submissions: seq(submissions.data),
            dashboard,
          }}
        >
          <Box
            sx={{
              flex: 1,
              margin: '0 auto',
              mb: 1,
              maxWidth: width,
            }}
          >
            <Box
              sx={{
                background: 'rgba(0,0,0,.04)',
                borderRadius: `calc(${t.vars.shape.borderRadius} + 4px)`,
              }}
            >
              <Grid
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
                {drafts.map(draft => (
                  <div key={draft.id}>
                    <WidgetCard
                      onClick={() => selectWidget(draft)}
                      status={editingWidget?.id === draft.id ? 'editing' : 'draft'}
                      widget={draft}
                    />
                  </div>
                ))}
              </Grid>
              <Box sx={{p: 1, pt: 0}}>
                <Core.Modal overrideActions={null} content={_ => <SelectType close={_} onSelect={createDraft} />}>
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
        </Context.Provider>
      ))}
    </Page>
  )
}

function SelectType({close, onSelect}: {onSelect: (_: Ip.Dashboard.Widget.Type) => void; close: () => void}) {
  return (
    <Core.RadioGroup<Ip.Dashboard.Widget.Type>
      inline
      onChange={_ => {
        onSelect(_)
        close()
      }}
    >
      {Obj.keys(Ip.Dashboard.Widget.Type).map(_ => (
        <Core.RadioGroupItem key={_} hideRadio value={_}>
          <WidgetCreateBtn type={_} />
        </Core.RadioGroupItem>
      ))}
    </Core.RadioGroup>
  )
}
