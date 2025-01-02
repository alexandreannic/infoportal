import {convertNumberIndexToLetter} from 'infoportal-common'
import XlsxPopulate from 'xlsx-populate'
import {PrismaClient} from '@prisma/client'
import {DbKoboAnswer, KoboService} from './KoboService'
import {appConf} from '../../core/conf/AppConf'
import {Kobo} from 'kobo-sdk'
import {KoboSubmissionMetaData} from 'infoportal-common'

/** @deprecated??*/
export class KoboToXLS {

  constructor(
    private prisma: PrismaClient,
    private service: KoboService = new KoboService(prisma),
  ) {

  }

  readonly generateXLSFromAnswers = async ({
    fileName,
    formId,
    data,
    langIndex,
    password,
  }: {
    fileName: string
    formId: Kobo.FormId,
    data: DbKoboAnswer[],
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
    const koboFormDetails = await this.service.getSchema({formId})
    const translated = langIndex !== undefined ? await this.service.translateForm({formId, langIndex, data}) : data
    const flatTranslated = translated.map(({answers, ...meta}) => ({...meta, ...answers}))
    const columns = (() => {
      const metaColumns: (keyof KoboSubmissionMetaData)[] = ['id', 'submissionTime', 'version']
      const schemaColumns = koboFormDetails.content.survey.filter(_ => koboQuestionType.includes(_.type))
        .map(_ => langIndex !== undefined && _.label
          ? _.label[langIndex]?.replace(/(<([^>]+)>)/gi, '') ?? _.name
          : _.name)
      return [...metaColumns, ...schemaColumns]
    })()
    const workbook = await XlsxPopulate.fromBlankAsync()
    const sheet = workbook.sheet('Sheet1')
    sheet.cell('A1').value([columns] as any)
    sheet.cell('A2').value(flatTranslated.map(a =>
      columns.map(_ => (a as any)[_!])
    ) as any)


    sheet.freezePanes(2, 1)
    // const ['start', 'end', 'su']
    sheet.column('A').width(11)
    sheet.column('B').width(11)
    sheet.row(1).style({
      'bold': true,
      'fill': 'f2f2f2',
      'fontColor': '6e7781',
    })

    workbook.toFileAsync(appConf.rootProjectDir + `/${fileName}.xlsx`, {password})
  }

  private readonly styleDateColumn = (allColumns: string[], columnName: string) => {
    const findColumnByName = (name: string) => convertNumberIndexToLetter(Object.keys(allColumns).indexOf(name))
  }
}
