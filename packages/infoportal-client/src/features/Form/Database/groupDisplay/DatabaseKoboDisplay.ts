import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {KoboSchemaHelper} from 'infoportal-common'
import {mapFor} from '@axanc/ts-utils'
import {Messages} from '@/core/i18n/localization/en'
import {Theme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {
  BuildFormColumnProps,
  buildDatabaseColumns,
  colorRepeatedQuestionHeader,
} from '@/features/Form/Database/columns/databaseColumnBuilder'

export type DatabaseDisplay = {
  repeatAs?: 'rows' | 'columns'
  repeatGroupName?: string
}

type DatabaseKoboDisplayProps = {
  data: Record<string, any>[]
  display: DatabaseDisplay
  schema: KoboSchemaHelper.Bundle
  formId: Ip.FormId
  onRepeatGroupClick?: BuildFormColumnProps['onRepeatGroupClick']
  m: Messages
  t: Theme
}

export const databaseKoboDisplayBuilder = ({
  data,
  display,
  schema,
  formId,
  onRepeatGroupClick,
  m,
  t,
}: DatabaseKoboDisplayProps) => {
  const transformColumns = (columns: DatatableColumn.Props<any>[]): DatatableColumn.Props<any>[] => {
    switch (display.repeatAs) {
      case 'columns': {
        const copy = [...columns]
        schema.helper.group
          .search({depth: 1})
          .map(group => {
            const index = copy.findIndex(_ => _.id == group.name)
            const groupSize = Math.max(...data.map(_ => _[group.name]?.length ?? 0))
            mapFor(groupSize, repeat => {
              const newCols = buildDatabaseColumns.type
                .byQuestions({
                  questions: group.questions,
                  schema,
                  onRepeatGroupClick,
                  getRow: _ => _[group.name]?.[repeat] ?? {},
                  formId,
                  m,
                  t,
                })
                .map((_, i) => {
                  _.head = `[${repeat}] ${_.head}`
                  _.group = group.name + repeat
                  _.groupLabel = `[${repeat}] ` + schema.translate.question(group.name)
                  _.id = _.id + 'repeat' + repeat + '+' + i
                  _.styleHead = {
                    background: colorRepeatedQuestionHeader(t),
                  }
                  if (i === 0) {
                    _.styleHead.borderLeft = '3px solid ' + t.palette.divider
                    _.style = () => ({borderLeft: '3px solid ' + t.palette.divider})
                  }
                  return {..._}
                })
              copy.splice(index + repeat * group.questions.length, 1, ...newCols)
            })
          })
          .flat()
        return copy
      }
      case 'rows': {
        if (!display.repeatGroupName) return columns
        const group = schema.helper.group.getByName(display.repeatGroupName)
        if (!group || group.depth > 1) return columns
        const repeatGroupColumns = buildDatabaseColumns.type
          .byQuestions({
            questions: group.questions,
            schema,
            onRepeatGroupClick,
            formId,
            m,
            t,
          })
          .map(_ => {
            _.styleHead = {
              background: colorRepeatedQuestionHeader(t),
            }
            return _
          })
        const index = columns.findIndex(_ => _.id == group.name)
        return [...columns.slice(0, index), ...repeatGroupColumns, ...columns.slice(index + 1)]
      }
      default: {
        return columns
      }
    }
  }

  return {
    transformColumns,
  }
}
