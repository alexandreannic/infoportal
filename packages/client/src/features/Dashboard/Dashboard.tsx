import {Core, Page} from '@/shared'
import {createRoute, Link, Outlet, useMatchRoute} from '@tanstack/react-router'
import 'react-grid-layout/css/styles.css'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import React, {useState} from 'react'
import {UseQueryDashboardSecion} from '@/core/query/dashboard/useQueryDashboardSection'
import {Icon, Tab, Tabs} from '@mui/material'
import {dashboardSectionRoute} from '@/features/Dashboard/Section/DashboardSection'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {useEffectFn} from '@axanc/react-hooks'
import {dashboardSettingsRoute} from '@/features/Dashboard/DashboardSettings'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {UseQuerySubmission} from '@/core/query/useQuerySubmission'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {DashboardProvider} from '@/features/Dashboard/DashboardContext'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/edit',
  component: Dashboard,
})

const useActiveTab = ({
  sections,
  dashboardId,
  workspaceId,
}: {
  dashboardId?: Ip.DashboardId
  sections?: Ip.Dashboard.Section[]
  workspaceId: Ip.WorkspaceId
}) => {
  const matchRoute = useMatchRoute()
  const settingsMatch = matchRoute({
    to: dashboardSettingsRoute.fullPath,
    params: {workspaceId},
    fuzzy: true,
  })
  if (settingsMatch) return 'settings'
  return sections?.find(_ => {
    return matchRoute({
      to: '/$workspaceId/dashboard/$dashboardId/edit/s/$sectionId',
      params: {workspaceId, dashboardId, sectionId: _.id},
      fuzzy: true,
    })
  })?.id
}

export function Dashboard() {
  const {m} = useI18n()
  const params = dashboardRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId

  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const queryDashboardSection = UseQueryDashboardSecion.search({workspaceId, dashboardId})
  const querySchema = useQuerySchema({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const querySubmissions = UseQuerySubmission.search({workspaceId, formId: queryDashboard.data?.sourceFormId})
  const queryWidgets = UseQueryDashboardWidget.search({workspaceId, dashboardId})
  const queryDashboardSectionCreate = UseQueryDashboardSecion.create({workspaceId, dashboardId})

  const isLoading = [queryDashboard, queryDashboardSection, querySchema, querySubmissions, queryWidgets].some(
    _ => _.isLoading,
  )

  const {setTitle} = useLayoutContext()
  const [newSectionName, setNewSectionName] = useState('')

  useEffectFn(queryDashboard.data, _ => setTitle(_.name))

  const activeTab = useActiveTab({workspaceId, dashboardId, sections: queryDashboardSection.data})

  return (
    <Page width="full" loading={isLoading}>
      <Tabs variant="scrollable" scrollButtons="auto" value={activeTab}>
        <Tab
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value="settings"
          to={dashboardSettingsRoute.fullPath}
          label={m.settings}
        />
        {queryDashboardSection.data?.map(_ => (
          <Tab
            key={_.id}
            iconPosition="start"
            component={Link}
            {...({
              value: _.id,
              to: dashboardSectionRoute.fullPath,
              params: {sectionId: _.id},
            } as any)}
            label={_.title}
          />
        ))}
        <Core.Modal
          title={m._dashboard.newSection}
          loading={queryDashboardSectionCreate.isPending}
          overrideActions={null}
          content={close => (
            <>
              <Core.Input
                sx={{mt: 0.5}}
                value={newSectionName}
                onChange={_ => setNewSectionName(_.target.value)}
                label={m.name}
              />
              <Core.Btn onClick={close} children={m.close} />
              <Core.Btn
                children={m.create}
                onClick={async () => {
                  await queryDashboardSectionCreate.mutateAsync({title: newSectionName})
                  close()
                  setNewSectionName('')
                }}
              />
            </>
          )}
        >
          <Core.Btn icon="add" sx={{ml: .5, my: .25, textTransform: 'capitalize'}}>
            {m.new}
          </Core.Btn>
        </Core.Modal>
      </Tabs>
      {querySubmissions.data && queryWidgets.data && queryWidgets.data && queryDashboard.data && querySchema.data && (
        <DashboardProvider
          workspaceId={workspaceId}
          widgets={queryWidgets.data}
          schema={querySchema.data}
          submissions={querySubmissions.data.data}
          dashboard={queryDashboard.data}
        >
          <Outlet />
        </DashboardProvider>
      )}
    </Page>
  )
}
