import React, {ReactNode} from 'react'
import {Obj} from '@axanc/ts-utils'
import {Column, BlankValue, Option, Row} from '@/core/types'

export class Utils {
  static readonly localStorageKey = {
    column: 'database-columns-',
    filters: 'datatable-filters-',
  }
  // static readonly FILTER_BLANK_TEXT = 'FILTER_BLANK_TEXT_someRandomTextToAvoidCollision_9fa3'
  static readonly buildColumns = <T extends Row = Row>(_: Column.Props<T>[]) => _

  static readonly blank: BlankValue = ''
  static readonly blankLabel = (<i>BLANK</i>)
  static readonly blankOption: Option = {value: Utils.blank, label: Utils.blankLabel}

  static readonly buildOptions = (opt: string[], addBlank?: boolean): Option[] => {
    return [...(addBlank ? [Utils.blankOption] : []), ...opt.map(Utils.buildOption)]
  }

  static readonly buildOption = (_: string): Option => {
    return {value: _, label: _}
  }

  static readonly buildOptionByEnum = (_: Record<string, string>): Option[] => {
    return Obj.entries(_).map(([value, label]) => ({value, label}))
  }

  static readonly buildCustomOption = (_: string, label?: ReactNode): Option => {
    return {value: _, label: label ?? _}
  }
}
