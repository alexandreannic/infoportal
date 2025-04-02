import {ApiPaginate} from 'infoportal-common'
import {
  AssistancePrevented,
  AssistanceProvided,
  WfpFilters,
  WfpImport,
  WfpImportHelper,
  WfpPaginate,
} from './WfpBuildingBlockType.js'
import {ApiClient} from 'kobo-sdk'

export class WFPBuildingBlockSdk {
  constructor(private client: ApiClient) {}

  private static readonly mapPaginate =
    <I, O>(fn: (_: I) => O) =>
    (_: WfpPaginate<I>): ApiPaginate<O> => {
      return {
        total: _.paging.total ?? _.paging.totalAtLeast,
        data: _.items.map(fn),
      }
    }

  readonly getImportFiles = ({limit, offset}: WfpFilters = {}): Promise<ApiPaginate<WfpImport>> => {
    return this.client
      .get<WfpPaginate<any>>(`/manager/tasks/beneficiary-import-requests`, {
        qs: {
          _limit: limit,
          _offset: offset,
        },
      })
      .then(WFPBuildingBlockSdk.mapPaginate(WfpImportHelper.map))
  }

  readonly getAssistanceProvided = ({limit = 1000, offset = 0}: WfpFilters = {}) => {
    return this.client
      .post(`/manager/entitlements/list`, {
        body: {
          organization: 'DRC',
          _limit: limit,
          _offset: offset,
        },
      })
      .then(AssistancePrevented.filterRemoved)
      .then(WFPBuildingBlockSdk.mapPaginate(AssistanceProvided.map))
  }

  readonly getAssistancePrevented = ({limit = 1000, offset = 0}: WfpFilters = {}) => {
    return this.client
      .post(`/manager/deduplicated-entitlements/list`, {
        body: {
          organization: 'DRC',
          _limit: limit,
          _offset: offset,
        },
      })
      .then(AssistancePrevented.filterRemoved)
      .then(WFPBuildingBlockSdk.mapPaginate(AssistancePrevented.map))
  }
}
