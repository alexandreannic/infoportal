import {ApiClient} from '../ApiClient'
import {KeyOf, KoboBaseTags, KoboIndex, KoboSubmission, KoboSubmissionFlat, Period, UUID} from 'infoportal-common'
import {KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@alexandreannic/ts-utils'
import {ApiPaginate, ApiPagination} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Kobo} from 'kobo-sdk'
import {KoboValidation} from 'infoportal-common/kobo'

export interface KoboAnswerFilter {
  readonly paginate?: ApiPagination
  readonly filters?: AnswersFilters
}

export type KoboUpdateAnswers<T extends Record<string, any> = any, K extends KeyOf<T> = any> = {
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  question: K
  answer: T[K] | null
}

interface KoboAnswerSearch {
  <
    TKoboAnswer extends Record<string, any>,
    TTags extends KoboBaseTags = KoboBaseTags,
    TCustomAnswer extends KoboSubmissionFlat<any, TTags> = KoboSubmissionFlat<TKoboAnswer, TTags>,
  >(_: KoboAnswerFilter & {
    readonly formId: UUID,
    readonly fnMapKobo?: (_: Record<string, string | undefined>) => TKoboAnswer
    readonly fnMapTags?: (_?: any) => TTags
    readonly fnMapCustom: (_: KoboSubmissionFlat<TKoboAnswer, TTags>) => TCustomAnswer
  }): Promise<ApiPaginate<TCustomAnswer>>

  <
    TKoboAnswer extends Record<string, any>,
    TTags extends KoboBaseTags = KoboBaseTags,
  >(_: KoboAnswerFilter & {
    readonly formId: UUID,
    readonly fnMapKobo?: (_: Record<string, string | undefined>) => TKoboAnswer
    readonly fnMapTags?: (_?: any) => TTags
    readonly fnMapCustom?: undefined
  }): Promise<ApiPaginate<KoboSubmissionFlat<TKoboAnswer, TTags>>>
}

export class KoboAnswerSdk {

  constructor(private client: ApiClient) {
  }

  readonly searchByAccess: KoboAnswerSearch = ({
    formId,
    filters,
    paginate,
    fnMapKobo = (_: any) => _,
    fnMapTags = (_?: any) => _,
    fnMapCustom,
  }: any) => {
    return this.client.post<ApiPaginate<KoboSubmission>>(`/kobo/answer/${formId}/by-access`, {body: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(KoboMapper.mapPaginateAnswer(fnMapKobo, fnMapTags, fnMapCustom))
  }

  readonly search: KoboAnswerSearch = ({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMapKobo = (_: any) => _,
    fnMapTags = (_?: any) => _,
    fnMapCustom,
  }: any) => {
    return this.client.post<ApiPaginate<KoboSubmission>>(`/kobo/answer/${formId}`, {body: {...KoboAnswerSdk.mapFilters(filters), ...paginate}})
      .then(KoboMapper.mapPaginateAnswer(fnMapKobo, fnMapTags, fnMapCustom))
  }

  readonly delete = async ({
    answerIds,
    formId,
  }: {
    answerIds: Kobo.SubmissionId[]
    formId: Kobo.FormId
  }) => {
    await this.client.delete(`/kobo/answer/${formId}`, {body: {answerIds}})
  }

  readonly updateValidation = ({
    formId,
    answerIds,
    status,
  }: {
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    status: KoboValidation
  }) => {
    return this.client.patch(`/kobo/answer/${formId}/validation`, {
      body: {
        answerIds: answerIds,
        status,
      }
    })
  }

  readonly updateAnswers = <T extends Record<string, any>, K extends KeyOf<T>>({
    formId,
    answerIds,
    question,
    answer,
  }: KoboUpdateAnswers<T, K>) => {
    return this.client.patch(`/kobo/answer/${formId}`, {
      body: {
        answerIds: answerIds,
        question,
        answer,
      }
    })
  }

  readonly updateTag = ({formId, answerIds, tags}: {
    formId: Kobo.FormId,
    answerIds: Kobo.SubmissionId[],
    tags: Record<string, any>
  }) => {
    for (let k in tags) if (tags[k] === undefined) tags[k] = null
    return this.client.patch(`/kobo/answer/${formId}/tag`, {body: {tags, answerIds: answerIds}})
  }

  readonly getPeriod = (formId: Kobo.FormId): Promise<Period> => {
    switch (formId) {
      case KoboIndex.byName('protection_hhs3').id:
      case KoboIndex.byName('protection_hhs2_1').id:
        return Promise.resolve({start: new Date(2023, 3, 1), end: startOfDay(new Date())})
      case KoboIndex.byName('meal_visitMonitoring').id:
        return Promise.resolve({start: new Date(2023, 5, 15), end: startOfDay(new Date())})
      case KoboIndex.byName('safety_incident').id:
        return Promise.resolve({start: new Date(2023, 8, 19), end: startOfDay(new Date())})
      case KoboIndex.byName('meal_cashPdm').id:
        return Promise.resolve({start: new Date(2023, 4, 9), end: startOfDay(new Date())})
      case KoboIndex.byName('meal_shelterPdm').id:
        return Promise.resolve({start: new Date(2024, 3, 11), end: startOfDay(new Date())})

      default:
        throw new Error('To implement')
    }
  }

  private static mapFilters = (_?: AnswersFilters): AnswersFilters | undefined => {
    if (!_) return
    return {
      ..._,
      start: map(_.start ?? undefined, startOfDay),
      end: map(_.end ?? undefined, endOfDay),
    }
  }
}
