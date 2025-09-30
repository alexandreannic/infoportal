import {SxProps} from '@mui/material'
import {useDashboardEditorContext} from '@/features/Dashboard/Section/DashboardSection'
import React, {useMemo} from 'react'
import {useQuestionInfo, useWidgetSettingsContext} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {Core} from '@/shared'

export function SelectChoices({
  value = [],
  onChange,
  label,
  sx,
  questionName,
}: {
  questionName?: string
  sx?: SxProps
  value?: string[]
  onChange: (_: string[]) => void
  label?: string
}) {
  const {choices} = useQuestionInfo(questionName)
  const {schema} = useDashboardEditorContext()
  const options = useMemo(() => {
    if (!questionName || !choices) return []
    return choices?.map(_ => ({value: _.name, children: schema.translate.choice(questionName, _.name)}))
  }, [choices, questionName])
  return <Core.SelectMultiple sx={sx} label={label} value={value} options={options} onChange={onChange} />
}
