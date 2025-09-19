import xlsx from 'xlsx'
import {Kobo} from 'kobo-sdk'
import {promisify} from 'util'
import {execFile} from 'child_process'
import {Ip} from 'infoportal-api-sdk'

const execFilePromise = promisify(execFile)

export class XlsFormParser {
  constructor() {}

  private static readonly generateXpath = (questions: Kobo.Form.Question[]): Kobo.Form.Question[] => {
    const path: string[] = []
    return questions.map(_ => {
      if (_.type === 'end_group' || _.type === 'end_repeat') {
        path.pop()
        return _
      }
      _.$xpath = [...path, _.name].join('/')
      if (_.type === 'begin_group' || _.type === 'begin_repeat') {
        path.push(_.name)
      }
      return _
    })
  }

  private static clearSelect = (question: Kobo.Form.Question): Kobo.Form.Question => {
    const types: Kobo.Form.QuestionType[] = ['select_multiple', 'select_one', 'select_one']
    if (types.some(_ => question.type.startsWith(_))) {
      const [type, list] = question.type.split(' ')
      question.select_from_list_name = list
      question.type = type as any
    }
    return question
  }

  static readonly validateAndParse = async (filePath: string): Promise<Ip.Form.Schema.Validation> => {
    type PyxResponse = Pick<Ip.Form.Schema.Validation, 'code' | 'message' | 'warnings'>
    const {stdout, stderr} = await execFilePromise('python3', ['-m', 'pyxform.xls2xform', filePath, '--json'])
    const err: PyxResponse = stderr !== '' ? JSON.parse(stderr) : undefined
    const out: PyxResponse = stdout !== '' ? JSON.parse(stdout) : undefined
    const output = {...err, ...out}
    const status = output.code === 100 ? 'success' : err.code < 200 ? 'warning' : 'error'
    if (status === 'error') {
      return {status, ...output}
    }
    const schema = this.parse(filePath)
    return {...output, status, schema}
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
    const survey: Kobo.Form.Question[] = XlsFormParser.generateXpath(
      surveyRaw.map(mergeTranslation).map(XlsFormParser.clearSelect),
    )
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
