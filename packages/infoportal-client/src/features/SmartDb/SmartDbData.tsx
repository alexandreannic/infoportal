import {createRoute} from '@tanstack/react-router'
import {smartDbRoute} from '@/features/SmartDb/SmartDb.js'
import {Core} from '@/shared'

export const smartDbDataRoute = createRoute({
  getParentRoute: () => smartDbRoute,
  path: 'data',
  component: SmartDbData,
})

export function SmartDbData() {
  return <Core.Panel>DATA</Core.Panel>
}
