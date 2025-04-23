import * as ExcelJS from 'exceljs'
import {Utils} from '@/utils/utils'
import {Kobo} from 'kobo-sdk'
import Question = Kobo.Form.Question
import Choice = Kobo.Form.Choice
import {KoboSchemaHelper} from 'infoportal-common'

export const generateEmptyXlsTemplate = async (
  schemaBundle: KoboSchemaHelper.Bundle,
  fileName: string,
): Promise<void> => {
  const workbook = new ExcelJS.Workbook()
  const templateSheet = workbook.addWorksheet('Template')
  const optionsSheet = workbook.addWorksheet('Options')

  const excludedQuestions = new Set(['begin_group', 'end_group', 'begin_repeat', 'end_repeat'])
  const questions = schemaBundle.schema.content.survey.filter((q: Question) => !excludedQuestions.has(q.type))

  const dropdownRanges: Record<string, string> = {}

  let optionsColumn = 1

  questions.forEach((question, templateColumnIndex) => {
    const columnHeader = (question.$xpath || question.name).split('/').pop() || question.name

    const columnIndex = templateColumnIndex + 1
    const column = templateSheet.getColumn(columnIndex)
    column.header = columnHeader
    column.width = 20

    if (question.type === 'select_one' || question.type === 'select_one_from_file') {
      const choices = schemaBundle.helper.choicesIndex[question.select_from_list_name || ''] || []
      if (!choices.length) return
      const dropdownValues = choices.map((choice: Choice) => choice.name)
      const range = writeDropdownOptions(optionsSheet, columnHeader, dropdownValues, optionsColumn)
      dropdownRanges[columnHeader] = range

      for (let rowIndex = 2; rowIndex <= 102; rowIndex++) {
        templateSheet.getCell(rowIndex, columnIndex).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [range],
          showErrorMessage: true,
          error: 'Invalid value. Please select from the dropdown list.',
        }
      }
      optionsColumn++
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  Utils.downloadBufferAsFile(buffer as any, `${fileName}.xlsx`)
}

const writeDropdownOptions = (
  optionsSheet: ExcelJS.Worksheet,
  header: string,
  values: string[],
  columnIndex: number,
): string => {
  optionsSheet.getCell(1, columnIndex).value = header

  values.forEach((value, rowIndex) => {
    optionsSheet.getCell(rowIndex + 2, columnIndex).value = value
  })

  const startRow = 2
  const endRow = values.length + 1
  return `Options!$${getExcelColumnName(columnIndex)}$${startRow}:$${getExcelColumnName(columnIndex)}$${endRow}`
}

const getExcelColumnName = (col: number): string => {
  let result = ''
  while (col > 0) {
    const remainder = (col - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    col = Math.floor((col - 1) / 26)
  }
  return result
}
