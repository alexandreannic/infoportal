import {Api} from '@infoportal/api-sdk'
import {SchemaToXlsForm} from '@infoportal/form-helper'

export class PyxFormClient {
  static readonly getXmlBySchema = async (schema: Api.Form.Schema) => {
    const buffer = await SchemaToXlsForm.convert(schema).asBuffer()
    await SchemaToXlsForm.convert(schema).saveInDisk('/Users/alex/Documents/Workspaces/infoportal/delme.xlsx')

    const formData = new FormData()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    formData.append('file', blob, 'form.xlsx')

    const res = await fetch('http://localhost:8000/get-xml', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Server error ${res.status}: ${text}`)
    }

    return res.text()
  }
}
