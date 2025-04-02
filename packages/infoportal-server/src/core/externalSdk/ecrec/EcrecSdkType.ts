import {StandardEnum} from '../../../helper/HelperType.js'

export interface EcrecGetDataResponse<T> {
  totalCount: number
  data: T[]
}

export interface EcrecGetDataFilters<Status extends StandardEnum<unknown>> {
  funded?: boolean
  fundingDateStart?: Date
  fundingDateEnd?: Date
  status?: Status[]
  start?: Date
  end?: Date
  limit?: number
  offset?: number
}

export enum FundedStatus {
  Pending = '118',
  Funded = '117',
}

export interface EcrecGetDataRawParams {
  page?: number
  count?: number
  filterData?: {
    filterRangeInts: []
    filterRangeDoubles: []
    filterLongs: []
    filterStrings: []
    filterTimes: []
    filterDates: []
  }
  searchData?: any[]
  sortData?: {
    fieldName: string
    type: 'DESC' | 'ASC'
  }
}

export enum EcrecMsdStatus {
  'New' = 42,
  'Vetting' = 43,
  'Reject vetting' = 44,
  'Phone interview' = 45,
  'Reject phone' = 46,
  'Field visit' = 47,
  'Reject field visit' = 48,
  'Waiting approval' = 49,
  'Approved' = 50,
  'Reject after approved' = 51,
  'Documents' = 52,
  'Waiting signing' = 53,
  'Signed' = 54,
  'Pre-funding reports' = 55,
  'Funded' = 56,
  'Post-funding reports' = 57,
  'Final reports submitted' = 58,
  'Reject forever' = 59,
  'Monitoring' = 60,
  'Monitoring completed' = 61,
  'Pending' = 62,
}

export enum EcrecSmeStatus {
  'New' = 22,
  'Vetting' = 23,
  'Reject vetting' = 24,
  'Phone interview' = 25,
  'Reject phone' = 26,
  'Field visit' = 27,
  'Reject field visit' = 28,
  'Waiting approval' = 29,
  'Approved' = 30,
  'Reject after approved' = 31,
  'Documents' = 32,
  'Waiting signing' = 33,
  'Signed' = 34,
  'Pre-funding reports' = 35,
  'Funded' = 36,
  'Post-funding reports' = 37,
  'Final reports submitted' = 38,
  'Reject forever' = 39,
  'Monitoring' = 40,
  'Monitoring completed' = 41,
  'Pending' = 109,
}

export enum EcrecVetStatus {
  'New' = '42',
  'Vetting' = '43',
  'Reject vetting' = '44',
  'Phone interview' = '45',
  'Reject phone' = '46',
  'Final interview' = '47',
  'Reject final interview' = '48',
  'Waiting approval' = '49',
  'Approved' = '50',
  'Reject after approved' = '51',
  'Documents' = '52',
  'Waiting signing' = '53',
  'Signed' = '54',
  'Funded' = '55',
  'Waiting receipts' = '56',
  'Receipts submitted' = '57',
  'Waiting for certificate' = '58',
  'Certificate submitted' = '59',
  'Reject forever' = '60',
  'Monitoring' = '61',
  'Monitoring completed' = '62',
  'Pending' = '63',
}
