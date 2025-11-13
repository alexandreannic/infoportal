import {Ip} from '@infoportal/api-sdk'
import {XlsFormFiller} from 'xls-form-filler'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {useQuerySchemaByVersion} from '@/core/query/useQuerySchemaByVersion'
import {Core} from '@/shared'
import {useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'

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
  const localDraft = useFormBuilderContext(_ => _.localDraft)
  console.log(localDraft)
  return (
    <Core.Panel loading={!localDraft}>
      <Core.PanelHead>{m.preview}</Core.PanelHead>
      <Core.PanelBody>
        {localDraft && (
          <XlsFormFiller
            survey={localDraft}
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
