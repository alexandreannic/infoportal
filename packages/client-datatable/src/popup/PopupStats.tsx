import React, {ReactNode, useMemo} from 'react'
import {Box, Popover, PopoverProps} from '@mui/material'
import {
  Btn,
  ChartBar,
  ChartHelper,
  ChartLineByDateFiltered,
  PanelBody,
  PanelFoot,
  PanelHead,
  Txt,
} from '@infoportal/client-core'
import {KeyOf} from 'infoportal-common'
import {seq} from '@axanc/ts-utils'
import {Popup} from '../core/reducer'
import {useCtx} from '../core/DatatableContext'
import {useConfig} from '../DatatableConfig'
import {Option, Row} from '../core/types.js'

export const PopupStats = ({columnId, event}: Popup.StatsAgs) => {
  const dispatch = useCtx(_ => _.dispatch)
  const getColumnOptions = useCtx(_ => _.getColumnOptions)
  const dataFilteredAndSorted = useCtx(_ => _.dataFilteredAndSorted)
  const columnsIndex = useCtx(_ => _.columns.indexMap)
  const column = columnsIndex[columnId]
  const close = () => dispatch({type: 'CLOSE_POPUP'})

  switch (column.type) {
    case 'number':
      return (
        <NumberChoicesPopover
          anchorEl={event.target}
          question={columnId}
          mapValues={(_: any) => column.render(_).value as any}
          data={dataFilteredAndSorted ?? []}
          onClose={close}
        />
      )
    case 'date': {
      return (
        <DatesPopover
          anchorEl={event.target}
          title={column.head ?? columnId}
          getValue={(_: any) => column.render(_).value as any}
          data={dataFilteredAndSorted ?? []}
          onClose={close}
        />
      )
    }
    case 'select_multiple':
    case 'select_one': {
      return (
        <MultipleChoicesPopover
          translations={getColumnOptions(columnId)}
          anchorEl={event.target}
          multiple={column.type === 'select_multiple'}
          getValue={(_: any) => column.render(_).value as any}
          title={column.head}
          data={dataFilteredAndSorted ?? []}
          onClose={close}
        />
      )
    }
  }
}

const RenderRow = ({label, value}: {label: ReactNode; value: ReactNode}) => {
  return (
    <Box sx={{display: 'flex', '&:not(:last-of-type)': {mb: 1.5}}}>
      <Txt color="hint" sx={{flex: 1, mr: 2}}>
        {label}
      </Txt>
      <Txt block bold>
        {value}
      </Txt>
    </Box>
  )
}

export const NumberChoicesPopover = <T,>({
  question,
  data,
  mapValues,
  anchorEl,
  onClose,
}: {
  mapValues?: (_: any, i: number) => any
  question: KeyOf<T>
  data: T[]
} & Pick<PopoverProps, 'anchorEl' | 'onClose'>) => {
  const {m, formatLargeNumber} = useConfig()
  const chart = useMemo(() => {
    const mapped = seq(data)
      .map((_, i) => (mapValues ? mapValues(_, i) : _[question]))
      .filter(_ => _ !== undefined && _ !== '')
      .map(_ => +_)
    const min = Math.min(...mapped)
    const max = Math.max(...mapped)
    const sum = mapped.sum()
    const avg = sum / mapped.length
    return {mapped, min, max, sum, avg}
  }, [data, question])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>{question as string}</PanelHead>
      <PanelBody>
        <RenderRow label={m.count} value={formatLargeNumber(chart.mapped.length)} />
        <RenderRow label={m.sum} value={formatLargeNumber(chart.sum)} />
        <RenderRow label={m.average} value={formatLargeNumber(chart.avg, {maximumFractionDigits: 2})} />
        <RenderRow label={m.min} value={formatLargeNumber(chart.min)} />
        <RenderRow label={m.max} value={formatLargeNumber(chart.max)} />
      </PanelBody>
      <PanelFoot alignEnd>
        <Btn color="primary" onClick={onClose as any}>
          {m.close}
        </Btn>
      </PanelFoot>
    </Popover>
  )
}

const MultipleChoicesPopover = <T extends Row>({
  getValue,
  title,
  data,
  anchorEl,
  onClose,
  multiple,
  translations,
}: {
  title?: ReactNode
  translations?: Option[]
  // multiple?: boolean
  // getValue: (_: T) => string[] | string
  data: T[]
} & Pick<PopoverProps, 'anchorEl' | 'onClose'> &
  (
    | {
        multiple: true
        getValue: (_: T) => string[]
      }
    | {
        multiple?: false
        getValue: (_: T) => string
      }
  )) => {
  const {m} = useConfig()
  const chart = useMemo(() => {
    const chart = (() => {
      if (multiple) {
        const mapped = seq(data).map(getValue).compact()
        return ChartHelper.multiple({data: mapped})
      } else {
        const mapped = seq(data).map(getValue).compact()
        return ChartHelper.single({data: mapped})
      }
    })()
    return chart
      .setLabel(seq(translations).reduceObject<Record<string, ReactNode>>(_ => [_.value!, _.label!]))
      .sortBy.value()
      .get()
  }, [getValue, data, translations])
  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{paper: {sx: {minWidth: 400, maxWidth: 500}}}}
    >
      <PanelHead>
        <Txt truncate>{title}</Txt>
      </PanelHead>
      <PanelBody sx={{maxHeight: '50vh', overflowY: 'auto'}}>
        <ChartBar data={chart} />
      </PanelBody>
      <PanelFoot alignEnd>
        <Btn color="primary" onClick={onClose as any}>
          {m.close}
        </Btn>
      </PanelFoot>
    </Popover>
  )
}

const DatesPopover = <T,>({
  getValue,
  data,
  anchorEl,
  onClose,
  title,
}: {
  getValue: (_: T) => Date | undefined
  data: T[]
  title: string
} & Pick<PopoverProps, 'anchorEl' | 'onClose'>) => {
  const {m} = useConfig()
  // const chart = useMemo(() => {
  //   const res: Record<string, Record<K, number>> = {}
  //   data.forEach(d => {
  //     if (!d[question]) return
  //     const date = d[q] as Date
  //     const yyyyMM = format(date, 'yyyy-MM')
  //     if (!res[yyyyMM]) res[yyyyMM] = 0
  //     res[yyyyMM] += 1
  //   })
  //   return res
  // }, [question, data])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>{title}</PanelHead>
      <PanelBody sx={{maxHeight: '50vh', overflowY: 'auto'}}>
        <ChartLineByDateFiltered data={data} curves={{[title]: {getDate: getValue}}} sx={{minWidth: 360}} />
      </PanelBody>
      <PanelFoot alignEnd>
        <Btn color="primary" onClick={onClose as any}>
          {m.close}
        </Btn>
      </PanelFoot>
    </Popover>
  )
}
