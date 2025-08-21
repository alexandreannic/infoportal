import {BoxProps, SxProps, Theme} from '@mui/material'
import React, {CSSProperties, ReactNode} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {HeaderParams, OrderBy} from '@/shared/Datatable/util/datatableType.js'
import {DatatableAction, DatatableState} from '@/shared/Datatable3/state/reducer.js'

export namespace Datatable {
  export type Row = Record<string, any>

  export type Filters<T extends Row> = Partial<Record<KeyOf<T>, DatatableFilterValue>>

  export type SortBy = {column: string; orderBy: OrderBy}

  /** ${colid}_${rowId} */
  export type Key = string
  export const buildKey = <T extends Datatable.Row>({
    row,
    colId,
    getRowKey,
  }: {
    row: T
    colId: string
    getRowKey: Props<T>['getRowKey']
  }) => {
    return getRowKey(row) + '_' + colId
  }
  export const buildKey2 = <T extends Datatable.Row>({rowId, colId}: {rowId: string; colId: string}) => {
    return rowId + '_' + colId
  }

  export type VirtualCell = {
    // value: any
    label: ReactNode
    tooltip?: string
    style?: CSSProperties
    className?: string
  }

  export type Event<T extends Datatable.Row> = DatatableAction<T>

  export type State<T extends Row> = DatatableState<T>

  export type DatatableFilterTypeMapping = {
    id: string
    date: [Date | undefined, Date | undefined]
    number: [number | undefined, number | undefined]
    string:
      | {
          filterBlank?: boolean
          value?: string
        }
      | undefined
    select_one: string
    select_multiple: string[]
  }

  export type DatatableFilterValue = DatatableFilterTypeMapping[keyof DatatableFilterTypeMapping]

  export interface Props<T extends Row, K extends string = string> {
    // Core
    id: string
    columns: Column.Props<T, K>[]
    data?: T[]
    loading?: boolean
    getRowKey: (_: T) => string
    getRowChangeTracker?: (_: T) => string
    onEvent: () => void
    title?: string
    showRowIndex?: boolean

    // Initialization
    /** Find a way to enforce k and v typing*/
    defaultFilters?: Record<K, DatatableFilterValue>
    defaultLimit?: number
    defaultSort?: {byColumn: KeyOf<T>; order: OrderBy}
    rowsPerPageOptions?: number[]

    // Layout
    rowStyle?: (_: T) => CSSProperties
    header?: ReactNode | ((_: HeaderParams<T>) => ReactNode)
    contentProps?: BoxProps
    renderEmptyState?: ReactNode
    sx?: SxProps<Theme>

    modules?: {
      export?: boolean
      columnsToggle?: boolean
      pagination?: boolean
    }
  }

  export namespace Column {
    export type Option = {
      value: string
      // label?: string
      // Should be string to filter options in filters popup
      label?: ReactNode
    }

    export type Value = string[] | string | undefined | Date | number | null | boolean

    export type RenderT<T extends Value, TOption = any> = {
      label: ReactNode
      option?: TOption
      value: T
      tooltip?: string | undefined | null
      export?: null | string | number | undefined | Date
    }

    export interface Base<T extends Row, K extends string = string> {
      id: K
      width?: number
      head?: string
      group?: {id: string; label: string; color?: string}
      noSort?: boolean
      noCsvExport?: boolean
      noResize?: boolean
      align?: 'center' | 'right'
      onClick?: (_: {data: T; rowIndex: number; event: React.MouseEvent<HTMLElement>}) => void
      hidden?: boolean
      style?: (_: T) => CSSProperties
      styleHead?: CSSProperties
      classHead?: string
      typeIcon?: ReactNode
      typeLabel?: string
      subHeader?: ReactNode
      className?: string | ((_: T) => string | undefined)
      stickyEnd?: boolean
    }

    export namespace SelectOne {
      export type RenderQuick<T extends Row> = (_: T) => string | undefined | null
      export type Render<T extends Row> = (_: T) => RenderT<string | undefined | null, ReactNode>
      export type BaseType = {
        options?: () => Option[]
        type: 'select_one'
      }
      export type TypeInner<T extends Row> = BaseType & {
        render: Render<T>
      } & {
        noCsvExport?: false
      }
      export type TypeQuick<T extends Row> = BaseType & {
        renderQuick: RenderQuick<T>
      }
      export type TypeOuter<T extends Row> = TypeInner<T> | TypeQuick<T>
    }

    export namespace SelectMultiple {
      export type RenderQuick<T extends Row> = (_: T) => string[] | undefined
      export type Render<T extends Row> = (_: T) => RenderT<string[] | undefined, ReactNode>
      export type BaseType = {
        options: () => Option[]
        type: 'select_multiple'
      }
      export type TypeInner<T extends Row> = BaseType & {
        render: Render<T>
      }
      export type TypeQuick<T extends Row> = BaseType & {
        renderQuick: RenderQuick<T>
      }
      export type TypeOuter<T extends Row> = TypeInner<T> | TypeQuick<T>
    }

    export namespace Undefined {
      export type RenderQuick<T extends Row> = (_: T) => ReactNode
      export type Render<T extends Row> = (_: T) => RenderT<undefined>
      export type BaseType = {
        type?: undefined
      }
      export type TypeInner<T extends Row> = BaseType & {
        render: Render<T>
      }
      export type TypeQuick<T extends Row> = BaseType & {
        renderQuick: RenderQuick<T>
      }
      export type TypeOuter<T extends Row> = TypeInner<T> | TypeQuick<T>
    }

    export namespace Text {
      export type RenderQuick<T extends Row> = (_: T) => string | undefined | null
      export type Render<T extends Row> = (_: T) => RenderT<string | undefined | null>
      export type BaseType = {
        type: 'string' | 'id'
      }
      export type TypeInner<T extends Row> = BaseType & {
        render: Render<T>
      }
      export type TypeQuick<T extends Row> = BaseType & {
        renderQuick: RenderQuick<T>
      }
      export type TypeOuter<T extends Row> = TypeInner<T> | TypeQuick<T>
    }

    export namespace Date {
      export type RenderQuick<T extends Row> = (_: T) => string | undefined | null
      export type Render<T extends Row> = (_: T) => RenderT<Date | undefined | null>
      export type BaseType = {
        type: 'date'
      }
      export type TypeInner<T extends Row> = BaseType & {
        render: Render<T>
      }
      export type TypeQuick<T extends Row> = BaseType & {
        renderQuick: RenderQuick<T>
      }
      export type TypeOuter<T extends Row> = TypeInner<T> | TypeQuick<T>
    }

    export namespace Number {
      export type RenderQuick<T extends Row> = (_: T) => number | null | undefined
      export type Render<T extends Row> = (_: T) => RenderT<number | null | undefined>
      export type BaseType = {
        type: 'number'
      }
      export type TypeInner<T extends Row> = BaseType & {
        render: Render<T>
      }
      export type TypeQuick<T extends Row> = BaseType & {
        renderQuick: RenderQuick<T>
      }
      export type TypeOuter<T extends Row> = TypeInner<T> | TypeQuick<T>
    }

    export type InnerProps<T extends Row, K extends string = string> = Base<T, K> &
      (
        | Text.TypeInner<T>
        | SelectOne.TypeInner<T>
        | Date.TypeInner<T>
        | Number.TypeInner<T>
        | SelectMultiple.TypeInner<T>
        | Undefined.TypeInner<T>
      )
    export type Props<T extends Row = Record<string, any>, K extends string = string> = Base<T, K> &
      (
        | Text.TypeOuter<T>
        | SelectOne.TypeOuter<T>
        | Date.TypeOuter<T>
        | Number.TypeOuter<T>
        | SelectMultiple.TypeOuter<T>
        | Undefined.TypeOuter<T>
      )
    export type QuickProps<T extends Row, K extends string = string> = Base<T, K> &
      (
        | Text.TypeQuick<T>
        | SelectOne.TypeQuick<T>
        | Date.TypeQuick<T>
        | Number.TypeQuick<T>
        | SelectMultiple.TypeQuick<T>
        | Undefined.TypeQuick<T>
      )

    export const isQuick = (_: Props<any>): _ is QuickProps<any> => {
      return !!(_ as any).renderQuick
    }
    export const isInner = (_: Props<any>): _ is InnerProps<any> => {
      return !!(_ as any).render
    }
  }
}
