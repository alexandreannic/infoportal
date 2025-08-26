import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {KoboSchemaHelper} from 'infoportal-common'
import {mapFor} from '@axanc/ts-utils'
import {Messages} from '@/core/i18n/localization/en'
import {Theme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {
  buildDatabaseColumns,
  BuildFormColumnProps,
  colorRepeatedQuestionHeader,
} from '@/features/Form/Database/columns/databaseColumnBuilder'
import {Datatable} from '@/shared/Datatable3/state/types.js'

export type DatabaseDisplay = {
  repeatAs?: 'rows' | 'columns'
  repeatGroupName?: string
}

type DatabaseKoboDisplayProps = {
  data: Ip.Submission[]
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
  const transformColumns = (columns: Datatable.Column.Props<any>[]): Datatable.Column.Props<any>[] => {
    switch (display.repeatAs) {
      case 'columns': {
        const copy = [...columns]
        schema.helper.group.search({depth: 1}).map(group => {
          const index = copy.findIndex(_ => _.id == group.name)
          const groupSize = Math.max(0, ...data.map(_ => _.answers[group.name]?.length ?? 0))
          mapFor(groupSize, repeat => {
            const newCols = buildDatabaseColumns.type
              .byQuestions({
                questions: group.questions,
                schema,
                onRepeatGroupClick,
                getRow: (_: Ip.Submission) => _.answers[group.name]?.[repeat] ?? {},
                formId,
                m,
                t,
              })
              .map((_, i) => {
                _.head = `[${repeat}] ${_.head}`
                _.group = {
                  id: group.name + repeat,
                  label: `[${repeat}] ` + schema.translate.question(group.name),
                }
                _.id = _.id + 'repeat' + repeat + '+' + i
                _.styleHead = {
                  background: colorRepeatedQuestionHeader(t),
                }
                if (i === 0) {
                  _.styleHead.borderLeft = '3px solid ' + t.vars.palette.divider
                  _.style = () => ({borderLeft: '3px solid ' + t.vars.palette.divider})
                }
                return {..._}
              })
            copy.splice(index + repeat * newCols.length, 1, ...newCols)
          })
        })
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
