import React from 'react'
import {ColumnMetaProps, Row} from './type'
import {Ip} from 'infoportal-api-sdk'
import * as Datatable from '@infoportal/client-datatable'
import {ReadonlyAction} from '../ui/ReadonlyAction'
import {KoboFlattenRepeatedGroup} from 'infoportal-common'
import {Messages} from '@infoportal/client-i18n'
import {StatusIcon} from '@infoportal/client-core'
import {BulkUpdateValidation} from '../ui/BulkUpdate'
import {KoboTypeIcon} from '../ui/KoboTypeIcon'

const metaGroup = {label: 'Meta', id: 'meta'}

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

export class Meta {
  static id({getRow = _ => _ as any}: Pick<ColumnMetaProps, 'getRow'> = {}): Datatable.Column.Props<Row> {
    return {
      group: metaGroup,
      type: 'id',
      id: 'id' as const,
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

  static version({m}: {m: Messages}): Datatable.Column.Props<Row> {
    return {
      group: metaGroup,
      id: 'version' as const,
      head: m.version,
      width: 70,
      noCsvExport: true,
      renderQuick: (_: Row) => _.version,
    }
  }

  static actions({
    dialog,
    isReadonly,
    koboEditEnketoUrl,
    formType,
    m,
  }: Pick<
    ColumnMetaProps,
    'dialog' | 'formType' | 'workspaceId' | 'formId' | 'isReadonly' | 'koboEditEnketoUrl' | 'm'
  >): Datatable.Column.Props<Row> {
    return {
      group: metaGroup,
      id: 'actions' as const,
      head: '',
      width: 70,
      noCsvExport: true,
      render: (_: Row) => {
        return {
          value: null as any,
          label: (
            <>
              <Datatable.IconBtn
                tooltip={m.view}
                children="visibility"
                onClick={() => dialog.openView({submission: _ as Ip.Submission})}
              />
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
                  onClick={() => dialog.openEdit({submission: _ as Ip.Submission})}
                />
              )}
            </>
          ),
        }
      },
    }
  }

  private static date({
    key,
    label,
  }: {
    label: string
    key: KeysOfType<Ip.Submission, Date>
  }): Datatable.Column.Props<Row> {
    return {
      id: key,
      group: metaGroup,
      type: 'date',
      head: label,
      typeIcon: <KoboTypeIcon children="date" />,
      typeLabel: key,
      render: (row: Row) => {
        const value = row[key]
        const time = value ? value.toLocaleDateString() + ' ' + value.toLocaleTimeString() : ''
        return {
          label: value ? value.toLocaleDateString() : '',
          value: value,
          tooltip: time,
          export: time,
        }
      },
    }
  }

  static start({m}: {m: Messages}): Datatable.Column.Props<Row> {
    return this.date({
      key: 'start',
      label: m.start,
    })
  }

  static end({m}: {m: Messages}): Datatable.Column.Props<Row> {
    return this.date({
      key: 'end',
      label: m.end,
    })
  }
  static submissionTime({m}: {m: Messages}): Datatable.Column.Props<Row> {
    return this.date({
      key: 'submissionTime',
      label: m.submissionTime,
    })
  }

  static validation({
    workspaceId,
    formId,
    getRow = _ => _ as any,
    isReadonly,
    queryUpdateValidation,
    m,
  }: Pick<
    ColumnMetaProps,
    'isReadonly' | 'queryUpdateValidation' | 'getRow' | 'formId' | 'workspaceId' | 'm'
  >): Datatable.Column.Props<Row> {
    return {
      group: metaGroup,
      id: '_validation' as const,
      head: m.validation,
      align: 'center',
      width: 60,
      type: 'select_one',
      actionOnSelected: isReadonly
        ? undefined
        : ({rowIds}: {rowIds: string[]}) => (
            <BulkUpdateValidation
              query={queryUpdateValidation}
              formId={formId}
              workspaceId={workspaceId}
              answerIds={rowIds as Ip.SubmissionId[]}
            />
          ),
      render: (row: any) => {
        const value: Ip.Submission.Validation = getRow(row).validationStatus
        return {
          export: value ? (m as any)[value] : Datatable.Utils.blank,
          value: value ?? Datatable.Utils.blank,
          option: value ? (m as any)[value] : Datatable.Utils.blank,
          label: <StatusIcon type={Ip.Submission.validationToStatus[value]} />,
        }
      },
    }
  }

  static all(props: ColumnMetaProps): Datatable.Column.Props<any>[] {
    return [
      this.actions(props),
      props.formType === 'smart' ? undefined : this.validation(props),
      this.id(props),
      props.formType === 'smart' ? undefined : this.version(props),
      this.submissionTime(props),
    ].filter(_ => !!_)
  }
}
