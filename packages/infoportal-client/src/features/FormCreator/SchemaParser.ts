import * as xlsx from 'xlsx'
import {Kobo} from 'kobo-sdk'

export class XlsParsingError extends Error {}

export class SchemaParser {
  constructor() {}

  static readonly xlsToJson = (workbook: xlsx.WorkBook): Kobo.Form['content'] => {
    const sheetToJson = <T>(name: string): T[] => {
      const sheet = workbook.Sheets[name]
      return sheet ? xlsx.utils.sheet_to_json<T>(sheet) : []
    }

    const settingsRaw = sheetToJson<Record<string, string>>('settings')
    const surveyRaw = sheetToJson<Record<string, any>>('survey')
    const choicesRaw = sheetToJson<Record<string, string>>('choices')
    const settings = settingsRaw[0]

    const {translated, langs} = this.getTranslations(workbook)

    const mergeTranslation = (question: Record<string, any>): any => {
      const newQuestion: any = {}
      Object.keys(question).forEach(colName => {
        if (colName.includes('::')) {
          const [key, lang] = colName.split('::')
          if (!newQuestion[key]) newQuestion[key] = new Array(translated.length).fill(null)
          newQuestion[key][langs.indexOf(lang)] = question[colName]
        } else {
          newQuestion[colName] = question[colName]
        }
      })
      return newQuestion
    }
    const survey: Kobo.Form.Question[] = surveyRaw.map(mergeTranslation)
    const choices: Kobo.Form.Choice[] = choicesRaw.map(mergeTranslation)

    return {
      choices: choices.length ? choices : undefined,
      schema: settings.form_id || '1',
      settings,
      survey,
      translated: translated as any,
      translations: langs,
    }
  }

  private static getTranslations = (workbook: xlsx.WorkBook) => {
    const headersRow = xlsx.utils.sheet_to_json<Record<string, any>>(workbook.Sheets['survey'], {
      header: 1,
      range: 0,
    })[0] as string[]
    const translated = new Set<string>()
    const langs = new Set<string>()

    headersRow.forEach(colName => {
      if (colName.includes('::')) {
        const [key, lang] = colName.split('::')
        translated.add(key)
        langs.add(lang)
      }
    })
    return {translated: Array.from(translated), langs: Array.from(langs)}
  }
}
