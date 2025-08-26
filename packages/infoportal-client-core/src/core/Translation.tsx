import React from 'react'

export type Translation = typeof defaultTranslation

export type TranslationContext = {
  m: typeof defaultTranslation
  formatLargeNumber: (_: number, options?: Intl.NumberFormatOptions) => string
}

const Context = React.createContext<TranslationContext>({} as any)

const defaultTranslation = {
  select_selectAll: 'selectAll',
  select_blankOption: '<i>BLANK</i>',
  datepicker_start: 'Start',
  datepicker_end: 'End',
  stepper_next: 'Next',
  stepper_previous: 'Previous',
  chart_noDataAtm: 'No data at the moment.',
  chart_comparedToTotalAnswers: 'Compared to total answers',
}

export const TranslationProvider: React.FC<
  Partial<TranslationContext> & {
    children?: React.ReactNode
  }
> = ({children, m = defaultTranslation, formatLargeNumber = _ => (_ ? '' + _ : '')}) => {
  return <Context.Provider value={{m, formatLargeNumber}}>{children}</Context.Provider>
}

export const useI18n = () => React.useContext(Context) ?? defaultTranslation
