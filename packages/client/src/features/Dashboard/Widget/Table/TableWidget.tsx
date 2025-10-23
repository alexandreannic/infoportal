import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {Core, Datatable} from '@/shared'
import {questionTypeNumbers} from '@/features/Dashboard/Widget/Table/TableSettings'
import {Obj} from '@axanc/ts-utils'
import {useTheme} from '@mui/material'
import {KoboSchemaHelper} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'

type Data = {row: string; groups: Record<string, number>}

const rangeToString = (range: Ip.Dashboard.Widget.NumberRange) => `${range.min} – ${range.max}`

const mapToRange = (value: number, ranges?: Ip.Dashboard.Widget.NumberRange[]) => {
  const range = ranges?.find(r => value >= r.min && value <= r.max)
  return range ? rangeToString(range) : `${value}`
}

const makeMapper = ({
  question,
  ranges,
  schema,
}: {
  schema: KoboSchemaHelper.Bundle<any>
  question: Kobo.Form.Question
  ranges?: Ip.Dashboard.Widget.NumberRange[]
}): ((value: string | number) => string) => {
  const type = schema.helper.questionIndex[question.name]?.type
  return questionTypeNumbers.has(type)
    ? value => mapToRange(value as number, ranges)
    : value => schema.translate.langIndex + ' . ' + (schema.translate.choice(question.name, value as string) ?? '-')
}

const sortByRanges = <T extends string | {row: string}>({
  items,
  ranges,
  getKey,
}: {
  items: T[]
  ranges?: Ip.Dashboard.Widget.NumberRange[]
  getKey?: (item: T) => string
}): T[] => {
  if (!ranges?.length) return [...items].sort()

  const rangeOrder = new Map(ranges.map(r => [rangeToString(r), r.min]))
  return [...items].sort((a, b) => {
    const keyA = getKey ? getKey(a) : (a as string)
    const keyB = getKey ? getKey(b) : (b as string)
    const aVal = rangeOrder.get(keyA) ?? Number.POSITIVE_INFINITY
    const bVal = rangeOrder.get(keyB) ?? Number.POSITIVE_INFINITY
    return aVal - bVal
  })
}

export function TableWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const t = useTheme()
  const config = widget.config as Ip.Dashboard.Widget.Config['Table']
  const {flatSubmissions, langIndex, flatSubmissionByRepeatGroup, dashboard, schema} = useDashboardContext()

  const {column, row} = useMemo(() => {
    const colKey = config.column?.questionName
    const rowKey = config.row?.questionName
    return {
      column: colKey
        ? {
            ...schema.helper.questionIndex[colKey],
            group: schema.helper.group.getByQuestionName(colKey),
          }
        : undefined,
      row: rowKey
        ? {
            ...schema.helper.questionIndex[rowKey],
            group: schema.helper.group.getByQuestionName(rowKey),
          }
        : undefined,
    }
  }, [config.column?.questionName, config.row?.questionName])

  const relatedSubmissions = useMemo(() => {
    if (!column || !row) return []
    if (column.group && row.group && column.group.name !== row.group.name) {
      // TODO Prevent UI crash but trigger error to Sentry
      throw new Error(
        `Questions ${column.name} and ${row.name} of Form ${dashboard.sourceFormId} are in different begin_repeat section.`,
      )
    }
    const repeatGroup = column.group ?? row.group
    return repeatGroup ? flatSubmissionByRepeatGroup(repeatGroup.name) : flatSubmissions
  }, [flatSubmissions, column, row])

  const {data, columns} = useMemo(() => {
    if (!column || !row) return {data: [], columns: []}

    const grouped: Record<string, Record<string, number>> = {}
    const columnSet = new Set<string>()

    const mapCol = makeMapper({question: column, schema, ranges: config.column?.rangesIfTypeNumber})
    const mapRow = makeMapper({question: row, schema, ranges: config.row?.rangesIfTypeNumber})

    for (const item of relatedSubmissions) {
      const colValue = mapCol(item[column.name])
      const rowValue = mapRow(item[row.name])
      columnSet.add(colValue)
      grouped[rowValue] ??= {}
      grouped[rowValue][colValue] = (grouped[rowValue][colValue] ?? 0) + 1
    }

    const columnsSorted = sortByRanges({items: Array.from(columnSet), ranges: config.column?.rangesIfTypeNumber})

    const dataSorted = sortByRanges({
      items: Obj.entries(grouped).map(([row, groups]) => ({row, groups})),
      ranges: config.row?.rangesIfTypeNumber,
      getKey: _ => _.row,
    })

    return {
      data: dataSorted,
      columns: columnsSorted,
    }
  }, [relatedSubmissions, schema, config])

  if (!config.column?.questionName || !config.row?.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Datatable.Component
      id={'widget-' + widget.id}
      data={data}
      header={<WidgetTitle>{widget.i18n_title?.[langIndex]}</WidgetTitle>}
      getRowKey={_ => '' + _.row}
      rowHeight={32}
      module={{
        columnsToggle: {enabled: false},
        columnsResize: {enabled: false},
        export: {enabled: false},
        cellSelection: {enabled: false},
      }}
      columns={[
        {
          id: 'row',
          head: schema.translate.question(config.row.questionName),
          type: 'select_one',
          renderQuick: _ => _.row,
          // group: {
          //   color: t.palette.divider,
          //   id: config.row.questionName,
          //   label: schema.translate.question(config.row.questionName),
          // },
        },
        ...(columns ?? []).map(_ => {
          return {
            // group: {
            //   color: t.palette.divider,
            //   id: config.column.questionName,
            //   label: schema.translate.question(config.column.questionName),
            // },
            type: 'number',
            id: _,
            head: _,
            renderQuick: (row: Data) => row.groups[_] as number,
          } as const
        }),
      ]}
    />
  )
}
