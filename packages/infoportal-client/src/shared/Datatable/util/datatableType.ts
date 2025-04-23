import React, {CSSProperties, ReactNode} from 'react'
import {BoxProps} from '@mui/material'
import {KeyOf} from 'infoportal-common'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {DatatableXlsGenerator} from '@/shared/Datatable/util/generateXLSFile'

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

export type DatatablePropertyType = keyof DatatableFilterTypeMapping

export type OrderBy = 'asc' | 'desc'

export interface DatatableOptions {
  value: string
  // label?: string
  // Should be string to filter options in filters popup
  label?: ReactNode
}

export interface DatatableSearch<T = any> {
  limit: number
  offset: number
  sortBy?: string
  orderBy?: OrderBy
}

export type HeaderParams<T extends DatatableRow> = {
  data: T[]
  filteredData: T[]
  filteredAndSortedData: T[]
}

export type DatatableRow = Record<string, any> // Record<string, any/* string | number[] | string[] | Date | number | undefined*/>
export interface DatatableTableProps<T extends DatatableRow, K extends string = string>
  extends Omit<BoxProps, 'onSelect'> {
  header?: ReactNode | ((_: HeaderParams<T>) => ReactNode)
  id: string
  loading?: boolean
  total?: number
  contentProps?: BoxProps
  /** Find a way to enforce k and v typing*/
  defaultFilters?: Record<K, DatatableFilterValue>
  defaultLimit?: number
  data?: T[]
  title?: string
  getRenderRowKey?: (_: T, index: number) => string
  rowStyle?: (_: T) => CSSProperties
  onClickRows?: (_: T, event: React.MouseEvent<HTMLElement>) => void
  onResizeColumn?: (_: K, size: number) => void
  rowsPerPageOptions?: number[]
  columns: DatatableColumn.Props<T, K>[]
  hideColumnsToggle?: boolean
  hidePagination?: boolean
  showExportBtn?: boolean
  exportAdditionalSheets?: (filteredAndSortedData: T[]) => DatatableXlsGenerator.Params[]
  renderEmptyState?: ReactNode
  onFiltersChange?: (_: Record<KeyOf<T>, DatatableFilterValue>) => void
  onDataChange?: (_: {
    data?: T[]
    filteredData?: T[]
    filteredAndSortedData?: T[]
    filteredSortedAndPaginatedData?: ApiPaginate<T>
  }) => void
  sort?: {
    sortableColumns?: string[]
    sortBy?: KeyOf<T>
    orderBy?: OrderBy
    onSortChange: (_: {sortBy?: KeyOf<T>; orderBy?: OrderBy}) => void
  }
  columnsToggle?: {
    defaultHidden?: K[]
    hidden?: K[]
    onHide?: (_: K[]) => void
    hideButton?: boolean
    disableAutoSave?: boolean
  }
  select?: {
    onSelect: (_: string[]) => void
    getId: (_: T) => string
    selectActions?: ReactNode
  }
}

export namespace DatatableColumn {
  export type Value = string[] | string | undefined | Date | number | null | boolean

  export type RenderT<T extends Value, TOption = any> = {
    label: ReactNode
    option?: TOption
    value: T
    tooltip?: string | undefined | null
    export?: null | string | number | undefined | Date
  }

  export interface Base<T extends DatatableRow, K extends string = string> {
    id: K
    noSort?: boolean
    width?: number
    head?: string
    group?: string
    groupLabel?: string
    noCsvExport?: boolean
    align?: 'center' | 'right'
    onClick?: (_: T) => void
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
    export type RenderQuick<T extends DatatableRow> = (_: T) => string | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<string | undefined, ReactNode>
    export type BaseType = {
      options?: () => DatatableOptions[]
      type: 'select_one'
    }
    export type TypeInner<T extends DatatableRow> = BaseType & {
      render: Render<T>
    } & {
      noCsvExport?: false
    }
    export type TypeQuick<T extends DatatableRow> = BaseType & {
      renderQuick: RenderQuick<T>
    }
    export type TypeOuter<T extends DatatableRow> = TypeInner<T> | TypeQuick<T>
  }

  export namespace SelectMultiple {
    export type RenderQuick<T extends DatatableRow> = (_: T) => string[] | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<string[] | undefined, ReactNode>
    export type BaseType = {
      options: () => DatatableOptions[]
      type: 'select_multiple'
    }
    export type TypeInner<T extends DatatableRow> = BaseType & {
      render: Render<T>
    }
    export type TypeQuick<T extends DatatableRow> = BaseType & {
      renderQuick: RenderQuick<T>
    }
    export type TypeOuter<T extends DatatableRow> = TypeInner<T> | TypeQuick<T>
  }

  export namespace Undefined {
    export type RenderQuick<T extends DatatableRow> = (_: T) => ReactNode
    export type Render<T extends DatatableRow> = (_: T) => RenderT<undefined>
    export type BaseType = {
      type?: undefined
    }
    export type TypeInner<T extends DatatableRow> = BaseType & {
      render: Render<T>
    }
    export type TypeQuick<T extends DatatableRow> = BaseType & {
      renderQuick: RenderQuick<T>
    }
    export type TypeOuter<T extends DatatableRow> = TypeInner<T> | TypeQuick<T>
  }

  export namespace Text {
    export type RenderQuick<T extends DatatableRow> = (_: T) => string | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<string | undefined>
    export type BaseType = {
      type: 'string' | 'id'
    }
    export type TypeInner<T extends DatatableRow> = BaseType & {
      render: Render<T>
    }
    export type TypeQuick<T extends DatatableRow> = BaseType & {
      renderQuick: RenderQuick<T>
    }
    export type TypeOuter<T extends DatatableRow> = TypeInner<T> | TypeQuick<T>
  }

  export namespace Date {
    export type RenderQuick<T extends DatatableRow> = (_: T) => string | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<Date | undefined>
    export type BaseType = {
      type: 'date'
    }
    export type TypeInner<T extends DatatableRow> = BaseType & {
      render: Render<T>
    }
    export type TypeQuick<T extends DatatableRow> = BaseType & {
      renderQuick: RenderQuick<T>
    }
    export type TypeOuter<T extends DatatableRow> = TypeInner<T> | TypeQuick<T>
  }

  export namespace Number {
    export type RenderQuick<T extends DatatableRow> = (_: T) => number | undefined
    export type Render<T extends DatatableRow> = (_: T) => RenderT<number | undefined>
    export type BaseType = {
      type: 'number'
    }
    export type TypeInner<T extends DatatableRow> = BaseType & {
      render: Render<T>
    }
    export type TypeQuick<T extends DatatableRow> = BaseType & {
      renderQuick: RenderQuick<T>
    }
    export type TypeOuter<T extends DatatableRow> = TypeInner<T> | TypeQuick<T>
  }

  export type InnerProps<T extends DatatableRow, K extends string = string> = Base<T, K> &
    (
      | Text.TypeInner<T>
      | SelectOne.TypeInner<T>
      | Date.TypeInner<T>
      | Number.TypeInner<T>
      | SelectMultiple.TypeInner<T>
      | Undefined.TypeInner<T>
    )
  export type Props<T extends DatatableRow, K extends string = string> = Base<T, K> &
    (
      | Text.TypeOuter<T>
      | SelectOne.TypeOuter<T>
      | Date.TypeOuter<T>
      | Number.TypeOuter<T>
      | SelectMultiple.TypeOuter<T>
      | Undefined.TypeOuter<T>
    )
  export type QuickProps<T extends DatatableRow, K extends string = string> = Base<T, K> &
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

export type DatatableFilterValue = DatatableFilterTypeMapping[keyof DatatableFilterTypeMapping]
export type DatatableBlankValue = ''
