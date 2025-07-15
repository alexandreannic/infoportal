import {Page} from '@/shared'
import {Panel, PanelBody} from '@/shared/Panel'
import {createRoute} from '@tanstack/react-router'
import {workspaceRoute} from '@/features/Workspace/Workspace'

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/',
  component: Dashboard,
})

function Dashboard() {
  return (
    <Page width="full">
      <Panel>
        <PanelBody>Dashboard</PanelBody>
      </Panel>
    </Page>
  )
}
