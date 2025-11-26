import React from 'react'
import {MissingOption} from '../ui/MissingOption.js'
import {ColumnQuestionBaseProps, ColumnQuestionProps, Question, Row} from './type.js'
import * as Datatable from '@infoportal/client-datatable'
import {colorRepeatedQuestionHeader, defaultColWidth, ignoredColType} from './common.js'
import {Btn, Txt} from '@infoportal/client-core'
import {map} from '@axanc/ts-utils'
import {KoboTypeIcon} from '../ui/KoboTypeIcon.js'
import {removeHtml} from '@infoportal/common'
import {Api} from '@infoportal/api-sdk'

export class QuestionType {
  private static getValue({
    q,
    row,
    getRow = _ => _ as Row,
  }: Pick<ColumnQuestionProps, 'q' | 'getRow'> & {row: Row}): any {
    return getRow(row)[q.name]
  }

  private static getBase({
    q,
    translateQuestion,
  }: ColumnQuestionBaseProps): Pick<
    Datatable.Column.Props<any>,
    'id' | 'width' | 'group' | 'typeIcon' | 'typeLabel' | 'head' | 'subHeader'
  > {
    return {
      id: q.name,
      width: defaultColWidth,
      typeLabel: q.type,
      ...map(q.$xpath.split('/')[0], value => ({
        group: {label: translateQuestion(value), id: value},
      })),
      typeIcon: <KoboTypeIcon children={q.type} />,
      head: removeHtml(translateQuestion(q.name)?.replace(/^#*/, '')),
    }
  }

  static byQuestions({
    questions,
    ...props
  }: {questions: Api.Form.Question[]} & Pick<
    ColumnQuestionProps,
    | 'isReadonly'
    | 'getRow'
    | 'inspector'
    | 'formId'
    | 'getFileUrl'
    | 't'
    | 'm'
    | 'externalFilesIndex'
    | 'onRepeatGroupClick'
  >): Datatable.Column.Props<Row>[] {
    const getBy = (q: Question): Datatable.Column.Props<Row> | undefined => {
      const args = (isReadonly?: boolean) => ({
        q,
        isReadonly: props.isReadonly ?? isReadonly,
        translateQuestion: props.inspector.translate.question,
        translateChoice: props.inspector.translate.choice,
        choicesIndex: props.inspector.lookup.choicesIndex,
        ...props,
      })
      const map: Partial<Record<Api.Form.QuestionType, Datatable.Column.Props<Row>>> = {
        // username: text(args()),
        // deviceid: text(args()),
        // end: date(args()),
        // start: date(args()),
        calculate: this.text(args()),
        text: this.text(args()),
        decimal: this.integer(args()),
        integer: this.integer(args()),
        datetime: this.date(args()),
        today: this.date(args()),
        date: this.date(args()),
        select_one: this.selectOne(args()),
        select_multiple: this.selectMultiple(args()),
        image: this.image(args(true)),
        file: this.file(args(true)),
        select_one_from_file: this.selectOneFromFile(args(true)),
        note: this.note(args(true)),
        begin_repeat: this.repeatGroup(args(true)),
        geopoint: this.geopoint(args(true)),
      }
      return map[q.type]
    }
    return questions
      .filter(q => !(q.type === 'note' && !q.calculation))
      .map(getBy)
      .filter(_ => !!_)
  }

  static bySchema(
    props: Pick<
      ColumnQuestionProps,
      // | 'translateQuestion'
      // | 'q'
      // | 'choicesIndex'
      // | 'translateChoice'
      | 'formId'
      | 'isReadonly'
      | 'getRow'
      | 'inspector'
      | 't'
      | 'm'
      | 'getFileUrl'
      | 'externalFilesIndex'
      | 'onRepeatGroupClick'
    >,
  ): Datatable.Column.Props<Row>[] {
    return this.byQuestions({
      ...props,
      questions: props.inspector.schemaFlatAndSanitized.filter(q => !ignoredColType.has(q.type)),
    })
  }

  static selectOneFromFile(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 'externalFilesIndex'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'string',
      renderQuick: (row: Row) => {
        return (
          props.externalFilesIndex?.[props.q.file!]?.[row[props.q.name] as string]?.label ??
          this.getValue({row, getRow: props.getRow, q: props.q})
        )
      },
    }
  }

  static text(props: ColumnQuestionBaseProps): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'string',
      width: props.q.appearance === 'multiline' ? defaultColWidth * 2 : defaultColWidth,
      renderQuick: (row: Row) => this.getValue({row, getRow: props.getRow, q: props.q}) as string,
    }
  }

  static image(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 'formId' | 'getFileUrl'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'string',
      render: (row: Row) => {
        const value = this.getValue({row, ...props}) as string
        const url = props.getFileUrl({
          formId: props.formId,
          submissionId: row.id,
          attachments: row.attachments,
          fileName: value,
        })
        return {
          value,
          tooltip: value,
          export: url,
          label: url ? <Datatable.Img url={url} /> : '',
          // <KoboAttachedImg answerId={row.id} formId={props.formId} attachments={row.attachments} fileName={value} />
        }
      },
    }
  }

  static file(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 'getFileUrl' | 'formId'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'string',
      render: (row: Row) => {
        const fileName = this.getValue({row, ...props}) as string
        const url = props.getFileUrl({
          formId: props.formId,
          submissionId: row.id,
          fileName,
          attachments: row.attachments,
        })
        return {
          export: url,
          value: fileName ?? Datatable.Utils.blank,
          label: (
            <Txt link>
              <a href={url} target="_blank">
                {fileName}
              </a>
            </Txt>
          ),
          // label: <Core.Txt link><a href={koboImgHelper({fileName, attachments: row.attachments}).fullUrl} target="_blank">{fileName}</a></Core.Txt>
        }
      },
    }
  }

  static integer(props: ColumnQuestionBaseProps): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'number',
      renderQuick: (row: Row) => this.getValue({row, getRow: props.getRow, q: props.q}) as number,
    }
  }

  static note(props: ColumnQuestionBaseProps): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'string',
      renderQuick: (row: Row) => this.getValue({row, getRow: props.getRow, q: props.q}) as string,
    }
  }

  static date(props: ColumnQuestionBaseProps): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'date',
      render: (row: Row) => {
        const _ = this.getValue({row, getRow: props.getRow, q: props.q}) as Date | undefined
        const time = _ instanceof Date ? _.toLocaleDateString() + ' ' + _.toLocaleTimeString() : ''
        return {
          label: _ instanceof Date ? _.toLocaleDateString() : '',
          value: _,
          tooltip: time,
          export: time,
        }
      },
    }
  }

  static selectOne(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 'translateChoice' | 'm'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'select_one',
      render: (row: Row) => {
        const v = this.getValue({row, getRow: props.getRow, q: props.q}) as string | undefined
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

  static lastError: string | undefined

  static selectMultiple(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 'choicesIndex' | 'translateChoice'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'select_multiple',
      options: () =>
        props.choicesIndex[props.q.select_from_list_name!].map(_ => ({
          value: _.name,
          label: props.translateChoice(props.q.name, _.name),
        })),
      render: (row: Row) => {
        const v = this.getValue({row, getRow: props.getRow, q: props.q}) as string[] | undefined
        try {
          const label = v?.map(_ => props.translateChoice(props.q.name, _)).join(' | ')
          return {
            label,
            export: label,
            tooltip: label,
            value: v,
          }
        } catch (e: any) {
          if (props.q.$xpath !== this.lastError) {
            this.lastError = props.q.$xpath
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

  static geopoint(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 'getRow' | 'q' | 'isReadonly'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'string',
      renderQuick: (row: Row) => JSON.stringify(this.getValue({row, getRow: props.getRow, q: props.q})),
    }
  }

  static unknown(props: ColumnQuestionProps): Datatable.Column.Props<any> {
    return {
      ...this.getBase(props),
      type: 'string',
      renderQuick: (row: Row) => JSON.stringify(this.getValue({row, getRow: props.getRow, q: props.q})),
    }
  }

  static repeatGroup(
    props: ColumnQuestionBaseProps & Pick<ColumnQuestionProps, 't' | 'onRepeatGroupClick'>,
  ): Datatable.Column.Props<Row> {
    return {
      ...this.getBase(props),
      type: 'number',
      styleHead: {
        background: colorRepeatedQuestionHeader(props.t),
      },
      render: (row: Row) => {
        const value = this.getValue({...props, row}) as any[]
        return {
          export: value?.length,
          value: value?.length,
          label: value && (
            <Btn
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
}
