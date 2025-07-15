import {createRoute} from '@tanstack/react-router'
import {rootRoute} from '@/Router'

export const collectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'collect/$formId',
  staticData: true,
  component: Collect,
})

function Collect() {
  return <div>Collect</div>
}
