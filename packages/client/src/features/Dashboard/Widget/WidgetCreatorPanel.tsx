import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import {Controller, useForm, UseFormReturn} from 'react-hook-form'
import React, {RefObject, useEffect, useRef} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {Box, LinearProgress} from '@mui/material'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {fnSwitch} from '@axanc/ts-utils'
import {KoboSchemaHelper} from 'infoportal-common'
import {useDashboardCreatorContext, WidgetDraft} from '@/features/Dashboard/DashboardCreator'

type Context = {
  widget: WidgetDraft
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  schema: KoboSchemaHelper.Bundle
  onChange: <T extends keyof WidgetDraft>(key: T, value: WidgetDraft[T]) => void
}

const Context = React.createContext<Context>({} as Context)
const useContext = () => React.useContext(Context)

export const WidgetCreatorFormPanel = ({
  onClose,
  widget,
  onChange,
}: {
  widget: WidgetDraft
  onChange: (form: WidgetDraft) => void
  onClose: () => void
}) => {
  const {dashboard, workspaceId} = useDashboardCreatorContext()

  const _onChange = <T extends keyof WidgetDraft>(key: T, value: WidgetDraft[T]) => {
    onChange({...widget, [key]: value})
  }

  const stepperRef = useRef<Core.StepperHandle>(null)
  const querySchema = useQuerySchema({workspaceId, formId: dashboard.sourceFormId})
  const {m} = useI18n()
  if (querySchema.isLoading) {
    return <LinearProgress />
  }
  if (!querySchema.data) {
    return <Core.Alert severity="error" title={m.anErrorOccurred} />
  }
  return (
    <Context.Provider
      value={{
        onChange: _onChange,
        widget,
        onClose,
        stepperRef,
        schema: querySchema.data,
      }}
    >
      <Core.PanelWBody
        sx={{height: '100%', width: 300, ml: 1, mr: -1, borderBottomRightRadius: 0, borderTopRightRadius: 0}}
      >
        <SelectQuestion />
      </Core.PanelWBody>
    </Context.Provider>
  )
}

function SelectQuestion() {
  const {m} = useI18n()
  const {schema, widget, onChange} = useContext()
  return (
    <Box>
      <Core.Input value={widget.title} label={m.title} onChange={_ => onChange('title', _.target.value)} />
      <SelectQuestionInput
        value={widget.questionName}
        onChange={(e, _) => onChange('questionName', _ ?? undefined)}
        schema={schema.schema}
        questionTypeFilter={['select_multiple', 'select_one']}
      />
      {widget.questionName &&
        fnSwitch(
          widget.type,
          {
            BarChart: <CreateBarchart />,
          },
          () => <></>,
        )}
    </Box>
  )
}

function CreateBarchart() {
  const {m} = useI18n()
  const {schema, widget} = useContext()
  const question = schema.helper.questionIndex[widget.questionName!]
  const choices = schema.helper.choicesIndex[question?.select_from_list_name!]
  const barChartForm = useForm<Ip.Dashboard.Widget.Config['BarChart']>()

  useEffect(() => {
    barChartForm.setValue('multiple', question.type === 'select_one')
  }, [question])

  if (!question) {
    return <Core.Alert severity="error" title={m.anErrorOccurred} />
  }

  return (
    <Box>
      {choices.map(choice => (
        <Box key={choice.name}>{choice.name}</Box>
      ))}
    </Box>
  )
}
