import {convertNumberIndexToLetter} from '@infoportal/common'
import XlsxPopulate from 'xlsx-populate'
import {PrismaClient} from '@prisma/client'
import {appConf} from '../../core/conf/AppConf.js'
import {Kobo} from 'kobo-sdk'
import {KoboFormService} from './KoboFormService'
import {fnSwitch, Obj, seq} from '@axanc/ts-utils'
import {format} from 'date-fns'
import {Api} from '@infoportal/api-sdk'
import {app} from '../../index'
import {FormService} from '../form/FormService'

/** @deprecated??*/
export class KoboToXLS {
  constructor(
    private prisma: PrismaClient,
    private form = new FormService(prisma),
    private koboForm = new KoboFormService(prisma),
    private log = app.logger('KoboToXLS'),
  ) {}

  readonly generateXLSFromAnswers = async ({
    fileName,
    formId,
    data,
    langIndex,
    password,
  }: {
    fileName: string
    formId: Api.FormId
    data: Api.Submission[]
    langIndex?: number
    password?: string
  }) => {
    const koboQuestionType: Kobo.Form.QuestionType[] = [
      'text',
      'start',
      'end',
      'integer',
      'select_one',
      'select_multiple',
      'date',
    ]
    const koboFormDetails = await this.form.getSchema({formId})
    if (!koboFormDetails) return

    const translated = langIndex !== undefined ? await this.translateForm({formId, langIndex, data}) : data
    if (!translated) return

    const flatTranslated = translated.map(({answers, ...meta}) => ({...meta, ...answers}))
    const columns = (() => {
      const metaColumns: (keyof Api.Submission.Meta)[] = ['id', 'submissionTime', 'version']
      const schemaColumns = koboFormDetails.survey
        .filter(_ => koboQuestionType.includes(_.type))
        .map(_ =>
          langIndex !== undefined && _.label ? (_.label[langIndex]?.replace(/(<([^>]+)>)/gi, '') ?? _.name) : _.name,
        )
      return [...metaColumns, ...schemaColumns]
    })()
    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet('Sheet1')
    sheet.cell('A1').value([columns] as any)
    sheet.cell('A2').value(flatTranslated.map(a => columns.map(_ => (a as any)[_!])) as any)

    sheet.freezePanes(2, 1)
    // const ['start', 'end', 'su']
    sheet.column('A').width(11)
    sheet.column('B').width(11)
    sheet.row(1).style({
      bold: true,
      fill: 'f2f2f2',
      fontColor: '6e7781',
    })

    workbook.toFileAsync(appConf.rootProjectDir + `/${fileName}.xlsx`, {password})
  }

  private readonly styleDateColumn = (allColumns: string[], columnName: string) => {
    const findColumnByName = (name: string) => convertNumberIndexToLetter(Object.keys(allColumns).indexOf(name))
  }

  readonly translateForm = async ({
    formId,
    langIndex,
    data,
  }: {
    formId: Api.FormId
    langIndex: number
    data: Api.Submission[]
  }) => {
    const koboQuestionType: Kobo.Form.QuestionType[] = [
      'text',
      'start',
      'end',
      'integer',
      'select_one',
      'select_multiple',
      'date',
    ]
    const flatAnswers = data.map(({answers, ...meta}) => ({...meta, ...answers}))
    const schema = await this.form.getSchema({formId})
    if (!schema) {
      this.log.warn(`[translateForm] Missing ${formId}`)
      return
    }
    const indexLabel = seq(schema.survey)
      .filter(_ => !!_ && koboQuestionType.includes(_.type))
      .reduceObject<Record<string, Api.Form.Question>>(_ => [_.name, _])
    const indexOptionsLabels = seq(schema.choices).reduceObject<Record<string, undefined | string>>(_ => [
      _.name,
      _.label?.[langIndex],
    ])
    return flatAnswers.map(d => {
      const translated = {} as Api.Submission
      Obj.keys(d).forEach(k => {
        const translatedKey = indexLabel[k]?.label?.[langIndex] ?? k
        const translatedValue = (() => {
          if (k === 'submissionTime') {
            return format(d[k], 'yyyy-MM-dd')
          }
          return fnSwitch(
            indexLabel[k]?.type,
            {
              select_multiple: () =>
                (d[k] as string)
                  ?.split(' ')
                  .map((_: any) => indexOptionsLabels[_])
                  .join('|'),
              start: () => format(d[k] as Date, 'yyyy-MM-dd'),
              end: () => format(d[k] as Date, 'yyyy-MM-dd'),
            },
            _ => indexOptionsLabels[d[k] as string] ?? d[k],
          )
        })()
        ;(translated as any)[translatedKey.replace(/(<([^>]+)>)/gi, '')] = translatedValue
      })
      return translated
    })
  }
}
