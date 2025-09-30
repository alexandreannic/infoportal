import {TabContent} from '@/shared/Tab/TabContent'
import {createRoute} from '@tanstack/react-router'
import {dashboardRoute} from '@/features/Dashboard/Dashboard'

export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  component: DashboardSettings,
})

export function DashboardSettings() {
  return <TabContent>HOME</TabContent>
}
