import {endOfDay, endOfMonth, startOfMonth} from 'date-fns'

export interface Period {
  start: Date
  end: Date
}

export class PeriodHelper {
  static readonly isDateIn = (period: Partial<Period>, date?: Date) => {
    if (date) {
      if (period?.start && period.start.getTime() > date.getTime()) return false
      if (period?.end && endOfDay(period.end).getTime() < date.getTime()) return false
      return true
    }
    return !period.start && !period.end
  }

  static readonly fromYYYYMM = (yyyyMM: string): Period => {
    const [year, month] = yyyyMM.split('-')
    return {
      start: startOfMonth(new Date(+year, +month - 1, 1)),
      end: endOfDay(endOfMonth(new Date(+year, +month - 1, 1))),
      // start: new Date(parseInt(year), parseInt(month) - 1),
      // end: subDays(new Date(parseInt(year), parseInt(month)), 1),
    }
  }
}
