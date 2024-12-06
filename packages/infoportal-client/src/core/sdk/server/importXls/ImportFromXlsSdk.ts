import {KoboId} from 'infoportal-common'
import {ApiClient} from '@/core/sdk/server/ApiClient'

export class ImportFromXlsDataSdk {
  constructor(private client: ApiClient) {}

  readonly importFromXLSFile = (formId: KoboId, file: File, action: 'create' | 'update') => {
    return this.client.postFile(`kobo-api/${formId}/import-from-xls?action=${action}`, {file});
  };
}