import xlsx from 'xlsx'
import {Kobo} from 'kobo-sdk'
import {promisify} from 'util'
import {execFile} from 'child_process'

const execFilePromise = promisify(execFile)

export type ValidationResult = {
  status: 'error' | 'warning' | 'success'
  code: number
  message: string
  warnings?: string[]
  schema?: Kobo.Form['content']
}

export class XlsFormParser {
  constructor() {}

  static readonly validateAndParse = async (filePath: string): Promise<ValidationResult> => {
    type PyxResponse = Pick<ValidationResult, 'code' | 'message' | 'warnings'>
    const {stdout, stderr} = await execFilePromise('python3', ['-m', 'pyxform.xls2xform', filePath, '--json'])
    const err: PyxResponse = stderr !== '' ? JSON.parse(stderr) : undefined
    const out: PyxResponse = stdout !== '' ? JSON.parse(stdout) : undefined
    const status = out ? 'success' : err.code < 200 ? 'warning' : 'error'
    if (status === 'error') {
      return {status, ...err}
    }
    const schema = this.parse(filePath)
    return {...out, status, schema}
  }

  static readonly parse = (filePath: string): Kobo.Form['content'] => {
    const workbook = xlsx.readFile(filePath)
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
