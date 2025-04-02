import {EcrecClient} from './EcrecClient.js'
import {
  EcrecGetDataFilters,
  EcrecGetDataResponse,
  EcrecMsdStatus,
  EcrecSmeStatus,
  EcrecVetStatus,
  FundedStatus,
} from './EcrecSdkType.js'
import {format, sub} from 'date-fns'
import {seq} from '@axanc/ts-utils'
import {StandardEnum} from '../../../helper/HelperType.js'

/** @deprecated Ecrec App does not exist anymore. Keep the code since it can be helpful*/
export class EcrecSdk {
  constructor(private client: EcrecClient) {}

  private static readonly dateFormat = 'dd.MM.yyyy HH:mm:ss'

  private static readonly formatDate = (d: Date) => format(d, EcrecSdk.dateFormat)

  private static readonly makeDateFilter = (field: string, start?: Date, end?: Date) => {
    return start || end
      ? {
          dateEnd: end && EcrecSdk.formatDate(sub(end, {seconds: 1})),
          dateStart: start && EcrecSdk.formatDate(start),
          dateFormat: EcrecSdk.dateFormat,
          fieldName: field,
        }
      : undefined
  }

  readonly fetchMsd = async (filters: EcrecGetDataFilters<typeof EcrecMsdStatus>) => {
    return this.fetch<typeof EcrecMsdStatus>('msd', filters)
  }

  readonly fetchVet = async (filters: EcrecGetDataFilters<typeof EcrecVetStatus>) => {
    return this.fetch<typeof EcrecVetStatus>('vet', filters)
  }

  readonly fetchSme = async (filters: EcrecGetDataFilters<typeof EcrecSmeStatus>) => {
    return this.fetch<typeof EcrecSmeStatus>('sme', filters)
  }

  readonly fetchMicro = async (filters: EcrecGetDataFilters<typeof EcrecSmeStatus>) => {
    return this.fetch<typeof EcrecSmeStatus>('micro', filters)
  }

  readonly fetchMsdOLD = async (params: EcrecGetDataFilters<typeof EcrecMsdStatus>) => {
    const body = {
      parameters: null,
      page: params.offset && params.limit ? params.offset / params.limit : 1,
      count: params.limit ?? 10,
      filterData: {
        filterRangeInts: [],
        filterRangeDoubles: [],
        filterLongs: params.status
          ? [
              {
                fieldName: 'typeStatusId',
                values: params.status,
              },
            ]
          : [],
        filterStrings: [],
        filterTimes: [],
        filterDates:
          params.end || params.start
            ? [
                {
                  dateEnd: params.end && EcrecSdk.formatDate(params.end),
                  dateStart: params.start && EcrecSdk.formatDate(params.start),
                  dateFormat: EcrecSdk.dateFormat,
                  fieldName: 'tmspDtCreate',
                },
              ]
            : [],
      },
      searchData: [],
      sortData: {
        fieldName: 'tmspDtCreate',
        type: 'DESC',
      },
    }
    return this.client.post<EcrecGetDataResponse<any>>(`/admin/msd-redesigned/get-list-data`, {
      body,
      ...params,
    })
  }

  private readonly fetch = async <T extends StandardEnum<unknown>, R = any>(
    data: 'msd' | 'sme' | 'vet' | 'micro',
    filters: EcrecGetDataFilters<T>,
  ) => {
    return this.client.post<EcrecGetDataResponse<R>>(`/admin/${data}-redesigned/get-list-data`, {
      body: {
        parameters: null,
        page: filters.offset && filters.limit ? filters.offset / filters.limit : 1,
        count: filters.limit ?? 10,
        filterData: {
          filterRangeInts: [],
          filterRangeDoubles: [],
          filterLongs: seq([
            filters.status ? {fieldName: 'typeStatusId', values: filters.status} : undefined,
            filters.funded
              ? {fieldName: 'funding', values: [filters.funded ? FundedStatus.Funded : FundedStatus.Pending]}
              : undefined,
          ]).compact(),
          filterStrings: [],
          filterTimes: [],
          filterDates: seq([
            EcrecSdk.makeDateFilter('tmspDtCreate', filters.start, filters.end),
            EcrecSdk.makeDateFilter('fundingDate', filters.fundingDateStart, filters.fundingDateEnd),
          ]).compact(),
        },
        searchData: [],
        sortData: {
          fieldName: 'tmspDtCreate',
          type: 'DESC',
        },
      },
    })
  }
}
