import {Box, Icon, useTheme} from '@mui/material'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React, {memo, useMemo} from 'react'
import {Core} from '@/shared'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {Ip} from 'infoportal-api-sdk'
import {fnSwitch} from '@axanc/ts-utils'

type Status = 'editing'

export const WidgetCard = memo(
  ({status, widget, onClick}: {status?: Status; widget: Ip.Dashboard.Widget; onClick: () => void}) => {
    widget.questionName
    const t = useTheme()
    if (widget.questionName) {
      widget.questionName
    }
    if (widget.questionName === undefined || widget.questionName === null) {
    } else {
      widget.questionName
    }
    return (
      <Core.Panel
        onClick={onClick}
        sx={{
          p: 1,
          height: '100%',
          transition: t.transitions.create('box-shadow'),
          boxShadow: status === 'editing' ? t.vars.shadows[2] : undefined,
          border: '2px solid',
          borderColor: status === 'editing' ? t.vars.palette.primary.main : 'transparent',
        }}
      >
        {widget.type !== 'PieChart' && (
          <Core.Txt truncate title={widget.title} block size="big" bold sx={{flex: 1, mb: 1}}>
            {widget.title}
          </Core.Txt>
        )}
        <Box>
          {widget.questionName === undefined ? (
            <Placeholder type={widget.type} />
          ) : (
            fnSwitch(
              widget.type,
              {
                BarChart: <BarChart widget={widget as any} />,
                PieChart: <PieChart widget={widget as any} />,
              },
              () => <></>,
            )
          )}
        </Box>
      </Core.Panel>
    )
  },
)

function Placeholder({type}: {type: Ip.Dashboard.Widget.Type}) {
  return (
    <Box sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
      <Icon sx={{fontSize: '3em'}}>{widgetTypeToIcon[type]}</Icon>
    </Box>
  )
}

function computeFn(qName: string, conf: Ip.Dashboard.Widget.Config['PieChart']) {
  if (conf.filterChoice) {
    return [
      (_: Record<string, string>) => conf.filterChoice!.includes(_[qName]),
      (_: Record<string, string>) => !conf.filterChoiceBase || conf.filterChoiceBase!.includes(_[qName]),
    ]
  }
  if (conf.filterNumber) {
    return [
      (_: Record<string, number>) => {
        const value = _[qName]
        if (isNaN(value)) return false
        if (conf.filterNumber?.min && conf.filterNumber.min > value) return false
        if (conf.filterNumber?.max && conf.filterNumber.max < value) return false
        return true
      },
      (_: Record<string, number>) => {
        if (!conf.filterNumberBase) return true
        const value = _[qName]
        if (isNaN(value)) return false
        if (conf.filterNumberBase?.min && conf.filterNumberBase.min > value) return false
        if (conf.filterNumberBase?.max && conf.filterNumberBase.max < value) return false
        return true
      },
    ]
  }
  return [(_: any) => true, (_: any) => true]
}

function PieChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']
  const {flatSubmissions, schema} = useDashboardCreatorContext()
  const [filterValue, filterBase] = useMemo(() => {
    return computeFn(widget.questionName, config)
  }, [widget.questionName, config])

  return (
    <Core.ChartPieWidgetBy<any>
      data={flatSubmissions}
      dense={config.dense}
      property={widget.questionName}
      filter={filterValue}
      filterBase={filterBase}
      showBase={config.showBase}
      showValue={config.showValue}
    />
  )
}

function BarChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const {flatSubmissions, schema} = useDashboardCreatorContext()
  const labels = useMemo(() => {
    const q = widget.questionName
    return schema.helper
      .getOptionsByQuestionName(q)
      .reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [widget.questionName, schema])
  return (
    <Box sx={{overflowY: 'scroll'}}>
      <Core.ChartBarMultipleByKey data={flatSubmissions} label={labels} property={widget.questionName} />
    </Box>
  )
}
