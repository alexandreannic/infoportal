import {ApiClient} from '../server/ApiClient'
import {appConfig} from '../../../conf/AppConfig'

export interface ExcelWorksheet {
  text: string[][]
}

export class MicrosoftGraphClient {
  constructor(
    private token: string = appConfig.microsoft.bearerToken,
    private client = new ApiClient({
      baseUrl: 'https://graph.microsoft.com/v1.0',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }),
  ) {}

  readonly fetchExcelData = (driveItemId: string, sheetName: string) => {
    return this.client.get<ExcelWorksheet>(
      `/me/drive/items/01CKP6OH3VP5DKGSHMEREZELJDANZDU6UJ/workbook/worksheets('Trans_Res')/usedRange`,
    )
  }
}
