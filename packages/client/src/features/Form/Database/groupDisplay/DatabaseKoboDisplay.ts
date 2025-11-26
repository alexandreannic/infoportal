import {SchemaInspector} from '@infoportal/form-helper'
import {mapFor} from '@axanc/ts-utils'
import {Messages} from '@infoportal/client-i18n'
import {Theme} from '@mui/material'
import {Api} from '@infoportal/api-sdk'
import {Datatable} from '@/shared'
import {buildDbColumns, colorRepeatedQuestionHeader, OnRepeatGroupClick} from '@infoportal/database-column'
import {getKoboAttachmentUrl} from '@/core/KoboAttachmentUrl.js'

export type DatabaseDisplay = {
  repeatAs?: 'rows' | 'columns'
  repeatGroupName?: string
}

type DatabaseKoboDisplayProps = {
  data: Api.Submission[]
  display: DatabaseDisplay
  inspector: SchemaInspector
  formId: Api.FormId
  onRepeatGroupClick?: OnRepeatGroupClick
  m: Messages
  t: Theme
  getFileUrl: typeof getKoboAttachmentUrl
}

export const databaseKoboDisplayBuilder = ({
  data,
  display,
  inspector,
  formId,
  onRepeatGroupClick,
  getFileUrl,
  m,
  t,
}: DatabaseKoboDisplayProps) => {
  const transformColumns = (columns: Datatable.Column.Props<any>[]): Datatable.Column.Props<any>[] => {
    switch (display.repeatAs) {
      case 'columns': {
        const copy = [...columns]
        inspector.lookup.group.search({depth: 1}).map(group => {
          const index = copy.findIndex(_ => _.id == group.name)
          const groupSize = Math.max(0, ...data.map(_ => _.answers[group.name]?.length ?? 0))
          mapFor(groupSize, repeat => {
            const newCols = buildDbColumns.question
              .byQuestions({
                getFileUrl,
                questions: group.questions,
                inspector: inspector,
                onRepeatGroupClick,
                getRow: (_: Api.Submission) => _.answers[group.name]?.[repeat] ?? {},
                formId,
                m,
                t,
              })
              .map((_, i) => {
                _.head = `[${repeat}] ${_.head}`
                _.group = {
                  id: group.name + repeat,
                  label: `[${repeat}] ` + inspector.translate.question(group.name),
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
        const group = inspector.lookup.group.getByName(display.repeatGroupName)
        if (!group || group.depth > 1) return columns
        const repeatGroupColumns = buildDbColumns.question
          .byQuestions({
            getFileUrl,
            questions: group.questions,
            inspector: inspector,
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
