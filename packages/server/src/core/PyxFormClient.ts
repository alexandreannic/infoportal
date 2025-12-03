import {Api} from '@infoportal/api-sdk'
import {SchemaToXlsForm} from '@infoportal/form-helper'

export class PyxFormClient {
  static readonly getXmlBySchema = async (schema: Api.Form.Schema) => {
    const buffer = await SchemaToXlsForm.convert(schema).asBuffer()
    const formData = new FormData()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    formData.append('file', blob, 'form.xlsx')
    const res = await fetch('http://localhost:8000/get-xml', {
      method: 'POST',
      body: formData,
    })
    return res.text()
  }
}
