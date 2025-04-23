import {multipleFilters} from 'infoportal-common'
import {Obj, Seq} from '@axanc/ts-utils'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {ReactNode} from 'react'

export namespace DataFilter {
  export type Filter = Record<string, string[] | undefined>

  interface ShapeOption<TOption extends string = string> {
    value: TOption
    label?: ReactNode
  }

  interface ShapeBase<TData, TOption extends string> {
    icon?: string
    // name: string
    addBlankOption?: boolean
    getOptions: (_: () => Seq<TData>) => undefined | ShapeOption<TOption>[]
    label: string
    customFilter?: (filterValue: string[], _: TData) => boolean
    skipOption?: string[]
  }

  export const blank = DatatableUtils.blank
  export const blankOption = DatatableUtils.blankOption

  export interface ShapeMultiple<TData, TOption extends string = string> extends ShapeBase<TData, TOption> {
    multiple: true
    getValue?: (_: TData) => TOption[] | undefined
  }

  export interface ShapeSingle<TData, TOption extends string = string> extends ShapeBase<TData, TOption> {
    multiple?: false
    getValue?: (_: TData) => TOption | undefined
  }

  export const buildOptionsFromObject = (opt: Record<string, string>, addBlank?: boolean): ShapeOption[] => {
    return [...(addBlank ? [blankOption] : []), ...Object.entries(opt).map(([k, v]) => buildOption(k, v))]
  }

  export const buildOptions = (opt: string[], addBlank?: boolean): ShapeOption[] => {
    return [...(addBlank ? [blankOption] : []), ...opt.map((_) => buildOption(_))]
  }

  export const buildOption = (value: string, label?: ReactNode): ShapeOption => {
    return {value: value, label: label ?? value}
  }

  export type Shape<TData, TOption extends string = string> =
    | ShapeMultiple<TData, TOption>
    | ShapeSingle<TData, TOption>

  export const makeShape = <TData extends Record<string, any>>(filters: Record<string, Shape<TData>>) => filters

  export type InferShape<F extends Record<string, Shape<any>>> = Record<keyof F, string[] | undefined>

  export const filterData = <TData, TValue extends string, TName extends string>(
    d: Seq<TData>,
    shapes: Partial<Record<TName, Shape<TData, TValue>>>,
    filters: Record<TName, string[] | undefined>,
  ): Seq<TData> => {
    return multipleFilters(
      d,
      Obj.entries(filters)
        .filter(([k]) => shapes[k] !== undefined)
        .map(([filterName, filterValue]) => {
          if (!filterValue || filterValue.length <= 0) return
          const shape = shapes[filterName]!
          if (shape.customFilter) return (_) => shape.customFilter!(filterValue, _)
          if (!shape.getValue) throw new Error('Either getValue or customFilter should be defined for ' + filterName)
          if (shape.multiple)
            return (_) =>
              !!filterValue.find((f) => {
                const v = shape.getValue!(_)
                return (f === DataFilter.blank && (v ?? []).length === 0) || v?.includes(f as any)
              })
          return (_) => filterValue.includes(shape.getValue!(_) as any)
        }),
    ) as Seq<TData>
  }
}
