import {ApiClient} from '../ApiClient'
import {KeyOf, KoboBaseTags, KoboSubmission, KoboSubmissionFlat, Period, UUID} from 'infoportal-common'
import {KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@axanc/ts-utils'
import {ApiPaginate, ApiPagination} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Kobo} from 'kobo-sdk'
import {KoboValidation} from 'infoportal-common'

export interface KoboAnswerSearch {
  readonly formId: UUID
  readonly paginate?: ApiPagination
  readonly filters?: AnswersFilters
}

export type KoboUpdateValidation = {
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  status: KoboValidation | null
}

export type KoboUpdateAnswers<T extends Record<string, any> = any, K extends KeyOf<T> = any> = {
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  question: K
  answer: T[K] | null
}

export class KoboAnswerSdk {
  constructor(private client: ApiClient) {}

  readonly searchByAccess = ({formId, filters = {}, paginate = {offset: 0, limit: 100000}}: KoboAnswerSearch) => {
    return this.client
      .post<ApiPaginate<KoboSubmission>>(`/kobo/answer/${formId}/by-access`, {
        body: {...KoboAnswerSdk.mapFilters(filters), ...paginate},
      })
      .then(KoboMapper.mapPaginateAnswer)
  }

  readonly search = ({formId, filters = {}, paginate = {offset: 0, limit: 100000}}: KoboAnswerSearch) => {
    return this.client
      .post<ApiPaginate<KoboSubmission>>(`/kobo/answer/${formId}`, {
        body: {...KoboAnswerSdk.mapFilters(filters), ...paginate},
      })
      .then(KoboMapper.mapPaginateAnswer)
  }

  readonly delete = async ({answerIds, formId}: {answerIds: Kobo.SubmissionId[]; formId: Kobo.FormId}) => {
    await this.client.delete(`/kobo/answer/${formId}`, {body: {answerIds}})
  }

  readonly updateValidation = ({formId, answerIds, status}: KoboUpdateValidation) => {
    return this.client.patch(`/kobo/answer/${formId}/validation`, {
      body: {
        answerIds: answerIds,
        status,
      },
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
      },
    })
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
