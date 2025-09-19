import {ApiClient} from '@/core/sdk/server/ApiClient'
import {Ip} from 'infoportal-api-sdk'
import FormId = Ip.FormId

export class ImportFromXlsDataSdk {
  constructor(private client: ApiClient) {}

  readonly importFromXLSFile = (formId: FormId, file: File, action: 'create' | 'update') => {
    return this.client.postFile(`kobo-api/${formId}/import-from-xls`, {
      qs: {action},
      uploadName: 'uf-import-answers',
      file,
    })
  }
}
