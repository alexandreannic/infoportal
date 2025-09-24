import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'

export const DashboardHeader = () => {
  const {m} = useI18n()
  const {dashboard} = useDashboardCreatorContext()
  return (
    <Core.PanelWBody>
      <Core.PanelTitle>{dashboard.name}</Core.PanelTitle>
    </Core.PanelWBody>
  )
}
