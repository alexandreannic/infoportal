import React, {ReactNode} from 'react'
import {BoxProps, SxProps, Theme} from '@mui/material'
import {Action} from '.'
import {DatatableGlobalStyles} from './DatatableStyles'
import {CellSelectionMode} from './core/types'

export type DatatableConfigProps = {
  m: (typeof defaultConfig)['m']
  muiIcons: (typeof defaultConfig)['muiIcons']
  formatLargeNumber: (_: number, options?: Intl.NumberFormatOptions) => string
  defaultProps?: {
    // Core
    id?: string
    getRowKey?: (_: any) => string
    onEvent?: (_: Action<any>) => void
    title?: string
    showRowIndex?: boolean

    // Layout
    rowHeight?: number
    header?: ReactNode
    contentProps?: BoxProps
    renderEmptyState?: ReactNode
    sx?: SxProps<Theme>

    module?: {
      export?: {
        enabled: boolean
      }
      columnsToggle?: {
        enabled: boolean
        disableAutoSave?: boolean
        hidden: string[]
      }
      cellSelection?: {
        enabled: true
        mode?: CellSelectionMode
        renderComponentOnRowSelected?: ({rowIds}: {rowIds: string[]}) => ReactNode
      }
      columnsResize?: {
        enabled: boolean
      }
    }
  }
}

const defaultConfig = {
  m: {
    clearFilter: 'Clear filters',
    type: 'Type',
    remove: 'Remove',
    add: 'Add',
    save: 'Save',
    hidden: 'Hidden',
    visible: 'Visible',
    copied: 'Copied',
    group: 'Group',
    question: 'Question',
    sort: 'Sort',
    idFilterInfo: 'You can filter by multiple IDs by separating each with a space',
    idFilterPlaceholder: 'ID1 ID2 ID3 [...]',
    selectAll: 'Select all',
    close: 'Close',
    includeColumns: `With column's name`,
    filterPlaceholder: 'Filter...',
    filterBlanks: 'Filter blanks',
    count: 'Count',
    sum: 'Sum',
    average: 'Average',
    min: 'Min',
    max: 'Max',
    currentlyDisplayed: 'columns displayed',
    filter: 'Filter',
    refresh: 'Refresh',
    hardRefresh: 'Hard refresh',
    globalError: `If the problem persist, please contact support and include the snippet below.`,
  },
  muiIcons: {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info',
    disabled: 'disabled',
  },
  formatLargeNumber: (_: number) => (_ ? '' + _ : ''),
}

const Context = React.createContext<DatatableConfigProps>(defaultConfig)

export const DatatableConfig: React.FC<
  Partial<DatatableConfigProps> & {
  children?: React.ReactNode
}
> = ({defaultProps = {}, children, m, muiIcons, formatLargeNumber = defaultConfig.formatLargeNumber}) => {
  return (
    <Context.Provider
      value={{
        m: {...defaultConfig.m, ...m},
        defaultProps,
        muiIcons: {...defaultConfig.muiIcons, ...muiIcons},
        formatLargeNumber,
      }}
    >
      <DatatableGlobalStyles/>
      {children}
    </Context.Provider>
  )
}

export const useConfig = () => React.useContext(Context)
