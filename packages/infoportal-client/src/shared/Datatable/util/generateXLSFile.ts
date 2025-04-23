import * as ExcelJS from 'exceljs'
import {Utils} from '@/utils/utils'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {format} from 'date-fns'
import {isValidElement} from 'react'

export namespace DatatableXlsGenerator {
  export interface Params<T = any> {
    sheetName: string
    data: T[]
    schema: {
      head: string
      render: (_: T) => string | number | undefined | Date
    }[]
  }

  export const download = async <T>(fileName: string, params: Params<T>[] | Params<T>) => {
    const workbook = new ExcelJS.Workbook()
    ;[params]
      .flatMap((_) => _)
      .map(({data, schema, sheetName}) => {
        const datatable = workbook.addWorksheet(sheetName)
        const header = datatable.addRow(schema.map((_) => _.head))
        // header.fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        // bgColor: {argb: '#f2f2f2'},
        // }
        data.forEach((d) => {
          datatable.addRow(
            schema.map((_) => {
              return _.render?.(d)
            }),
          )
        })
        datatable.views = [{state: 'frozen', xSplit: 0, ySplit: 1}]
        datatable.columns.forEach((c) => {
          c.width = 10
        })
      })
    const buffer = await workbook.xlsx.writeBuffer()
    Utils.downloadBufferAsFile(buffer as any, fileName + '.xlsx')
  }

  export const columnsToParams = (q: DatatableColumn.Props<any>): Params['schema'][0] => {
    return {
      head: (q.head as string) ?? q.id,
      render: (row: any) => {
        const rendered: {export?: any; value?: any; label?: any} = (() => {
          if (DatatableColumn.isQuick(q)) {
            return {
              export: q.renderQuick(row),
            }
          } else if (DatatableColumn.isInner(q)) return q.render(row)
          return {export: ''}
        })()
        if (rendered.export) return rendered.export
        if (rendered.value instanceof Date && !isNaN(rendered.value as any))
          return format(rendered.value, 'yyyy-MM-dd hh:mm:ss z')
        let value = rendered.label
        if (isValidElement(value)) value = Utils.extractInnerText(value)
        if (q.type !== 'string' && value !== '' && !isNaN(value as any)) value = +(value as number)
        return value as any
      },
    }
  }
}
