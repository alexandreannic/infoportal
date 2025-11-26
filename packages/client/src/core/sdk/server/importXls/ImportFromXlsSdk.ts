import {HttpClient} from '@/core/sdk/server/HttpClient'
import {Api} from '@infoportal/api-sdk'
import FormId = Api.FormId

export class ImportFromXlsDataSdk {
  constructor(private client: HttpClient) {}

  readonly importFromXLSFile = (formId: FormId, file: File, action: 'create' | 'update') => {
    return this.client.postFile(`kobo-api/${formId}/import-from-xls`, {
      qs: {action},
      uploadName: 'uf-import-answers',
      file,
    })
  }
}
