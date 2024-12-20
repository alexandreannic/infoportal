import {Period, UUID} from 'infoportal-common'
import {Legalaid} from './Legalaid'
import {Cache, duration, Obj, seq, throwIf} from '@alexandreannic/ts-utils'
import {toYYYYMMDD} from '../../../helper/Utils'
import {ApiClient} from 'kobo-sdk'
import Poll = Legalaid.Poll
import PaginateRequest = Legalaid.PaginateRequest
import PaginateResult = Legalaid.PaginateResult
import Beneficiary = Legalaid.Beneficiary
import Config = Legalaid.Config
import BeneficiaryGroup = Legalaid.BeneficiaryGroup
import Gender = Legalaid.Gender

export enum PollType {
  Group,
  Individual,
}

export interface Filters extends Partial<Period> {
}

const pollSearch = {
  [PollType.Group]: 'Group',
  [PollType.Individual]: 'Individual',
}

export class LegalaidSdk {

  constructor(private client: ApiClient) {
  }

  private static readonly formatDate = toYYYYMMDD

  readonly fetchOfficesAll = async () => {
    return Config.offices
  }

  readonly fetchPolls = Cache.request(({
    officeId,
    search
  }: {
    officeId: UUID,
    search?: string
  }): Promise<{polls: Poll[], total: number}> => {
    return this.client.get(`/poll/find`, {
      qs: {
        search,
        status: 'poll',
        officeId,
        limit: 10000,
        skip: 0
      }
    })
  }, {ttl: duration(2, 'day')})

  private readonly fetchBeneficiaryRaw = async (pollId: UUID, params: PaginateRequest & {
    dataFilters?: Record<UUID, string[]>
  }): Promise<PaginateResult<Beneficiary>> => {
    return this.client.post(`/beneficiary/find`, {
      body: {
        ...params,
        pollId,
      }
    })
  }

  readonly fetchBeneficiaries = async ({
    pollId,
    start,
    end,
    skip = 0,
    limit = 100000
  }: Filters & PaginateRequest & {
    pollId: UUID
  }) => {
    const dateColumnUUID = await this.fetchBeneficiaryRaw(pollId, {
      limit: 1,
      skip: 0
    }).then(_ => {
      const key = Object.keys(_.cols)[0]
      if (_.cols[key].type !== 'datePicker') {
        throw new Error('Date column not found for pollId=' + pollId)
      }
      return key
    })
    return this.fetchBeneficiaryRaw(pollId, {
      skip,
      limit,
      ...(start || end) ? {
        dataFilters: {
          [dateColumnUUID]: [
            ...start ? [LegalaidSdk.formatDate(start)] : [],
            ...end ? [LegalaidSdk.formatDate(end)] : []
          ]
        }
      } : {}
    }).then(LegalaidSdk.mapBeneficiaries(dateColumnUUID))
  }

  private readonly fetchBeneficiaryGroupAgeColumns = async (pollId: UUID): Promise<Gender<UUID[]>> => {
    const cols = await this.fetchBeneficiaries({limit: 1, skip: 0, pollId}).then(_ => _.cols)
    const get = (pattern: string) => {
      const r = Object.keys(cols).filter(k => cols[k].name.includes(pattern))
      if (r.length === 0) {
        throw new Error(`Cannot find column pattern ${pattern} for pollId=${pollId}`)
      }
      return r
    }
    return {
      men: get('MEN'),
      women: get('WOM'),
    }
  }

  readonly fetchGroups = async (filters: PaginateRequest & Filters & {
    pollId: UUID,
  }): Promise<PaginateResult<BeneficiaryGroup>> => {
    const colsUUID = await this.fetchBeneficiaryGroupAgeColumns(filters.pollId)
    return this.fetchBeneficiaries(filters).then(_ => ({
      ..._,
      data: _.data.map(benef => {
        const ageGroups = Obj.entries(colsUUID).reduce<Gender<number>>((acc, [k, v]) => {
          return ({
            ...acc, [k]: seq(v.map(_ => (benef as any)[_])).sum((_?: number) => isNaN(_!) ? 0 : +_!)
          })
        }, {} as any)
        return {
          ...benef,
          ...ageGroups,
        }
      })
    }))
  }

  readonly fetchGroupsByOffices = async ({
    offices,
    ...filters
  }: Filters & PaginateRequest & {
    offices: UUID[]
  }) => {
    const polls = await Promise.all(offices.map(officeId =>
      this.fetchPolls({officeId, search: pollSearch[PollType.Group]})
        .then(throwIf(_ => _.polls.length === 0, `Poll with search '${pollSearch[PollType.Group]}' not found for office ${officeId}`))
        .then(_ => _.polls[0])
    ))
    return await Promise.all(polls.map(_ => this.fetchGroups({pollId: _._id, ...filters})))
      .then(LegalaidSdk.reducePaginates)
  }

  readonly fetchBeneficiariesByOffices = async ({
    offices,
    ...filters
  }: Filters & PaginateRequest & {
    offices: UUID[]
  }) => {
    const polls = await Promise.all(offices.map(officeId =>
      this.fetchPolls({officeId, search: pollSearch[PollType.Individual]})
        .then(throwIf(_ => _.polls.length === 0, `Poll with search '${pollSearch[PollType.Group]}' not found for office ${officeId}`))
        .then(_ => _.polls[0])
    ))
    return await Promise.all(polls.map(_ => this.fetchBeneficiaries({pollId: _._id, ...filters})))
      .then(LegalaidSdk.reducePaginates)
  }

  private static reducePaginates = <T>(paginate: PaginateResult<T>[]): PaginateResult<T> => {
    return paginate.reduce<PaginateResult<T>>((acc, curr) => ({
      cols: {},
      total: acc.total + curr.data.length,
      data: [...acc.data, ...curr.data],
    }), {total: 0, data: [], cols: {}})
  }

  private static mapBeneficiaries = (dateColumnUUID: UUID) => (
    d: PaginateResult<Record<keyof Beneficiary, any>>
  ): PaginateResult<Beneficiary> => {
    return {
      ...d,
      data: d.data.map(LegalaidSdk.mapBeneficiary(dateColumnUUID))
    }
  }

  private static mapBeneficiary = (dateColumnUUID: UUID) => (d: Record<keyof Beneficiary, any>): Beneficiary => {
    return {
      ...d,
      date: new Date(d[dateColumnUUID as keyof typeof d]),
      createdAt: new Date(d.createdAt),
      updatedAt: new Date(d.updatedAt),
    }
  }
}
