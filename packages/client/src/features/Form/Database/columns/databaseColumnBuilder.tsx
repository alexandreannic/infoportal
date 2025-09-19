import {Messages} from '@infoportal/client-i18n'
import React from 'react'
import {Kobo} from 'kobo-sdk'
import {map} from '@axanc/ts-utils'
import {Core, Datatable} from '@/shared'
import {KoboFlattenRepeatedGroup, KoboSchemaHelper, removeHtml} from 'infoportal-common'
import {DatabaseContext, KoboExternalFilesIndex} from '@/features/Form/Database/DatabaseContext'
import {getKoboAttachmentUrl, KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Ip} from 'infoportal-api-sdk'
import {Box, Icon, Theme, useTheme} from '@mui/material'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {useKoboDialogs} from '@/core/store/useLangIndex'
import {SelectStatusConfig, StateStatusIcon} from '@/shared/customInput/SelectStatus'
import {useI18n} from '@infoportal/client-i18n'
import {DatatableHeadTypeIconByKoboType} from '@/features/Form/Database/columns/DatatableHeadTypeIconByKoboType'
import {KoboBulkUpdate} from '@/shared/koboEdit/KoboBulkUpdate'
import {isDateValid} from '@infoportal/client-i18n/lib/localization/en.js'

export const formatDate = (d?: Date): string => {
  if (!isDateValid(d)) return '-'
  return d!.toLocaleDateString()
}

export const formatTime = (d?: Date): string => {
  if (!isDateValid(d)) return '-'
  return d!.toLocaleTimeString()
}

export const formatDateTime = (d?: Date): string => {
  if (!isDateValid(d)) return '-'
  return formatDate(d) + ' ' + formatTime(d)
}

export const buildDatabaseColumns = {
  type: {
    selectOneFromFile: selectOneFromFile,
    text: text,
    integer: integer,
    note: note,
    date: date,
    selectOne: selectOne,
    selectMultiple: selectMultiple,
    geopoint: geopoint,
    unknown: unknown,
    bySchema,
    byQuestions,
  },
  meta: {
    id: id,
    submissionTime: submissionTime,
    start: start,
    end: end,
    all: byMeta,
  },
}

export const colorRepeatedQuestionHeader = (t: Theme) => Core.alphaVar(t.vars.palette.info.light, 0.22)

const ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['begin_group'])

const editableColsType: Set<Kobo.Form.QuestionType> = new Set([
  'select_one',
  'calculate',
  'note',
  'select_multiple',
  'text',
  'integer',
  'decimal',
  'date',
  'datetime',
])

type Row = KoboFlattenRepeatedGroup.Data

type Data = Record<string, any>
type Question = Pick<
  Kobo.Form.Question,
  'select_from_list_name' | 'file' | '$xpath' | 'appearance' | 'type' | 'label' | 'name'
>

export type BuildFormColumnProps = {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  q: Question
  isReadonly?: boolean
  getRow?: (_: any) => Data
  schema: KoboSchemaHelper.Bundle
  choicesIndex: KoboSchemaHelper.Helper['choicesIndex']
  translateQuestion: KoboSchemaHelper.Translation['question']
  translateChoice: KoboSchemaHelper.Translation['choice']
  externalFilesIndex?: KoboExternalFilesIndex
  onRepeatGroupClick?: (_: {name: string; row: Row; event: any}) => void
  t: Theme
  m: Messages
}

type CommonProps = Pick<
  BuildFormColumnProps,
  'isReadonly' | 'formId' | 'workspaceId' | 'getRow' | 'q' | 'translateQuestion' | 'm'
>

const metaLabel = 'Meta'

function getValue({q, row, getRow = _ => _ as Row}: Pick<BuildFormColumnProps, 'q' | 'getRow'> & {row: Row}): any {
  return getRow(row)[q.name]
}

function getCommon({
  q,
  m,
  workspaceId,
  formId,
  isReadonly,
  translateQuestion,
}: CommonProps): Pick<
  Datatable.Column.Props<any>,
  'actionOnSelected' | 'id' | 'width' | 'group' | 'typeIcon' | 'typeLabel' | 'head' | 'subHeader'
> {
  return {
    id: q.name,
    width: 120,
    typeLabel: q.type,
    actionOnSelected: isReadonly
      ? () => <ReadonlyAction />
      : ({rowIds}: {rowIds: string[]}) => (
          <KoboBulkUpdate.Answer
            question={q.name}
            answerIds={rowIds as Ip.SubmissionId[]}
            workspaceId={workspaceId}
            formId={formId}
          />
        ),
    ...map(q.$xpath.split('/')[0], value => ({
      group: {label: value === 'meta' ? metaLabel : translateQuestion(value), id: value},
    })),
    typeIcon: <DatatableHeadTypeIconByKoboType children={q.type} />,
    head: removeHtml(translateQuestion(q.name)?.replace(/^#*/, '')),
  }
}

function byQuestions({
  questions,
  formId,
  workspaceId,
  ...props
}: {questions: Kobo.Form.Question[]} & Pick<
  BuildFormColumnProps,
  | 'isReadonly'
  | 'workspaceId'
  | 'getRow'
  | 'schema'
  | 'formId'
  | 't'
  | 'm'
  | 'externalFilesIndex'
  | 'onRepeatGroupClick'
>): Datatable.Column.Props<Row>[] {
  const getBy = (q: Question): Datatable.Column.Props<Row> | undefined => {
    const args = (isReadonly?: boolean) => ({
      q,
      formId,
      workspaceId,
      isReadonly: props.isReadonly ?? isReadonly,
      translateQuestion: props.schema.translate.question,
      translateChoice: props.schema.translate.choice,
      choicesIndex: props.schema.helper.choicesIndex,
      ...props,
    })
    const map: Partial<Record<Kobo.Form.QuestionType, Datatable.Column.Props<Row>>> = {
      // username: text(args()),
      // deviceid: text(args()),
      // end: date(args()),
      // start: date(args()),
      calculate: text(args()),
      text: text(args()),
      decimal: integer(args()),
      integer: integer(args()),
      datetime: date(args()),
      today: date(args()),
      date: date(args()),
      select_one: selectOne(args()),
      select_multiple: selectMultiple(args()),
      image: image(args(true)),
      file: file(args(true)),
      select_one_from_file: selectOneFromFile(args(true)),
      note: note(args(true)),
      begin_repeat: repeatGroup(args(true)),
      geopoint: geopoint(args(true)),
    }
    return map[q.type]
  }
  return questions
    .filter(q => !(q.type === 'note' && !q.calculation))
    .map(getBy)
    .filter(_ => !!_)
}

function bySchema(
  props: Pick<
    BuildFormColumnProps,
    // | 'translateQuestion'
    // | 'q'
    // | 'choicesIndex'
    // | 'translateChoice'
    | 'isReadonly'
    | 'getRow'
    | 'schema'
    | 'formId'
    | 'workspaceId'
    | 't'
    | 'm'
    | 'externalFilesIndex'
    | 'onRepeatGroupClick'
  >,
): Datatable.Column.Props<Row>[] {
  return byQuestions({
    ...props,
    questions: props.schema.schemaFlatAndSanitized.filter(q => !ignoredColType.has(q.type)),
  })
}

function selectOneFromFile(
  props: CommonProps & Pick<BuildFormColumnProps, 'externalFilesIndex'>,
): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => {
      return (
        props.externalFilesIndex?.[props.q.file!]?.[row[props.q.name] as string]?.label ??
        getValue({row, getRow: props.getRow, q: props.q})
      )
    },
  }
}

function text(props: CommonProps): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    width: props.q.appearance === 'multiline' ? 240 : 120,
    renderQuick: (row: Row) => getValue({row, getRow: props.getRow, q: props.q}) as string,
  }
}

function image(props: CommonProps & Pick<BuildFormColumnProps, 'formId'>): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    render: (row: Row) => {
      const value = getValue({row, ...props}) as string
      return {
        value,
        tooltip: value,
        export: getKoboAttachmentUrl({
          formId: props.formId,
          answerId: row.id,
          attachments: row.attachments,
          fileName: value,
        }),
        label: (
          <KoboAttachedImg answerId={row.id} formId={props.formId} attachments={row.attachments} fileName={value} />
        ),
      }
    },
  }
}

function file(props: CommonProps & Pick<BuildFormColumnProps, 'formId'>): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    render: (row: Row) => {
      const fileName = getValue({row, ...props}) as string
      const url = getKoboAttachmentUrl({
        formId: props.formId,
        answerId: row.id,
        fileName,
        attachments: row.attachments,
      })
      return {
        export: url,
        value: fileName ?? Datatable.Utils.blank,
        label: (
          <Core.Txt link>
            <a href={url} target="_blank">
              {fileName}
            </a>
          </Core.Txt>
        ),
        // label: <Core.Txt link><a href={koboImgHelper({fileName, attachments: row.attachments}).fullUrl} target="_blank">{fileName}</a></Core.Txt>
      }
    },
  }
}

function integer(props: CommonProps): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'number',
    renderQuick: (row: Row) => getValue({row, getRow: props.getRow, q: props.q}) as number,
  }
}

function note(props: CommonProps): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => getValue({row, getRow: props.getRow, q: props.q}) as string,
  }
}

function date(props: CommonProps): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'date',
    render: (row: Row) => {
      const _ = getValue({row, getRow: props.getRow, q: props.q}) as Date | undefined
      const time = formatDateTime(_)
      return {
        label: formatDate(_),
        value: _,
        tooltip: time,
        export: time,
      }
    },
  }
}

function selectOne(
  props: CommonProps & Pick<BuildFormColumnProps, 'translateChoice' | 'm'>,
): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'select_one',
    render: (row: Row) => {
      const v = getValue({row, getRow: props.getRow, q: props.q}) as string | undefined
      const render = props.translateChoice(props.q.name, v)
      return {
        export: render,
        value: v,
        tooltip: render ?? props.m._koboDatabase.valueNoLongerInOption,
        label: render ?? <MissingOption value={v} />,
      }
    },
  }
}

let lastError: string | undefined

function selectMultiple(
  props: CommonProps & Pick<BuildFormColumnProps, 'choicesIndex' | 'translateChoice'>,
): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'select_multiple',
    options: () =>
      props.choicesIndex[props.q.select_from_list_name!].map(_ => ({
        value: _.name,
        label: props.translateChoice(props.q.name, _.name),
      })),
    render: (row: Row) => {
      const v = getValue({row, getRow: props.getRow, q: props.q}) as string[] | undefined
      try {
        const label = v?.map(_ => props.translateChoice(props.q.name, _)).join(' | ')
        return {
          label,
          export: label,
          tooltip: label,
          value: v,
        }
      } catch (e: any) {
        if (props.q.$xpath !== lastError) {
          lastError = props.q.$xpath
          console.warn('Cannot translate', props.q.$xpath)
        }
        const fixedV = JSON.stringify(v)
        return {
          label: fixedV,
          value: [fixedV],
        }
      }
    },
  }
}

function geopoint(
  props: CommonProps & Pick<BuildFormColumnProps, 'getRow' | 'q' | 'isReadonly'>,
): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => JSON.stringify(getValue({row, getRow: props.getRow, q: props.q})),
  }
}

function unknown(props: BuildFormColumnProps): Datatable.Column.Props<any> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => JSON.stringify(getValue({row, getRow: props.getRow, q: props.q})),
  }
}

function repeatGroup(
  props: CommonProps & Pick<BuildFormColumnProps, 't' | 'onRepeatGroupClick'>,
): Datatable.Column.Props<Row> {
  return {
    ...getCommon(props),
    type: 'number',
    styleHead: {
      background: colorRepeatedQuestionHeader(props.t),
    },
    render: (row: Row) => {
      const value = getValue({...props, row}) as any[]
      return {
        export: value?.length,
        value: value?.length,
        label: value && (
          <Core.Btn
            children={value.length}
            style={{padding: '0 4px'}}
            onClick={event => {
              event.stopPropagation()
              props.onRepeatGroupClick?.({
                name: props.q.name,
                row,
                event,
              })
            }}
          />
        ),
      }
    },
  }
}

type MetaProps = {
  formType: Ip.Form.Type
  workspaceId: Ip.WorkspaceId
  queryUpdate: ReturnType<typeof useQueryAnswerUpdate>
  getRow?: (_: any) => Row
  dialogs: ReturnType<typeof useKoboDialogs>
  formId: Ip.FormId
  koboEditEnketoUrl?: DatabaseContext['koboEditEnketoUrl']
  isReadonly?: boolean
  m: Messages
}

function id({getRow = _ => _ as any}: Pick<MetaProps, 'getRow'> = {}): Datatable.Column.Props<Row> {
  return {
    group: {label: metaLabel, id: 'meta'},
    type: 'id',
    id: 'meta/id' as const,
    actionOnSelected: () => <ReadonlyAction />,
    head: 'ID',
    width: 110,
    typeIcon: <Datatable.HeadIconByType type="id" />,
    className: 'td-id',
    style: (row: any) => {
      const data = getRow(row)
      if (data[KoboFlattenRepeatedGroup.INDEX_COL]! > 0) {
        return {
          opacity: '.6',
        }
      }
      return {}
    },
    renderQuick: (row: any) => {
      const data = getRow(row)
      const childIndex = data[KoboFlattenRepeatedGroup.INDEX_COL]
      return (data.id ?? '') + (childIndex !== undefined ? '#' + (childIndex + 1) : '')
    },
  } as const
}

function version({m}: {m: Messages}): Datatable.Column.Props<Ip.Submission> {
  return {
    group: {label: metaLabel, id: 'meta'},
    id: 'meta/version' as const,
    head: m.version,
    width: 70,
    noCsvExport: true,
    renderQuick: (_: Ip.Submission) => _.version,
  }
}

function actions({
  dialogs,
  isReadonly,
  koboEditEnketoUrl,
  formType,
  m,
}: Pick<
  MetaProps,
  'formType' | 'workspaceId' | 'formId' | 'dialogs' | 'isReadonly' | 'koboEditEnketoUrl' | 'm'
>): Datatable.Column.Props<Ip.Submission> {
  return {
    group: {label: metaLabel, id: 'meta'},
    id: 'meta/actions' as const,
    head: '',
    width: 70,
    noCsvExport: true,
    render: (_: Ip.Submission) => {
      return {
        value: null as any,
        label: (
          <>
            <Datatable.IconBtn tooltip={m.view} children="visibility" onClick={() => dialogs.openView({answer: _})} />
            {formType === 'smart' ? undefined : koboEditEnketoUrl && _.originId ? (
              <Datatable.IconBtn
                disabled={isReadonly}
                tooltip={m.editKobo}
                target="_blank"
                href={koboEditEnketoUrl(_.originId)}
                children="edit_square"
              />
            ) : (
              <Datatable.IconBtn
                disabled={isReadonly}
                tooltip={m.editForm}
                children="edit"
                onClick={() => dialogs.openEdit({answer: _})}
              />
            )}
          </>
        ),
      }
    },
  }
}

function start({
  m,
  workspaceId,
  formId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  m: Messages
}): Datatable.Column.Props<Row> {
  return date({
    m,
    workspaceId,
    formId,
    translateQuestion: () => m.start,
    q: {
      type: 'start',
      name: 'submissionTime',
      label: [m.start],
      $xpath: 'meta/submissionTime',
    },
  })
}

function end({
  m,
  workspaceId,
  formId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  m: Messages
}): Datatable.Column.Props<Row> {
  return date({
    m,
    workspaceId,
    formId,
    translateQuestion: () => m.end,
    q: {
      type: 'end',
      name: 'end',
      label: [m.end],
      $xpath: 'meta/submissionTime',
    },
  })
}

function submissionTime({
  m,
  workspaceId,
  formId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  m: Messages
}): Datatable.Column.Props<Row> {
  return date({
    m,
    isReadonly: true,
    workspaceId,
    formId,
    translateQuestion: () => m.submissionTime,
    q: {
      type: 'date',
      name: 'submissionTime',
      label: [m.submissionTime],
      $xpath: 'meta/submissionTime',
    },
  })
}

function validation({
  workspaceId,
  formId,
  getRow = _ => _ as any,
  isReadonly,
  queryUpdate,
  m,
}: Pick<
  MetaProps,
  'isReadonly' | 'queryUpdate' | 'getRow' | 'formId' | 'workspaceId' | 'm'
>): Datatable.Column.Props<Row> {
  return {
    group: {label: metaLabel, id: 'meta'},
    id: 'meta/_validation' as const,
    head: m.validation,
    align: 'center',
    width: 60,
    type: 'select_one',
    actionOnSelected: isReadonly
      ? undefined
      : ({rowIds}: {rowIds: string[]}) => (
          <KoboBulkUpdate.Validation
            formId={formId}
            workspaceId={workspaceId}
            answerIds={rowIds as Ip.SubmissionId[]}
          />
        ),
    render: (row: any) => {
      const value: Ip.Submission.Validation = getRow(row).validationStatus
      const toGenericStatus = SelectStatusConfig.customStatusToStateStatus.KoboValidation[value]
      return {
        export: value ? (m as any)[value] : Datatable.Utils.blank,
        value: value ?? Datatable.Utils.blank,
        option: value ? (m as any)[value] : Datatable.Utils.blank,
        label: <StateStatusIcon type={toGenericStatus} />,
      }
    },
  }
}

function byMeta(props: MetaProps): Datatable.Column.Props<any>[] {
  return [
    actions(props),
    props.formType === 'smart' ? undefined : validation(props),
    id(props),
    props.formType === 'smart' ? undefined : version(props),
    submissionTime(props),
  ].filter(_ => !!_)
}

function MissingOption({value}: {value?: string}) {
  const {m} = useI18n()
  return (
    <span title={value}>
      <Datatable.Icon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} children="error" />
      {value}
    </span>
  )
}

function ReadonlyAction() {
  const {m} = useI18n()
  const t = useTheme()
  return (
    <Box display="flex" alignItems="center" sx={{color: t.vars.palette.text.disabled}}>
      <Icon sx={{mr: 1}}>lock</Icon>
      {m.readonly}
    </Box>
  )
}
