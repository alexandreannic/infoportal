import {Core, Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import Grid, {Layout} from 'react-grid-layout'
import {Box, Icon, useTheme} from '@mui/material'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {WidgetCreateForm} from '@/features/Dashboard/Widget/WidgetCreatorForm.js'
import {Ip} from 'infoportal-api-sdk'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {UseQueryDashboard} from '@/core/query/useQueryDashboard'
import {map, Obj} from '@axanc/ts-utils'
import {DashboardCreatorPanel} from '@/features/Dashboard/DashboardCreatorPanel'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'
import {WidgetCreateBtn, widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetCreateBtn'
import React, {useMemo, useState} from 'react'

export const dashboardCreatorRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/creator',
  component: DashboardCreator,
})

const width = 1000

export function DashboardCreator() {
  const t = useTheme()
  const {m} = useI18n()

  const params = dashboardCreatorRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId
  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const widgetCreateForm = useForm<WidgetCreateForm>({
    mode: 'onChange',
  })

  const widgetCreateFormWatch = widgetCreateForm.watch()

  const createDraft = (type: Ip.Dashboard.Widget.Type) => {
    const maxY = Math.max(...widgets.map(w => w.position.y + w.position.h))
    widgetCreateForm.setValue('type', type)
    widgetCreateForm.setValue('position', {
      x: 0,
      y: maxY,
      w: 4,
      h: 3,
    })
  }

  const widgets: Array<Ip.Dashboard.Widget & {drafting?: boolean}> = useMemo(() => {
    const base = [
      {id: 'create', position: {x: 0, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
      {id: 'chart1', position: {x: 4, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
      {id: 'chart2', position: {x: 8, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
      {id: 'chart3', position: {x: 12, y: 0, w: 4, h: 3}} as Ip.Dashboard.Widget,
    ]
    if (widgetCreateFormWatch.type) {
      base.push({id: 'draft' as any, position: widgetCreateFormWatch.position, drafting: true})
    }
    return base
  }, [widgetCreateFormWatch])

  const layout = useMemo(() => {
    return widgets.map(_ => ({i: _.id, ..._.position}))
  }, [widgets])

  const type = widgetCreateForm.watch('type')
  return (
    <Page
      width="full"
      loading={queryDashboard.isLoading}
      sx={{
        display: 'flex',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        pb: 1,
        flexDirection: 'row',
      }}
    >
      {map(queryDashboard.data, dashboard => (
        <>
          <Box
            sx={{
              flex: 1,
              margin: '0 auto',
              mb: 1,
              maxWidth: width,
            }}
          >
            <Core.PanelWBody sx={{mb: 1}}>
              <Core.Txt size="title">{dashboard.name}</Core.Txt>
            </Core.PanelWBody>
            <Box
              sx={{
                background: 'rgba(0,0,0,.04)',
                borderRadius: `calc(${t.vars.shape.borderRadius} + 4px)`,
              }}
            >
              <Grid style={{}} layout={layout} margin={[8, 8]} rowHeight={30} width={width} cols={12}>
                <Box
                  key="create"
                  sx={{
                    border: '2px dashed',
                    borderRadius: t.vars.shape.borderRadius,
                    borderColor: t.vars.palette.divider,
                  }}
                >
                  Create
                </Box>
                {widgets.map(_ => (
                  <Core.Panel
                    sx={{border: _.drafting ? `2px solid ${t.vars.palette.primary.main}` : undefined}}
                    key={_.id}
                  >
                    {_.drafting && <Icon>{widgetTypeToIcon[_.type]}</Icon>}
                    Chart {JSON.stringify(_.drafting)}
                  </Core.Panel>
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
          {type && <DashboardCreatorPanel />}
        </>
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
