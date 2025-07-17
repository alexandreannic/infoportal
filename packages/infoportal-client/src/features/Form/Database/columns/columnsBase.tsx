import {TableIconBtn} from '@/shared/TableIcon'
import {TableEditCellBtn} from '@/shared/TableEditCellBtn'
import {SelectStatusBy} from '@/shared/customInput/SelectStatus'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import React from 'react'
import {formatDate, formatDateTime, Messages} from '@/core/i18n/localization/en'
import {KoboFlattenRepeatedGroup, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useKoboDialogs} from '@/core/store/useLangIndex'
import {useQueryAnswerUpdate} from '@/core/query/useQueryAnswerUpdate'
import {KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {DatatableHeadIconByType} from '@/shared/Datatable/DatatableHead'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'

type Props = {
  workspaceId: UUID
  queryUpdate: ReturnType<typeof useQueryAnswerUpdate>
  getRow?: (_: any) => KoboMappedAnswer
  dialogs: ReturnType<typeof useKoboDialogs>
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
  canEdit?: boolean
  m: Messages
}

export const getColumnBase = {
  id,
  submissionTime,
  all,
}

function id({getRow = _ => _}: Pick<Props, 'getRow'> = {}): DatatableColumn.Props<any> {
  return {
    type: 'id',
    id: 'id' as const,
    head: 'ID',
    typeIcon: <DatatableHeadIconByType type="id" />,
    className: 'td-id',
    style: (row: any) => {
      const data = getRow(row) as KoboFlattenRepeatedGroup.Data
      if (data[KoboFlattenRepeatedGroup.INDEX_COL]! > 0) {
        return {
          opacity: '.5',
        }
      }
      return {}
    },
    renderQuick: (row: any) => {
      const data = getRow(row) as KoboFlattenRepeatedGroup.Data
      const childIndex = data[KoboFlattenRepeatedGroup.INDEX_COL]
      return (data.id ?? '') + (childIndex !== undefined ? '#' + (childIndex + 1) : '')
    },
  } as const
}

function submissionTime({m, getRow = _ => _}: Pick<Props, 'm' | 'getRow'>): DatatableColumn.Props<any> {
  return {
    head: m.submissionTime,
    id: 'submissionTime' as const,
    type: 'date',
    typeIcon: <DatatableHeadIconByType type="date" />,
    render: (row: any) => {
      const _ = getRow(row)
      const time = formatDateTime(_.submissionTime)
      return {
        label: formatDate(_.submissionTime),
        value: _.submissionTime,
        tooltip: time,
        export: time,
      }
    },
  } as const
}

function all({
  selectedIds,
  formId,
  canEdit,
  m,
  dialogs,
  getRow = _ => _,
  queryUpdate,
  workspaceId,
}: {
  workspaceId: UUID
  queryUpdate: ReturnType<typeof useQueryAnswerUpdate>
  getRow?: (_: any) => KoboMappedAnswer
  dialogs: ReturnType<typeof useKoboDialogs>
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
  canEdit?: boolean
  m: Messages
}): DatatableColumn.Props<any>[] {
  return [
    {
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
    },
    id({getRow}),
    submissionTime({m, getRow}),
    {
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
          export: value ? m[value] : DatatableUtils.blank,
          value: value ?? DatatableUtils.blank,
          option: value ? m[value] : DatatableUtils.blank,
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
    },
  ] as const
}
