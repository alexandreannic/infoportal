import {useEffect} from 'react'
import {useWidgetSettingsContext} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export const useEffectSetTitle = (questionName?: string) => {
  const schema = useDashboardContext(_ => _.schema)
  const {widget, onChange} = useWidgetSettingsContext()
  useEffect(() => {
    if (!questionName) return
    if (!widget.i18n_title || widget.i18n_title.length === 0) {
      const i18n_title = schema.helper.questionIndex[questionName]?.label
      if (!i18n_title) return
      onChange({i18n_title})
    }
  }, [questionName])
}
