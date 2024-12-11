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
import {KoboSubmissionMetaData} from 'infoportal-common/kobo'
import {KoboEditAnswersContext} from '@/core/context/KoboEditAnswersContext'

export const getColumnsBase = ({
  selectedIds,
  formId,
  canEdit,
  m,
  asyncUpdateValidationById,
  asyncEdit,
  openViewAnswer,
  openEditAnswer,
  getRow = _ => _,
}: {
  getRow?: (_: any) => KoboSubmissionFlat,
  asyncEdit: DatabaseKoboContext['asyncEdit']
  openEdit: KoboEditAnswersContext['open']
  openViewAnswer: KoboAnswersContext['openView']
  formId: Kobo.FormId
  selectedIds: Kobo.SubmissionId[]
  asyncUpdateValidationById: KoboEditAnswersContext['asyncUpdateValidationById']
  canEdit?: boolean
  m: Messages
}): DatatableColumn.Props<any>[] => {
  const validationKey: keyof KoboSubmissionMetaData = 'validationStatus'
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
      subHeader: selectedIds.length > 0 && <TableEditCellBtn onClick={() => openEditAnswer({
        formId: formId,
        answerIds: selectedIds,
        question: validationKey,
      })}/>,
      width: 0,
      type: 'select_one',
      render: (row: any) => {
        const value = getRow(row)[validationKey]
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
                asyncUpdateAnswerById.call({
                  formId: formId,
                  answerIds: [getRow(row).id],
                  question: validationKey,
                  answer: e,
                })
              }}
            />
          )
        }
      }
    }
  ]
}