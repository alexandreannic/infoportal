import React from 'react'

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
  },
  muiIcons: {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info',
    disabled: 'disabled',
  },
  formatLargeNumber: (_: number, options?: Intl.NumberFormatOptions) => (_ ? '' + _ : ''),
}

const Context = React.createContext<DatatableTranslationProps>(defaultConfig)

export const DatatableConfig: React.FC<
  Partial<DatatableTranslationProps> & {
    children?: React.ReactNode
  }
> = ({
  children,
  m = defaultConfig.m,
  muiIcons = defaultConfig.muiIcons,
  formatLargeNumber = defaultConfig.formatLargeNumber,
}) => {
  return <Context.Provider value={{m, muiIcons, formatLargeNumber}}>{children}</Context.Provider>
}

export const useConfig = () => React.useContext(Context)
