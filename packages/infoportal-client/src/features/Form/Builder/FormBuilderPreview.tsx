import {Ip} from 'infoportal-api-sdk'
import {XlsFormFiller} from 'xls-form-filler'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'
import {Core} from '@/shared'

export const FormBuilderPreview = ({
  workspaceId,
  formId,
  versionId,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  versionId: Ip.Form.VersionId
}) => {
  const {m} = useI18n()
  const querySchema = useQuerySchemaByVersion({workspaceId, formId, versionId})
  return (
    <Core.Panel loading={querySchema.isLoading}>
      <Core.PanelHead>{m.preview}</Core.PanelHead>
      <Core.PanelBody>
        {querySchema.data && (
          <XlsFormFiller
            survey={querySchema.data}
            hideActions
            onSubmit={_ => {
              console.log('HERE')
              console.log(_)
            }}
          />
        )}
      </Core.PanelBody>
    </Core.Panel>
  )
}
