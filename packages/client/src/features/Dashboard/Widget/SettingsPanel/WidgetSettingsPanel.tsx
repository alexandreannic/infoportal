import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import React, {RefObject, useRef} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Checkbox, FormControlLabel, Icon, useTheme} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import {UseQueryDashboardWidget} from '@/core/query/useQueryDashboardWidget'
import {useIpToast} from '@/core/useToast'
import {Kobo} from 'kobo-sdk'
import {SettingsBarChart} from '@/features/Dashboard/Widget/SettingsPanel/SettingsBarChart'
import {SettingsPieChart} from '@/features/Dashboard/Widget/SettingsPanel/SettingsPieChart'

export type WidgetUpdatePayload = Omit<Ip.Dashboard.Widget.Payload.Update, 'workspaceId' | 'widgetId' | 'dashboardId'>
type Context = {
  widget: Ip.Dashboard.Widget
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  onChange: (value: WidgetUpdatePayload) => void
  question: Kobo.Form.Question
  choices: Kobo.Form.Choice[]
}

const Context = React.createContext<Context>({} as Context)
export const useWidgetSettingsContext = () => React.useContext(Context)

export const WidgetCreatorFormPanel = ({
  onClose,
  widget,
  onChange,
}: {
  widget: Ip.Dashboard.Widget
  onChange: (value: WidgetUpdatePayload) => void
  onClose: () => void
}) => {
  const stepperRef = useRef<Core.StepperHandle>(null)
  const {m} = useI18n()
  const t = useTheme()
  const {workspaceId, dashboard, schema} = useDashboardCreatorContext()
  const queryWidgetRemove = UseQueryDashboardWidget.remove({workspaceId, dashboardId: dashboard.id})
  const {toastSuccess} = useIpToast()
  const question = schema.helper.questionIndex[widget.questionName!]
  const choices = schema.helper.choicesIndex[question?.select_from_list_name!]

  return (
    <Context.Provider
      value={{
        onChange,
        widget,
        onClose,
        stepperRef,
        question,
        choices,
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
            <Core.IconBtn
              loading={queryWidgetRemove.isPending}
              color="error"
              onClick={() =>
                queryWidgetRemove
                  .mutateAsync({widgetId: widget.id})
                  .then(close)
                  .then(() => toastSuccess(m.successfullyDeleted))
              }
            >
              delete
            </Core.IconBtn>
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
            onSubmit={_ => onChange({title: _})}
          />

          {widget.questionName &&
            fnSwitch(
              widget.type,
              {
                BarChart: <SettingsBarChart />,
                PieChart: <SettingsPieChart />,
              },
              () => <></>,
            )}
        </Core.PanelBody>
      </Core.Panel>
    </Context.Provider>
  )
}

function SelectChoices2() {
  const {m} = useI18n()
  const {schema} = useDashboardCreatorContext()
  const {widget, question, choices} = useWidgetSettingsContext()
  return (
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
  )
}

export function Label({sx, ...props}: Core.TxtProps) {
  return <Core.Txt uppercase color="hint" size="small" sx={{mt: 1, ...sx}} block {...props} />
}
