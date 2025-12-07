import {Api} from '@infoportal/api-sdk'
import {SchemaToXlsForm} from '@infoportal/form-helper'
import * as fs from 'node:fs'

export class PyxFormClient {
  static readonly validateAndGetXmlBySchema = async (schema: Api.Form.Schema): Promise<Api.Form.Schema.Validation> => {
    const buffer = await SchemaToXlsForm.convert(schema).asBuffer()
    return this.getXml(buffer)
  }

  static readonly valdiateAndGetXmlByFilePath = async (filePath: string): Promise<Api.Form.Schema.Validation> => {
    const buffer = fs.readFileSync(filePath)
    return this.getXml(buffer)
  }

  private static bufferToFormData = (buffer: NonSharedBuffer) => {
    const formData = new FormData()
    formData.append(
      'file',
      new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
      'form.xlsx',
    )
    return formData
  }

  private static readonly getXml = async (buffer: NonSharedBuffer): Promise<Api.Form.Schema.Validation> => {
    const formData = this.bufferToFormData(buffer)
    const res = await fetch('http://localhost:8000/validate-and-get-xml', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Server error ${res.status}: ${text}`)
    }
    return res.json()
  }
}
