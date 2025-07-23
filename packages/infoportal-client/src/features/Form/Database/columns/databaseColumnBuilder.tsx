import {formatDate, formatDateTime, Messages} from '@/core/i18n/localization/en'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import React from 'react'
import {Kobo} from 'kobo-sdk'
import {map} from '@axanc/ts-utils'
import {IpBtn, TableEditCellBtn, Txt} from '@/shared'
import {KoboFlattenRepeatedGroup, KoboSchemaHelper, removeHtml, UUID} from 'infoportal-common'
import {KoboExternalFilesIndex} from '@/features/Form/Database/DatabaseContext'
import {getKoboAttachmentUrl, KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {Ip} from 'infoportal-api-sdk'
import {alpha, Theme} from '@mui/material'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {useKoboDialogs} from '@/core/store/useLangIndex'
import {TableIcon, TableIconBtn} from '@/shared/TableIcon'
import {SelectStatusBy} from '@/shared/customInput/SelectStatus'
import {useI18n} from '@/core/i18n'
import {DatatableHeadTypeIconByKoboType} from '@/features/Form/Database/columns/DatatableHeadTypeIconByFormType'

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

export const colorRepeatedQuestionHeader = (t: Theme) => alpha(t.palette.info.light, 0.22)

const ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['begin_group'])

const editableColsType: Set<Kobo.Form.QuestionType> = new Set([
  'select_one',
  'calculate',
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
  formId: Ip.FormId
  q: Question
  onEdit?: (name: string) => void
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

type CommonProps = Pick<BuildFormColumnProps, 'getRow' | 'q' | 'onEdit' | 'translateQuestion'>

function getValue({q, row, getRow = _ => _ as Row}: Pick<BuildFormColumnProps, 'q' | 'getRow'> & {row: Row}): any {
  return getRow(row)[q.name]
}

function getCommon({
  q,
  translateQuestion,
  onEdit,
}: CommonProps): Pick<
  DatatableColumn.Props<any>,
  'id' | 'groupLabel' | 'group' | 'typeIcon' | 'typeLabel' | 'head' | 'subHeader'
> {
  return {
    id: q.name,
    typeLabel: q.type,
    ...map(q.$xpath.split('/')[0], value => ({groupLabel: translateQuestion(value), group: value})),
    ...(onEdit
      ? {
          subHeader: <TableEditCellBtn onClick={() => onEdit(q.name)} />,
        }
      : {
          typeIcon: <DatatableHeadTypeIconByKoboType children={q.type} />,
        }),
    head: removeHtml(translateQuestion(q.name)?.replace(/^#*/, '')),
  }
}

function byQuestions({
  questions,
  ...props
}: {questions: Kobo.Form.Question[]} & Pick<
  BuildFormColumnProps,
  // | 'translateQuestion'
  // | 'q'
  // | 'choicesIndex'
  // | 'translateChoice'
  'onEdit' | 'getRow' | 'schema' | 'formId' | 't' | 'm' | 'externalFilesIndex' | 'onRepeatGroupClick'
>): DatatableColumn.Props<Row>[] {
  const getBy = (q: Question): DatatableColumn.Props<Row> | undefined => {
    const args = (isReadonly?: boolean) => ({
      q,
      translateQuestion: props.schema.translate.question,
      translateChoice: props.schema.translate.choice,
      choicesIndex: props.schema.helper.choicesIndex,
      ...props,
      onEdit: isReadonly ? undefined : props.onEdit,
    })
    const map: Partial<Record<Kobo.Form.QuestionType, DatatableColumn.Props<Row>>> = {
      // username: text(args()),
      // deviceid: text(args()),
      // end: date(args()),
      // start: date(args()),
      calculate: text(args(true)),
      text: text(args(true)),
      decimal: integer(args(true)),
      integer: integer(args(true)),
      datetime: date(args(true)),
      today: date(args(true)),
      date: date(args(true)),
      select_one: selectOne(args(true)),
      select_multiple: selectMultiple(args(true)),
      image: image(args()),
      file: file(args()),
      select_one_from_file: selectOneFromFile(args()),
      note: note(args()),
      begin_repeat: repeatGroup(args()),
      geopoint: geopoint(args()),
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
    'onEdit' | 'getRow' | 'schema' | 'formId' | 't' | 'm' | 'externalFilesIndex' | 'onRepeatGroupClick'
  >,
): DatatableColumn.Props<Row>[] {
  return byQuestions({
    ...props,
    questions: props.schema.schemaFlatAndSanitized.filter(q => !ignoredColType.has(q.type)),
  })
}

function selectOneFromFile(
  props: CommonProps & Pick<BuildFormColumnProps, 'externalFilesIndex'>,
): DatatableColumn.Props<Row> {
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

function text(props: CommonProps): DatatableColumn.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    width: props.q.appearance === 'multiline' ? 240 : undefined,
    renderQuick: (row: Row) => getValue({row, getRow: props.getRow, q: props.q}) as string,
  }
}

function image(props: CommonProps & Pick<BuildFormColumnProps, 'formId'>): DatatableColumn.Props<Row> {
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

function file(props: CommonProps & Pick<BuildFormColumnProps, 'formId'>): DatatableColumn.Props<Row> {
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
        value: fileName ?? DatatableUtils.blank,
        label: (
          <Txt link>
            <a href={url} target="_blank">
              {fileName}
            </a>
          </Txt>
        ),
        // label: <Txt link><a href={koboImgHelper({fileName, attachments: row.attachments}).fullUrl} target="_blank">{fileName}</a></Txt>
      }
    },
  }
}

function integer(props: CommonProps): DatatableColumn.Props<Row> {
  return {
    ...getCommon(props),
    type: 'number',
    renderQuick: (row: Row) => getValue({row, getRow: props.getRow, q: props.q}) as number,
  }
}

function note(props: CommonProps): DatatableColumn.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => getValue({row, getRow: props.getRow, q: props.q}) as string,
  }
}

function date(props: CommonProps): DatatableColumn.Props<Row> {
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
): DatatableColumn.Props<Row> {
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
): DatatableColumn.Props<Row> {
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
  props: CommonProps & Pick<BuildFormColumnProps, 'getRow' | 'q' | 'onEdit'>,
): DatatableColumn.Props<Row> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => JSON.stringify(getValue({row, getRow: props.getRow, q: props.q})),
  }
}

function unknown(props: BuildFormColumnProps): DatatableColumn.Props<any> {
  return {
    ...getCommon(props),
    type: 'string',
    renderQuick: (row: Row) => JSON.stringify(getValue({row, getRow: props.getRow, q: props.q})),
  }
}

function repeatGroup(
  props: CommonProps & Pick<BuildFormColumnProps, 't' | 'onRepeatGroupClick'>,
): DatatableColumn.Props<Row> {
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
          <IpBtn
            children={value.length}
            style={{padding: '0 4px'}}
            onClick={event => {
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
  workspaceId: UUID
  queryUpdate: ReturnType<typeof useQueryAnswerUpdate>
  getRow?: (_: any) => Row
  dialogs: ReturnType<typeof useKoboDialogs>
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
  canEdit?: boolean
  m: Messages
}

function id({getRow = _ => _ as any}: Pick<MetaProps, 'getRow'> = {}): DatatableColumn.Props<Row> {
  return {
    type: 'id',
    id: 'id' as const,
    head: 'ID',
    typeIcon: <DatatableHeadIconByType type="id" />,
    className: 'td-id',
    style: (row: any) => {
      const data = getRow(row)
      if (data[KoboFlattenRepeatedGroup.INDEX_COL]! > 0) {
        return {
          opacity: '.5',
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

function actions({
  workspaceId,
  formId,
  dialogs,
  canEdit,
  m,
}: {
  workspaceId: UUID
  formId: Kobo.FormId
  dialogs: ReturnType<typeof useKoboDialogs>
  canEdit?: boolean
  m: Messages
}): DatatableColumn.Props<Row> {
  return {
    id: 'actions' as const,
    head: '',
    width: 0,
    noCsvExport: true,
    render: (_: any) => {
      return {
        value: null as any,
        label: (
          <>
            <TableIconBtn
              disabled={!canEdit}
              tooltip={m.editKobo}
              children="edit"
              onClick={() => dialogs.openEdit({answer: _, workspaceId, formId: formId})}
            />
            <TableIconBtn
              tooltip={m.view}
              children="visibility"
              onClick={() => dialogs.openView({answer: _, workspaceId, formId: formId})}
            />
            {/*<TableIconBtn*/}
            {/*  disabled={!canEdit}*/}
            {/*  tooltip={m.editKobo}*/}
            {/*  target="_blank"*/}
            {/*  href={asyncEdit(_.id)}*/}
            {/*  children="edit"*/}
            {/*/>*/}
          </>
        ),
      }
    },
  }
}

function start({m}: {m: Messages}): DatatableColumn.Props<Row> {
  return date({
    translateQuestion: () => m.start,
    q: {
      type: 'start',
      name: 'submissionTime',
      label: [m.start],
      $xpath: 'submissionTime',
    },
  })
}

function end({m}: {m: Messages}): DatatableColumn.Props<Row> {
  return date({
    translateQuestion: () => m.end,
    q: {
      type: 'end',
      name: 'submissionTime',
      label: [m.end],
      $xpath: 'submissionTime',
    },
  })
}

function submissionTime({m}: {m: Messages}): DatatableColumn.Props<Row> {
  return date({
    translateQuestion: () => m.submissionTime,
    q: {
      type: 'date',
      name: 'submissionTime',
      label: [m.submissionTime],
      $xpath: 'submissionTime',
    },
  })
}

function validation({
  workspaceId,
  formId,
  getRow = _ => _ as any,
  dialogs,
  selectedIds,
  canEdit,
  queryUpdate,
  m,
}: Pick<
  MetaProps,
  'canEdit' | 'queryUpdate' | 'getRow' | 'formId' | 'workspaceId' | 'm' | 'selectedIds' | 'dialogs'
>): DatatableColumn.Props<Row> {
  return {
    id: '_validation' as const,
    head: m.validation,
    subHeader: selectedIds.length > 0 && (
      <TableEditCellBtn
        onClick={() =>
          dialogs.openBulkEditValidation({
            formId,
            answerIds: selectedIds,
            workspaceId,
          })
        }
      />
    ),
    width: 0,
    type: 'select_one',
    render: (row: any) => {
      const value = getRow(row).validationStatus
      return {
        export: value ? (m as any)[value] : DatatableUtils.blank,
        value: value ?? DatatableUtils.blank,
        option: value ? (m as any)[value] : DatatableUtils.blank,
        label: (
          <SelectStatusBy
            enum="KoboValidation"
            compact
            disabled={!canEdit}
            value={value}
            onChange={e => {
              queryUpdate.updateValidation.mutate({
                workspaceId,
                formId: formId,
                answerIds: [getRow(row).id],
                status: e,
              })
            }}
          />
        ),
      }
    },
  }
}

function byMeta(props: MetaProps): DatatableColumn.Props<any>[] {
  return [actions(props), validation(props), id(props), submissionTime(props)] as const
}

function MissingOption({value}: {value?: string}) {
  const {m} = useI18n()
  return (
    <span title={value}>
      <TableIcon color="disabled" tooltip={m._koboDatabase.valueNoLongerInOption} sx={{mr: 1}} children="error" />
      {value}
    </span>
  )
}
