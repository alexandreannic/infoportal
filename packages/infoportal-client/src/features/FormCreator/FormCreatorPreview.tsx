import {Ip} from 'infoportal-api-sdk'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {XlsFormFiller} from 'xls-form-filler'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {useQuerySchema} from '@/core/query/useQuerySchema'

export const FormCreatorPreview = ({
  workspaceId,
  formId,
  versionId,
}: {
  workspaceId: Ip.Uuid
  formId: Ip.FormId
  versionId: Ip.Uuid
}) => {
  const {m} = useI18n()
  const querySchema = useQuerySchema({workspaceId, formId, versionId}).get
  return (
    <Panel>
      <PanelHead>{m.preview}</PanelHead>
      <PanelBody>
        <XlsFormFiller
          survey={querySchema.data}
          hideActions
          onSubmit={_ => {
            console.log('HERE')
            console.log(_)
          }}
        />
      </PanelBody>
    </Panel>
  )
}
