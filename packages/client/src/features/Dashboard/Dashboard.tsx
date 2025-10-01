import {Core, Page} from '@/shared'
import {createRoute, Link, Outlet} from '@tanstack/react-router'
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

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'dashboard/$dashboardId/edit',
  component: Dashboard,
})

export function Dashboard() {
  const {m} = useI18n()
  const params = dashboardRoute.useParams()
  const workspaceId = params.workspaceId as Ip.WorkspaceId
  const dashboardId = params.dashboardId as Ip.DashboardId

  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})
  const queryDashboardSection = UseQueryDashboardSecion.search({workspaceId, dashboardId})
  const queryDashboardSectionCreate = UseQueryDashboardSecion.create({workspaceId, dashboardId})

  const activeTab = ''
  const {setTitle} = useLayoutContext()
  const [newSectionName, setNewSectionName] = useState('')

  useEffectFn(queryDashboard.data, _ => setTitle(_.name))

  return (
    <Page width="full" loading={queryDashboardSection.isLoading || queryDashboard.isLoading}>
      <Tabs variant="scrollable" scrollButtons="auto" value={activeTab}>
        <Tab
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={dashboardSettingsRoute.fullPath}
          to={dashboardSettingsRoute.fullPath}
          label={m.settings}
        />
        {queryDashboardSection.data?.map(_ => (
          <Tab
            key={_.id}
            // icon={<Icon>{appConfig.icons.dataTable}</Icon>}
            iconPosition="start"
            // sx={{minHeight: 34, py: 1}}
            component={Link}
            {...({
              value: dashboardSectionRoute.fullPath,
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
          <Tab icon={<Icon>add</Icon>} iconPosition="start" label={m.new} />
        </Core.Modal>
      </Tabs>
      <Outlet />
    </Page>
  )
}
