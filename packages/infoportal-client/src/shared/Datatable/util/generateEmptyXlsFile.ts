import * as ExcelJS from 'exceljs'
import {Utils} from '@/utils/utils'
import {Kobo} from 'kobo-sdk/Kobo'
import Question = Kobo.Form.Question
import Choice = Kobo.Form.Choice
import {KoboSchemaHelper} from 'infoportal-common'

export const generateEmptyXlsTemplate = async (
  schemaBundle: KoboSchemaHelper.Bundle,
  fileName: string
): Promise<void> => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Template')

  const questions = schemaBundle.schema.content.survey.filter(
    (question: Question) =>
      !['begin_group', 'end_group', 'begin_repeat', 'end_repeat'].includes(question.type)
  )

  questions.forEach((question, index) => {
    const columnIndex = index + 1
    const columnHeader = question.$xpath || question.name
    const column = worksheet.getColumn(columnIndex)


    column.header = columnHeader
    column.width = 20

    if (question.type === 'select_one' || question.type === 'select_one_from_file') {
      const choices = schemaBundle.helper.choicesIndex[question.select_from_list_name || ''] || []
      const dropdownValues = choices
        .map((choice: Choice) => choice.name.replace(/"/g, '""'))
        .join(',')

      if (dropdownValues.length <= 255) {
        for (let rowIndex = 2; rowIndex <= 102; rowIndex++) {
          worksheet.getCell(rowIndex, columnIndex).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [`"${dropdownValues}"`],
            showErrorMessage: true,
            error: 'Invalid value. Please select from the dropdown list.',
          }
        }
      } else {
        console.warn(
          `Dropdown values for column "${columnHeader}" exceed 255 characters and cannot be applied.`
        )
      }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  Utils.downloadBufferAsFile(buffer as any, `${fileName}.xlsx`)
}