import {
  DatatableBlankValue,
  DatatableColumn,
  DatatableOptions,
  DatatableRow,
} from '@/shared/Datatable/util/datatableType'
import React, {ReactNode} from 'react'
import {Obj} from '@axanc/ts-utils'

export class DatatableUtils {
  static readonly localStorageKey = {
    column: 'database-columns-',
    filters: 'datatable-filters-',
  }
  // static readonly FILTER_BLANK_TEXT = 'FILTER_BLANK_TEXT_someRandomTextToAvoidCollision_9fa3'
  static readonly buildColumns = <T extends DatatableRow = DatatableRow>(_: DatatableColumn.Props<T>[]) => _

  static readonly blank: DatatableBlankValue = ''
  static readonly blankLabel = (<i>BLANK</i>)
  static readonly blankOption: DatatableOptions = {value: DatatableUtils.blank, label: DatatableUtils.blankLabel}

  static readonly buildOptions = (opt: string[], addBlank?: boolean): DatatableOptions[] => {
    return [...(addBlank ? [DatatableUtils.blankOption] : []), ...opt.map(DatatableUtils.buildOption)]
  }

  static readonly buildOption = (_: string): DatatableOptions => {
    return {value: _, label: _}
  }

  static readonly buildOptionByEnum = (_: Record<string, string>): DatatableOptions[] => {
    return Obj.entries(_).map(([value, label]) => ({value, label}))
  }

  static readonly buildCustomOption = (_: string, label?: ReactNode): DatatableOptions => {
    return {value: _, label: label ?? _}
  }
}

type SchemaItem = Readonly<{
  readonly id: string
  readonly type: string
}>
