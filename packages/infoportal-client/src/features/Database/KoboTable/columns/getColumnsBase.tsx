import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {TableEditCellBtn} from '@/shared/TableEditCellBtn'
import {SelectStatusBy} from '@/shared/customInput/SelectStatus'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import React from 'react'
import {Messages} from '@/core/i18n/localization/en'
import {KoboSubmissionFlat} from 'infoportal-common'
import {KoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {DatabaseKoboContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {Kobo} from 'kobo-sdk'
import {KoboSubmissionMetaData} from 'infoportal-common'
import {KoboEditAnswersContext} from '@/core/context/KoboEditAnswersContext'
import {KoboUpdateContext} from '@/core/context/KoboUpdateContext'

export const getColumnsBase = ({
  selectedIds,
  formId,
  canEdit,
  m,
  ctxEdit,
  openViewAnswer,
  getRow = _ => _,
  asyncEdit,
}: {
  ctxEdit: KoboUpdateContext
  asyncEdit: DatabaseKoboContext['asyncEdit']
  getRow?: (_: any) => KoboSubmissionFlat,
  openViewAnswer: KoboAnswersContext['openView']
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
              <TableIconBtn tooltip={m.view} children="visibility" onClick={() => openViewAnswer({answer: _, formId: formId})}/>
              <TableIconBtn disabled={!canEdit} tooltip={m.editKobo} target="_blank" href={asyncEdit(_.id)} children="edit"/>
            </>
          )
        }
      }
    }
    ,
    {
      id: '_validation',
      head: m.validation,
      subHeader: selectedIds.length > 0 && <TableEditCellBtn onClick={() => ctxEdit.openById({
        target: 'validation',
        params: {
          formId: formId,
          answerIds: selectedIds,
        }
      })}/>,
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
              onChange={(e) => {
                ctxEdit.asyncUpdateById.validation.call({
                  formId: formId,
                  answerIds: [getRow(row).id],
                  status: e,
                })
              }}
            />
          )
        }
      }
    }
  ]
}