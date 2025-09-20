import {KoboSchemaHelper} from 'infoportal-common'
import {mapFor} from '@axanc/ts-utils'
import {Messages} from '@infoportal/client-i18n'
import {Theme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {Datatable} from '@/shared'
import {OnRepeatGroupClick} from '@infoportal/database-column/lib/columns/type.js'
import {buildDbColumns, colorRepeatedQuestionHeader} from '@infoportal/database-column'
import {getKoboAttachmentUrl} from '@/core/KoboAttachmentUrl.js'

export type DatabaseDisplay = {
  repeatAs?: 'rows' | 'columns'
  repeatGroupName?: string
}

type DatabaseKoboDisplayProps = {
  data: Ip.Submission[]
  display: DatabaseDisplay
  schema: KoboSchemaHelper.Bundle
  formId: Ip.FormId
  workspaceId: Ip.WorkspaceId
  onRepeatGroupClick?: OnRepeatGroupClick
  m: Messages
  t: Theme
  getFileUrl: typeof getKoboAttachmentUrl
  queryUpdateAnswer: Parameters<typeof buildDbColumns.question.byQuestions>[0]['queryUpdateAnswer']
}

export const databaseKoboDisplayBuilder = ({
  data,
  display,
  schema,
  formId,
  workspaceId,
  onRepeatGroupClick,
  queryUpdateAnswer,
  getFileUrl,
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
            const newCols = buildDbColumns.question
              .byQuestions({
                queryUpdateAnswer,
                getFileUrl,
                workspaceId,
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
        const repeatGroupColumns = buildDbColumns.question
          .byQuestions({
            queryUpdateAnswer,
            getFileUrl,
            workspaceId,
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
