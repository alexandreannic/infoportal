import React, {ReactNode} from 'react'
import {DatatableGlobalStyles} from '@/DatatableStyles'

export type DatatableTranslationProps = typeof defaultConfig

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
  },
  muiIcons: {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info',
    disabled: 'disabled',
  },
  formatLargeNumber: (_: number, options?: Intl.NumberFormatOptions) => (_ ? '' + _ : ''),
  globalErrorMessage: `If the problem persist, please contact support and include the snippet below.` as ReactNode,
}

const Context = React.createContext<DatatableTranslationProps>(defaultConfig)

export const DatatableConfig: React.FC<
  Partial<DatatableTranslationProps> & {
    children?: React.ReactNode
  }
> = ({
  children,
  globalErrorMessage = defaultConfig.globalErrorMessage,
  m = defaultConfig.m,
  muiIcons = defaultConfig.muiIcons,
  formatLargeNumber = defaultConfig.formatLargeNumber,
}) => {
  return (
    <Context.Provider value={{m, globalErrorMessage, muiIcons, formatLargeNumber}}>
      <DatatableGlobalStyles />
      {children}
    </Context.Provider>
  )
}

export const useConfig = () => React.useContext(Context)
