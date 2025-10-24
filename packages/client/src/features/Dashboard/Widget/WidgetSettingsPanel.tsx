import {Core} from '@/shared'
import {Ip} from 'infoportal-api-sdk'
import React, {RefObject, useRef} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box, Icon, useTheme} from '@mui/material'
import {fnSwitch, map} from '@axanc/ts-utils'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import {UseQueryDashboardWidget} from '@/core/query/dashboard/useQueryDashboardWidget'
import {useIpToast} from '@/core/useToast'
import {Kobo} from 'kobo-sdk'
import {BarChartSettings} from '@/features/Dashboard/Widget/BarChart/BarChartSettings'
import {PieChartSettings} from '@/features/Dashboard/Widget/PieChart/PieChartSettings'
import {LineChartSettings} from '@/features/Dashboard/Widget/LineChart/LineChartSettings'
import {GeoPointSettings} from '@/features/Dashboard/Widget/GeoPoint/GeoPointSettings'
import {GeoChartSettings} from '@/features/Dashboard/Widget/GeoChart/GeoChartSettings'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {TableSettings} from '@/features/Dashboard/Widget/Table/TableSettings'
import {CardSettings} from '@/features/Dashboard/Widget/Card/CardSettings'
import {AlertSettings} from '@/features/Dashboard/Widget/Alert/AlertSettings'

export type WidgetUpdatePayload = Omit<Ip.Dashboard.Widget.Payload.Update, 'workspaceId' | 'id' | 'dashboardId'>

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
    case 'BarChart': {
      return ['select_multiple', 'select_one', 'calculate']
    }
    case 'LineChart': {
      return ['date', 'datetime', 'calculate']
    }
    case 'GeoPoint': {
      return ['geopoint']
    }
    case 'GeoChart': {
      return ['text', 'select_one', 'select_multiple', 'calculate']
    }
    case 'PieChart': {
      return ['select_one', 'select_multiple', 'integer', 'decimal', 'calculate']
    }
    case 'Table': {
      return ['select_one', 'integer', 'decimal']
    }
    case 'Card': {
      return ['integer', 'decimal', 'calculate']
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
  const {schema} = useDashboardContext()
  if (!questionName) return {question: undefined, choices: undefined}
  const question = schema.helper.questionIndex[questionName!]
  const choices = schema.helper.choicesIndex[question?.select_from_list_name!]
  return {question, choices} as any
}

const padding = 0.75

export const WidgetCreatorFormPanel = ({
  sectionId,
  onClose,
  widget,
  onChange,
}: {
  sectionId: Ip.Dashboard.SectionId
  widget: Ip.Dashboard.Widget
  onChange: (value: WidgetUpdatePayload) => void
  onClose: () => void
}) => {
  const stepperRef = useRef<Core.StepperHandle>(null)
  const {m} = useI18n()
  const t = useTheme()
  const {workspaceId, langIndex, dashboard, schema} = useDashboardContext()
  const queryWidgetRemove = UseQueryDashboardWidget.remove({workspaceId, dashboardId: dashboard.id, sectionId})
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
          // mr: -1,
          // borderBottomRightRadius: 0,
          // borderTopRightRadius: 0,
        }}
      >
        <Core.PanelBody
          sx={{
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
                  .mutateAsync({id: widget.id})
                  .then(close)
                  .then(() => toastSuccess(m.successfullyDeleted))
              }
            >
              delete
            </Core.IconBtn>
            <Core.IconBtn onClick={onClose}>close</Core.IconBtn>
          </Box>
          <Core.AsyncInput
            key={widget.i18n_title?.[langIndex]}
            helperText={null}
            value={widget.i18n_title?.[langIndex]}
            originalValue={widget.i18n_title?.[langIndex]}
            label={m.title}
            onSubmit={value => {
              const prev = widget.i18n_title ?? []
              const next = [...prev]
              while (next.length <= langIndex) next.push('')
              next[langIndex] = value ?? ''
              const i18n_title = next
              onChange({i18n_title})
            }}
          />
        </Core.PanelBody>
        {fnSwitch(
          widget.type,
          {
            Table: <TableSettings />,
            BarChart: <BarChartSettings />,
            PieChart: <PieChartSettings />,
            LineChart: <LineChartSettings />,
            GeoPoint: <GeoPointSettings />,
            GeoChart: <GeoChartSettings />,
            Card: <CardSettings />,
            Alert: <AlertSettings />,
          },
          () => (
            <></>
          ),
        )}
      </Core.Panel>
    </Context.Provider>
  )
}

// function SelectChoices2() {
//   const {m} = useI18n()
//   const {schema} = useDashboardEditorContext()
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
