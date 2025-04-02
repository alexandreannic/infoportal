import {DrcOffice} from './Drc.js'
import {getOverlapMonths} from '../utils/index.js'
import {differenceInDays} from 'date-fns'

export enum WfpDeduplicationStatus {
  Deduplicated = 'Deduplicated',
  PartiallyDeduplicated = 'PartiallyDeduplicated',
  NotDeduplicated = 'NotDeduplicated',
  Error = 'Error',
}

export enum WfpCategory {
  'CASH-MPA' = 'CASH-MPA',
  'CASH-RENT' = 'CASH-RENT',
  'CASH-WC' = 'CASH-WC',
  'CASH-WE' = 'CASH-WE',
  'CASH-WHA' = 'CASH-WHA',
  'CASH-WNFI' = 'CASH-WNFI',
  'CASH-WU' = 'CASH-WU',
}

export interface WfpDeduplication {
  id: string
  amount: number
  fileName?: string
  office?: DrcOffice
  wfpId: number
  createdAt: Date
  validFrom: Date
  expiry: Date
  beneficiaryId: string
  taxId?: string
  message?: string
  status: WfpDeduplicationStatus
  existingOrga?: string
  existingStart?: Date
  existingEnd?: Date
  existingAmount?: number
  category: WfpCategory
  suggestion: DrcSupportSuggestion
  suggestionDurationInMonths: number
}

export enum DrcSupportSuggestion {
  FullUnAgency = 'FullUnAgency',
  FullNoDuplication = 'FullNoDuplication',
  Partial = 'Partial',
  NoAssistanceFullDuplication = 'NoAssistanceFullDuplication',
  NoAssistanceExactSameTimeframe = 'NoAssistanceExactSameTimeframe',
  NoAssistanceDrcDuplication = 'NoAssistanceDrcDuplication',
  DeduplicationFailed = 'DeduplicationFailed',
}

const unAgencies = ['FAO', 'IOM', 'UNHCR', 'UNICEF', 'WFP']

export const getDrcSuggestion = (
  _: WfpDeduplication,
): {suggestionDurationInMonths: number; suggestion: DrcSupportSuggestion} => {
  const maxAssistance = Math.round(differenceInDays(_.expiry, _.validFrom) / 30)
  const [suggestionDurationInMonths, suggestion] = ((): [number, DrcSupportSuggestion] => {
    if (!_.existingOrga || !_.existingStart || !_.existingEnd)
      return [maxAssistance, DrcSupportSuggestion.FullNoDuplication]
    if (_.existingOrga === 'DRC') return [0, DrcSupportSuggestion.NoAssistanceDrcDuplication]
    if (_.status === WfpDeduplicationStatus.Error) return [maxAssistance, DrcSupportSuggestion.DeduplicationFailed]
    if (_.createdAt.getTime() < new Date(2023, 8, 13).getTime() && unAgencies.includes(_.existingOrga))
      return [maxAssistance, DrcSupportSuggestion.FullUnAgency]
    if (_.status === WfpDeduplicationStatus.Deduplicated) return [0, DrcSupportSuggestion.NoAssistanceFullDuplication]
    const overlap = getOverlapMonths(_.validFrom, _.expiry, _.existingStart, _.existingEnd)
    if (overlap === maxAssistance) return [0, DrcSupportSuggestion.NoAssistanceExactSameTimeframe]
    return [maxAssistance - overlap, DrcSupportSuggestion.Partial]
  })()
  return {suggestionDurationInMonths, suggestion}
}
