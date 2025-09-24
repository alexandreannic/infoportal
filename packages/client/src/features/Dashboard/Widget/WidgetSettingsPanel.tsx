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
  const _onChange = <T extends keyof WidgetDraft>(key: T, value: WidgetDraft[T]) => {
    onChange({...widget, [key]: value})
  }

  const stepperRef = useRef<Core.StepperHandle>(null)
  const {m} = useI18n()

  return (
    <Context.Provider
      value={{
        onChange: _onChange,
        widget,
        onClose,
        stepperRef,
      }}
    >
      <Core.PanelWBody
        sx={{height: '100%', width: 300, ml: 1, mr: -1, borderBottomRightRadius: 0, borderTopRightRadius: 0}}
      >
        <Core.Input value={widget.title} label={m.title} onChange={_ => _onChange('title', _.target.value)} />

        {widget.questionName &&
          fnSwitch(
            widget.type,
            {
              BarChart: <CreateBarchart />,
            },
            () => <></>,
          )}
      </Core.PanelWBody>
    </Context.Provider>
  )
}

function CreateBarchart() {
  const {m} = useI18n()
  const {schema} = useDashboardCreatorContext()
  const {widget} = useContext()
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
