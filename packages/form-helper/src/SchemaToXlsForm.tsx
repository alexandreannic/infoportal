import {Api} from '@infoportal/api-sdk'
import {Obj} from '@axanc/ts-utils'

export type XlsFormMap = {
  survey: Record<string, any>[]
  choices: Record<string, any>[]
  settings: Record<string, any>
}

let _xlsx: any = null
const getXlsx = async () => {
  if (!_xlsx) _xlsx = await import('xlsx')
  return _xlsx
}

let _path: any = null
let _fs: any = null
const getNodeDeps = async () => {
  if (!_path) _path = await import('path')
  if (!_fs) _fs = await import('fs')
  return {path: _path, fs: _fs}
}

export class SchemaToXlsForm {
  private constructor(private readonly table: XlsFormMap) {}

  asJson() {
    return this.table
  }

  async asXlsx() {
    const XLSX = await getXlsx()
    const wb = XLSX.utils.book_new()

    const surveySheet = XLSX.utils.json_to_sheet(this.table.survey)
    const choicesSheet = XLSX.utils.json_to_sheet(this.table.choices)
    const settingsRows = Object.keys(this.table.settings).length ? [this.table.settings] : []

    const settingsSheet = XLSX.utils.json_to_sheet(settingsRows)

    XLSX.utils.book_append_sheet(wb, surveySheet, 'survey')
    XLSX.utils.book_append_sheet(wb, choicesSheet, 'choices')
    XLSX.utils.book_append_sheet(wb, settingsSheet, 'settings')

    return wb
  }

  async asBuffer() {
    const XLSX = await getXlsx()
    const wb = await this.asXlsx()
    return XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'})
  }

  async saveInDisk(outFilePath: string) {
    const XLSX = await getXlsx()
    const {path, fs} = await getNodeDeps()

    const outDir = path.dirname(outFilePath)
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true})

    XLSX.writeFile(await this.asXlsx(), outFilePath)
    return outFilePath
  }

  private static mapQuestion = ({
    $kuid,
    $xpath,
    select_from_list_name,
    ...row
  }: Api.Form.Question): Record<string, any> => {
    const questionWithChoices = new Set<Api.Form.QuestionType>([
      'select_multiple',
      'select_one_from_file',
      'select_one',
    ])
    return {
      ...row,
      type: questionWithChoices.has(row.type) ? row.type + ' ' + select_from_list_name : row.type,
    }
  }

  private static flattenRow =
    (schema: Api.Form.Schema) =>
    ({$kuid, ...row}: Record<string, any>): Record<string, any> => {
      const out: Record<string, any> = {}
      for (const [key, value] of Obj.entries(row)) {
        if (schema.translated.includes(key as any) && Array.isArray(value)) {
          schema.translations.forEach((lang, i) => {
            out[`${key}:${lang}`] = value[i] ?? ''
          })
        } else {
          out[key] = value
        }
      }
      return out
    }

  static convert(schema: Api.Form.Schema): SchemaToXlsForm {
    return new SchemaToXlsForm({
      survey: schema.survey.map(this.mapQuestion).map(this.flattenRow(schema)),
      choices: schema.choices?.map(this.flattenRow(schema)) ?? [],
      settings: schema.settings ?? {},
    })
  }
}
