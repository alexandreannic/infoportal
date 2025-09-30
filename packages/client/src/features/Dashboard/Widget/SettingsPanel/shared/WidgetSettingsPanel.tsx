import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import React, {RefObject, useRef} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Icon, useTheme} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {useIpToast} from '@/core/useToast'
import {Kobo} from 'kobo-sdk'
import {SettingsBarChart} from '@/features/Dashboard/Widget/SettingsPanel/chart/SettingsBarChart'
import {SettingsPieChart} from '@/features/Dashboard/Widget/SettingsPanel/chart/SettingsPieChart'
import {SettingsLineChart} from '@/features/Dashboard/Widget/SettingsPanel/chart/SettingsLineChart'

export type WidgetUpdatePayload = Omit<Ip.Dashboard.Widget.Payload.Update, 'workspaceId' | 'widgetId' | 'dashboardId'>
type Context = {
  widget: Ip.Dashboard.Widget
  stepperRef: RefObject<Core.StepperHandle | null>
  onClose: () => void
  onChange: (value: WidgetUpdatePayload) => void
}

const Context = React.createContext<Context>({} as Context)
export const useWidgetSettingsContext = () => React.useContext(Context)

export const getQuestionTypeByWidget = (type: Ip.Dashboard.Widget.Type): Kobo.Form.QuestionType[] => {
  switch (type) {
    case 'Card': {
      return []
    }
    case 'BarChart': {
      return ['select_multiple', 'select_one']
    }
    case 'LineChart': {
      return ['date', 'datetime']
    }
    case 'PieChart': {
      return ['select_one', 'integer', 'decimal']
    }
    default: {
      return []
    }
  }
}
export const useQuestionInfo: {
  (_: string): {question: Kobo.Form.Question; choices: Kobo.Form.Choice[]}
  (_?: string): {question?: Kobo.Form.Question; choices?: Kobo.Form.Choice[]}
} = (questionName?: string) => {
  const {schema} = useDashboardCreatorContext()
  if (!questionName) return {question: undefined, choices: undefined}
  const question = schema.helper.questionIndex[questionName!]
  const choices = schema.helper.choicesIndex[question?.select_from_list_name!]
  return {question, choices} as any
}

const padding = 0.75
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
            p: padding,
            background: t.vars.palette.background.default,
            borderBottom: `1px solid ${t.vars.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
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
          <Core.AsyncInput
            helperText={null}
            value={widget.title}
            originalValue={widget.title}
            label={m.title}
            onSubmit={_ => onChange({title: _})}
          />
        </Core.PanelBody>
        <Core.PanelBody sx={{p: padding}}>
          {fnSwitch(
            widget.type,
            {
              BarChart: <SettingsBarChart />,
              PieChart: <SettingsPieChart />,
              LineChart: <SettingsLineChart />,
            },
            () => (
              <></>
            ),
          )}
        </Core.PanelBody>
      </Core.Panel>
    </Context.Provider>
  )
}

// function SelectChoices2() {
//   const {m} = useI18n()
//   const {schema} = useDashboardCreatorContext()
//   const {question, choices} = useQuestionInfo()
//   return (
//     <Core.MultipleChoices
//       options={choices.map(_ => ({value: _.name, label: schema.translate.choice(widget.questionName, _.name)}))}
//       onChange={console.log}
//     >
//       {({options, allChecked, toggleAll, someChecked}) => (
//         <>
//           <FormControlLabel
//             control={<Checkbox checked={allChecked} indeterminate={someChecked} onClick={toggleAll} />}
//             label={m.selectAll}
//           />
//           <Core.RadioGroup dense multiple sx={{maxHeight: 300, overflowY: 'scroll'}}>
//             {options.map(choice => (
//               <Core.RadioGroupItem value={choice.value} key={choice.key} title={choice.label} />
//             ))}
//           </Core.RadioGroup>
//         </>
//       )}
//     </Core.MultipleChoices>
//   )
// }

export function Label({sx, ...props}: Core.TxtProps) {
  return <Core.Txt color="hint" size="small" sx={{mt: 1, ...sx}} block {...props} />
}
