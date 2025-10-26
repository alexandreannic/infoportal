import {SxProps} from '@mui/material'
import React, {useMemo} from 'react'
import {useQuestionInfo} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Core} from '@/shared'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

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
  const schema = useDashboardContext(_ => _.schema)
  const options = useMemo(() => {
    if (!questionName || !choices) return []
    return choices?.map(_ => ({value: _.name, children: schema.translate.choice(questionName, _.name)}))
  }, [choices, questionName])
  return <Core.SelectMultiple sx={sx} label={label} value={value} options={options} onChange={onChange} />
}
