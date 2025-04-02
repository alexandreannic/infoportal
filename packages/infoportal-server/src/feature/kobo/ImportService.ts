import {KoboSchemaHelper} from 'infoportal-common'
import xlsx from 'xlsx'
import {PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from './KoboSdkGenerator.js'
import {Obj, seq} from '@axanc/ts-utils'
import lodash from 'lodash'
import {Kobo, KoboClient} from 'kobo-sdk'

type KoboData = {_parent_index?: number; _index?: number} & Record<string, any>

export class ImportService {
  constructor(
    private prisma: PrismaClient,
    private koboSdkGenerator = KoboSdkGenerator.getSingleton(prisma),
  ) {}

  readonly processData = async (formId: Kobo.FormId, filePath: string, action: 'create' | 'update') => {
    const sdk = await this.koboSdkGenerator.getBy.formId(formId)
    const schema = await sdk.v2.form.get({formId, use$autonameAsName: true})
    const schemaHelper = KoboSchemaHelper.buildBundle({schema})

    const sheetData = Obj.mapValues(this.getSheets(xlsx.readFile(filePath)), (sheet) =>
      ImportService.fixStupidMicrosoftDate(sheet, schemaHelper),
    )
    if (action === 'create') {
      const mergedData = ImportService.mergeNestedSheets(sheetData, schemaHelper)
      const taggedData = mergedData.map((_) => {
        _._IP_ADDED_FROM_XLS = true
        return _
      })
      await this.batchCreate(taggedData, sdk, formId)
    } else if (action === 'update') {
      await ImportService.batchUpdate(sdk, Object.values(sheetData)[0], formId)
    }
  }

  private getSheets = (workbook: xlsx.WorkBook): Record<string, KoboData[]> => {
    const sheetData: Record<string, KoboData[]> = {}
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName]
      const jsonData = xlsx.utils.sheet_to_json(sheet, {header: 1}) as any[][]
      if (jsonData.length > 0) {
        const headers = jsonData[0]
        const rows = jsonData.slice(1)
        sheetData[sheetName] = rows.map((row) => {
          return lodash.zipObject(headers, row)
        })
      }
    })
    return sheetData
  }

  private static mergeNestedSheets = (sheets: Record<string, KoboData[]>, schemaHelper: KoboSchemaHelper.Bundle) => {
    const rootSheetData = Object.values(sheets)[0]

    return rootSheetData.map((row) => {
      const groups = schemaHelper.helper.group.search({depth: 1})
      groups.forEach((group) => {
        const indexedChildren = seq(sheets[group.name])
          .compactBy('_parent_index')
          .groupBy((_) => _._parent_index)
        if (sheets[group.name]) {
          row[group.name] = indexedChildren[row._index!] || []
        }
      })
      return row
    })
  }

  private static fixStupidMicrosoftDate = (data: KoboData[], schemaHelper: KoboSchemaHelper.Bundle): KoboData[] => {
    const dates: Set<Kobo.Form.QuestionType> = new Set(['date', 'today', 'start', 'end', 'datetime'])
    return data.map((d) => {
      return Obj.map(d, (k, v) => {
        if (dates.has(schemaHelper.helper.questionIndex[k]?.type)) {
          return [k, ImportService.stupidMicrosoftDateToJSDate(v)]
        }
        return [k, v]
      })
    })
  }

  private static stupidMicrosoftDateToJSDate = (serial: number): string | null => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    if (isNaN(serial)) return null
    const days = Math.floor(serial)
    const timeFraction = serial - days
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000)
    const timeInMs = Math.round(timeFraction * 24 * 60 * 60 * 1000)
    date.setTime(date.getTime() + timeInMs)
    return date.toISOString().split('T')[0]
  }

  private async batchCreate(data: KoboData[], sdk: KoboClient, formId: Kobo.FormId) {
    for (const row of data) {
      await sdk.v1.submission.submitXml({
        formId,
        data: {...row},
        retries: 2,
      })
    }
  }

  private static async batchUpdate(sdk: KoboClient, data: KoboData[], formId: Kobo.FormId) {
    for (const row of data) {
      const answerId = row['ID']
      if (!answerId) continue
      await sdk.v2.submission.update({
        formId,
        data: row,
        submissionIds: [answerId],
      })
    }
  }
}
