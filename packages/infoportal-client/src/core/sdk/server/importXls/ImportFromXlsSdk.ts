import {ApiClient} from '@/core/sdk/server/ApiClient'
import {Kobo} from 'kobo-sdk'
import FormId = Kobo.FormId

export class ImportFromXlsDataSdk {
  constructor(private client: ApiClient) {}

  readonly importFromXLSFile = (formId: FormId, file: File, action: 'create' | 'update') => {
    return this.client.postFile(`kobo-api/${formId}/import-from-xls`, {qs: {action}, file})
  }
}
