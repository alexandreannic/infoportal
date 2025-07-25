import {Ip} from 'infoportal-api-sdk'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {XlsFormFiller} from 'xls-form-filler'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'

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
    <Panel loading={querySchema.isLoading}>
      <PanelHead>{m.preview}</PanelHead>
      <PanelBody>
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
      </PanelBody>
    </Panel>
  )
}
