import {Box, Icon, useTheme} from '@mui/material'
import {widgetTypeToIcon} from '@/features/Dashboard/Widget/WidgetCreateBtn'
import React, {forwardRef, useMemo} from 'react'
import {Core} from '@/shared'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {Ip} from 'infoportal-api-sdk'
import {fnSwitch} from '@axanc/ts-utils'
import {Widget} from '@prisma/client'

type Status = 'editing'

export const WidgetCard = forwardRef(
  ({status, widget, onClick}: {status?: Status; widget: Ip.Dashboard.Widget; onClick: () => void}, ref) => {
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
        ref={ref}
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
        <Box display="flex" alignItems="center">
          <Core.Txt block size="big" bold sx={{flex: 1, mb: 1}}>
            {widget.title}
          </Core.Txt>
          <Icon sx={{color: t.vars.palette.text.secondary}} className="drag-handle">
            drag_indicator
          </Icon>
        </Box>
        <Box>
          {widget.questionName === undefined ? (
            <Placeholder type={widget.type} />
          ) : (
            fnSwitch(
              widget.type,
              {
                BarChart: <BarChart widget={widget as any} />,
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

function BarChart({widget}: {widget: Pick<Widget, 'config' | 'questionName'>}) {
  const {submissions, schema} = useDashboardCreatorContext()
  const labels = useMemo(() => {
    const q = widget.questionName
    return schema.helper
      .getOptionsByQuestionName(q)
      .reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [widget.questionName, schema])
  return (
    <Box sx={{overflowY: 'scroll'}}>
      <Core.ChartBarMultipleByKey
        data={submissions.map(_ => _.answers) as any}
        label={labels}
        property={widget.questionName as any}
      />
    </Box>
  )
}
