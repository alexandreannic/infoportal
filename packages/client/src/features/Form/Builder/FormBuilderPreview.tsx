import {XlsFormFiller} from 'xls-form-filler'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'

export const FormBuilderPreview = ({schema}: {schema?: Api.Form.Schema}) => {
  const {m} = useI18n()

  return (
    <Core.Panel>
      <Core.PanelHead>{m.preview}</Core.PanelHead>
      <Core.PanelBody>
        {schema && (
          <XlsFormFiller
            survey={schema as any}
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
