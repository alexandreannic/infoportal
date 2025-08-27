import React from 'react'

export type DatatableTranslation = typeof defaultTranslation

export type DatatableTranslationProps = {
  m: typeof defaultTranslation
  formatLargeNumber: (_: number, options?: Intl.NumberFormatOptions) => string
}

const defaultTranslation = {
  clearFilter: 'Clear filters',
  type: 'Type',
  remove: 'Remove',
  add: 'Add',
  save: 'Save',
  hidden: 'Hidden',
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
  filter: 'Filter',
}

const defaultFormatLargeNumber = (_: number) => (_ ? '' + _ : '')

const Context = React.createContext<DatatableTranslationProps>({
  m: defaultTranslation,
  formatLargeNumber: defaultFormatLargeNumber,
})

export const DatatableTranslationProvider: React.FC<
  Partial<DatatableTranslationProps> & {
    children?: React.ReactNode
  }
> = ({children, m = defaultTranslation, formatLargeNumber = defaultFormatLargeNumber}) => {
  return <Context.Provider value={{m, formatLargeNumber}}>{children}</Context.Provider>
}

export const useI18n = () => React.useContext(Context)
