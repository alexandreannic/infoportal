import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import {useForm} from 'react-hook-form'
import React, {RefObject, useEffect, useRef} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box, FormControlLabel, Slider, Checkbox, Icon, useTheme} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetCreateBtn'

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
  const t = useTheme()
  const {schema} = useDashboardCreatorContext()

  return (
    <Context.Provider
      value={{
        onChange,
        widget,
        onClose,
        stepperRef,
      }}
    >
      <Core.Panel
        sx={{
          overflowY: 'scroll',
          height: '100%',
          ml: 1,
          mr: -1,
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Core.PanelBody
          sx={{
            mb: 1,
            background: t.vars.palette.background.default,
            borderBottom: `1px solid ${t.vars.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Icon color="disabled">{widgetTypeToIcon[widget.type]}</Icon>
            <Core.PanelTitle sx={{ml: 0.5, flex: 1}}>{m._widgetType[widget.type]}</Core.PanelTitle>
            <Core.IconBtn onClick={onClose}>close</Core.IconBtn>
          </Box>
          <Core.Input
            helperText={null}
            disabled
            label={m.question}
            value={schema.translate.question(widget.questionName)}
          />
        </Core.PanelBody>
        <Core.PanelBody>
          <Core.AsyncInput
            value={widget.title}
            originalValue={widget.title}
            label={m.title}
            onSubmit={_ => onChange('title', _)}
          />

          {widget.questionName &&
            fnSwitch(
              widget.type,
              {
                BarChart: <CreateBarchart />,
              },
              () => <></>,
            )}
        </Core.PanelBody>
      </Core.Panel>
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
      <Core.MultipleChoices
        options={choices.map(_ => ({value: _.name, label: schema.translate.choice(widget.questionName, _.name)}))}
        onChange={console.log}
      >
        {({options, allChecked, toggleAll, someChecked}) => (
          <>
            <FormControlLabel
              control={<Checkbox checked={allChecked} indeterminate={someChecked} onClick={toggleAll} />}
              label={m.selectAll}
            />
            <Core.RadioGroup dense multiple sx={{maxHeight: 300, overflowY: 'scroll'}}>
              {options.map(choice => (
                <Core.RadioGroupItem value={choice.value} key={choice.key} title={choice.label} />
              ))}
            </Core.RadioGroup>
          </>
        )}
      </Core.MultipleChoices>
      <Core.Txt uppercase color="hint" size="small" sx={{mb: -1, mt: 2}} block>
        {m._dashboard.maxChoicesToDisplay}
      </Core.Txt>
      <Slider defaultValue={choices.length} max={choices.length} valueLabelDisplay="auto" />
    </Box>
  )
}
