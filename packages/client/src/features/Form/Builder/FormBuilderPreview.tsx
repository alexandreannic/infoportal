import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'

export const FormBuilderPreview = ({schemaXml}: {schemaXml?: Api.Form.SchemaXml}) => {
  const {m} = useI18n()
  return (
    <Core.Panel>
      <Core.PanelHead>{m.preview}</Core.PanelHead>
      <Core.PanelBody>
        {schemaXml && <OdkWebForm formXml={schemaXml as string} onSubmit={_ => console.log('SUBMIT', _)} />}
      </Core.PanelBody>
    </Core.Panel>
  )
}
