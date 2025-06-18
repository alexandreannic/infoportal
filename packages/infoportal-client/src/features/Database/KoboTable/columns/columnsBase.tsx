import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {TableIconBtn} from '@/shared/TableIcon'
import {TableEditCellBtn} from '@/shared/TableEditCellBtn'
import {SelectStatusBy} from '@/shared/customInput/SelectStatus'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import React from 'react'
import {Messages} from '@/core/i18n/localization/en'
import {KoboSubmissionFlat, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {useKoboDialogs} from '@/core/store/useLangIndex'
import {useQueryAnswerUpdate} from '@/core/query/useQueryUpdate'

export const getColumnsBase = ({
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
  getRow?: (_: any) => KoboSubmissionFlat
  dialogs: ReturnType<typeof useKoboDialogs>
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
  canEdit?: boolean
  m: Messages
}): DatatableColumn.Props<any>[] => {
  return [
    {
      id: 'actions',
      head: '',
      width: 0,
      noCsvExport: true,
      render: _ => {
        return {
          value: null as any,
          label: (
            <>
              <TableIconBtn
                disabled={!canEdit}
                tooltip={m.editKobo}
                children="edit"
                onClick={() => dialogs.openEdit({answer: _, formId: formId})}
              />
              <TableIconBtn
                tooltip={m.view}
                children="visibility"
                onClick={() => dialogs.openView({answer: _, formId: formId})}
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
    {
      id: '_validation',
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
  ]
}
