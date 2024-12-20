import { KoboSchemaHelper} from 'infoportal-common'
import * as xlsx from 'xlsx'
import {PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from './KoboSdkGenerator'
import {Obj, seq} from '@alexandreannic/ts-utils'
import lodash from 'lodash'
import {KoboClient} from 'kobo-sdk'
import {Kobo} from 'kobo-sdk'
import QuestionType = Kobo.Form.QuestionType
import FormId = Kobo.FormId

type KoboData = {_parent_index?: number; _index?: number} & Record<string, any>

export class ImportService {
  constructor(
    private prisma: PrismaClient,
    private koboSdkGenerator = KoboSdkGenerator.getSingleton(prisma)
  ) {
  }

  readonly processData = async (formId: FormId, filePath: string, action: 'create' | 'update') => {
    const sdk = await this.koboSdkGenerator.getBy.formId(formId)
    const schema = await sdk.v2.getForm(formId)
    const schemaHelper = KoboSchemaHelper.buildBundle({schema})

    const sheetData = this.getSheets(xlsx.readFile(filePath))
    const rootSheet = Object.keys(sheetData)[0]

    if (action === 'create') {
      const mergedData = this.mergeNestedData(sheetData, schemaHelper)
      const formattedData = this.formatDataForSubmission(mergedData, schemaHelper, true, action)
      await this.batchCreate(formattedData, sdk, formId)
    } else if (action === 'update') {
      const transformedData = this.transformValues(sheetData[rootSheet], schemaHelper)
      await this.batchUpdate(sdk, transformedData, formId, schemaHelper)
    }
  }

  private getSheets = (workbook: xlsx.WorkBook): Record<string, KoboData[]> => {
    const sheetData: Record<string, KoboData[]> = {}
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName]
      const jsonData = xlsx.utils.sheet_to_json(sheet, {header: 1}) as any[][]
      if (jsonData.length > 0) {
        const headers = jsonData[0]
        const rows = jsonData.slice(1)
        sheetData[sheetName] = rows.map(row => {
          return lodash.zipObject(headers, row)
        })
      }
    })
    return sheetData
  }

  private transformValues = (rows: KoboData[], schemaHelper: KoboSchemaHelper.Bundle): KoboData[] => {
    return rows.map(row => {
      const transformedRow: KoboData = {}

      if (row['ID']) {
        transformedRow['ID'] = String(row['ID'])
      }

      Obj.keys(row).forEach(key => {
        const question = schemaHelper.helper.questionIndex[key]
        if (key !== 'ID') {
          transformedRow[key] = question && this.isValid(question.type, row[key])
            ? this.transformValue(question.type, row[key])
            : null
        }
      })

      transformedRow['_IP_ADDED_FROM_XLS'] = 'true'
      return transformedRow
    })
  }

  private isValid = (type: QuestionType, value: any): boolean => {
    if (value == null || value === '') return true

    switch (type) {
      case 'integer':
        return Number.isInteger(Number(value)) && Number(value) >= 0
      case 'decimal':
        return !isNaN(Number(value))
      case 'select_one':
      case 'select_multiple':
        return Array.isArray(value) || typeof value === 'string'
      case 'date':
        return !isNaN(new Date(value).getTime())
      case 'text':
      case 'note':
        return typeof value === 'string'
      default:
        return true
    }
  }

  private transformNestedData(value: any, schemaHelper: KoboSchemaHelper.Bundle): any {
    if (Array.isArray(value)) {
      return value.map(item => this.transformRow(item, schemaHelper))
    }
    return value
  }

  private transformRow(row: Record<string, any>, schemaHelper: KoboSchemaHelper.Bundle): Record<string, any> {
    const transformedRow: Record<string, any> = {}

    Obj.keys(row).forEach(key => {
      const question = schemaHelper.helper.questionIndex[key]
      if (question) {
        transformedRow[key] = this.isNestedField(question.type)
          ? this.transformNestedData(row[key], schemaHelper)
          : this.transformValue(question.type, row[key])
      } else {
        transformedRow[key] = row[key]
      }
    })
    return transformedRow
  }


  private mergeNestedData = (sheets: Record<string, KoboData[]>, schemaHelper: KoboSchemaHelper.Bundle) => {
    const rootSheet = Object.keys(sheets)[0]
    const rootData = sheets[rootSheet]

    return rootData.map(row => {
      const groups = schemaHelper.helper.group.search({depth: 1})
      groups.forEach(group => {
        const indexedChildren = seq(sheets[group.name]).compactBy('_parent_index').groupBy(_ => _._parent_index)
        if (sheets[group.name]) {
          row[group.name] = indexedChildren[row._index!] || []
        }
      })
      return row
    })
  }

  private transformValue = (type: string, value: any): any => {
    if (value == null || value === '') return null

    switch (type) {
      case 'date':
      case 'datetime':
      case 'start':
      case 'end':
        return !isNaN(Number(value)) ? this.stupidMicrosoftDateToJSDate(Number(value)) : this.formatDate(value)
      default:
        return String(value).trim()
    }
  }

  private stupidMicrosoftDateToJSDate(serial: number): string | null {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    if (isNaN(serial)) return null
    const days = Math.floor(serial)
    const timeFraction = serial - days
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000)
    const timeInMs = Math.round(timeFraction * 24 * 60 * 60 * 1000)
    date.setTime(date.getTime() + timeInMs)
    return date.toISOString().split('T')[0]
  }

  private formatDate = (value: any): string | null => {
    const parsedDate = new Date(value)
    return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().split('T')[0]
  }

  private isNestedField(type: string): boolean {
    return ['begin_group', 'begin_repeat'].includes(type)
  }

  private formatDataForSubmission = (
    data: KoboData[],
    schemaHelper: KoboSchemaHelper.Bundle,
    skipNullForCreate: boolean,
    action: 'create' | 'update'
  ): KoboData[] => {
    return data.map(row => {
      const formattedRow: KoboData = {}

      Obj.keys(row).forEach(questionName => {
        const questionSchema = schemaHelper.helper.questionIndex[questionName]
        const xpath = questionSchema?.$xpath

        if (xpath) {
          const transformedValue = questionSchema
            ? this.isNestedField(questionSchema.type)
              ? this.transformNestedData(row[questionName], schemaHelper)
              : this.transformValue(questionSchema.type, row[questionName])
            : row[questionName]

          if (action === 'create') {
            xpath.split('/').reduce((acc, key, i, arr) => {
              if (i === arr.length - 1) {
                if (!skipNullForCreate || transformedValue !== null) {
                  acc[key] = transformedValue
                }
              } else {
                acc[key] = acc[key] || {}
              }
              return acc[key]
            }, formattedRow)
          } else {
            if (!skipNullForCreate || transformedValue !== null) {
              formattedRow[xpath] = transformedValue
            }
          }
        } else if (questionName === '_IP_ADDED_FROM_XLS') {
          formattedRow[questionName] = row[questionName]
        }
      })

      return formattedRow
    })
  }


  private async batchCreate(data: KoboData[], sdk: any, formId: FormId) {
    for (const row of data) {
      await sdk.v1.submit({
        formId,
        data: {...row},
        retries: 2,
      })
    }
  }

  private async batchUpdate(
    sdk: KoboClient,
    data: KoboData[],
    formId: FormId,
    schemaHelper: KoboSchemaHelper.Bundle
  ) {
    for (const row of data) {
      const answerId = row['ID']
      if (!answerId) continue

      const formattedRow = this.formatDataForSubmission([row], schemaHelper, false, 'update')[0]

      await sdk.v2.updateData({
        formId,
        data: formattedRow,
        submissionIds: [answerId],
      })
    }
  }
}
