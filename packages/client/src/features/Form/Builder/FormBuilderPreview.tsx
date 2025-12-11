import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'

export const FormBuilderPreview = ({formId, schemaXml}: {formId: Api.FormId; schemaXml?: Api.Form.SchemaXml}) => {
  const {m} = useI18n()
  return (
    <Core.Panel>
      <Core.PanelBody sx={{p: 1}}>
        {schemaXml && (
          <OdkWebForm formId={formId} questionIndex={{}} formXml={schemaXml as string} onSubmit={_ => alert('✅')} />
        )}
      </Core.PanelBody>
    </Core.Panel>
  )
}
