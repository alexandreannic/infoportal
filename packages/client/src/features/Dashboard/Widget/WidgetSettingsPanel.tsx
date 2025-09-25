import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import {useForm} from 'react-hook-form'
import React, {RefObject, useEffect, useRef} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'

type Context = {
  widget: Ip.Dashboard.Widget
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  onChange: <T extends keyof Ip.Dashboard.Widget>(key: T, value: Ip.Dashboard.Widget[T]) => void
}

const Context = React.createContext<Context>({} as Context)
const useContext = () => React.useContext(Context)

export const WidgetCreatorFormPanel = ({
  onClose,
  widget,
  onChange,
}: {
  widget: Ip.Dashboard.Widget
  onChange: <T extends keyof Ip.Dashboard.Widget>(key: T, value: Ip.Dashboard.Widget[T]) => void
  onClose: () => void
}) => {
  const stepperRef = useRef<Core.StepperHandle>(null)
  const {m} = useI18n()

  return (
    <Context.Provider
      value={{
        onChange,
        widget,
        onClose,
        stepperRef,
      }}
    >
      <Core.PanelWBody
        sx={{overflowY: 'scroll', height: '100%', ml: 1, mr: -1, borderBottomRightRadius: 0, borderTopRightRadius: 0}}
      >
        <Core.IconBtn onClick={onClose}>close</Core.IconBtn>

        <Core.Input value={widget.title} label={m.title} onChange={_ => onChange('title', _.target.value)} />

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
