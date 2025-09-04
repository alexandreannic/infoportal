import {Page} from '@/shared'
import {createRoute} from '@tanstack/react-router'
import {formRootRoute} from '@/features/Form/Form'

export const smartDbRoute = createRoute({
  getParentRoute: () => formRootRoute,
  path: 'smart-db/$smartDbId',
  component: SmartDb,
})

export function SmartDb() {
  return <Page>SmartDb</Page>
}
