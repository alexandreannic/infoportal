import {ApiClient} from '../ApiClient'
import {KeyOf, UUID} from 'infoportal-common'
import {AnswersFilters} from '@/core/sdk/server/kobo/KoboApiSdk'
import {endOfDay, startOfDay} from 'date-fns'
import {map} from '@axanc/ts-utils'
import {ApiPagination} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'

export interface KoboAnswerSearch {
  workspaceId: UUID
  formId: UUID
  paginate?: ApiPagination
  filters?: AnswersFilters
}

export type KoboUpdateValidation = {
  workspaceId: UUID
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  status: Ip.Submission.Validation | null
}

export type KoboUpdateAnswers<T extends Record<string, any> = any, K extends KeyOf<T> = any> = {
  workspaceId: UUID
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
  question: K
  answer: T[K] | null
}

export class KoboAnswerSdk {
  constructor(private client: ApiClient) {}

  readonly delete = async ({
    workspaceId,
    answerIds,
    formId,
  }: {
    workspaceId: UUID
    answerIds: Kobo.SubmissionId[]
    formId: Kobo.FormId
  }) => {
    await this.client.delete(`/${workspaceId}/form/${formId}/answer`, {body: {answerIds}})
  }

  readonly updateValidation = ({workspaceId, formId, answerIds, status}: KoboUpdateValidation) => {
    return this.client.patch(`/${workspaceId}/form/${formId}/answer/validation`, {
      body: {
        answerIds: answerIds,
        status,
      },
    })
  }

  readonly updateAnswers = <T extends Record<string, any>, K extends KeyOf<T>>({
    workspaceId,
    formId,
    answerIds,
    question,
    answer,
  }: KoboUpdateAnswers<T, K>) => {
    return this.client.patch(`/${workspaceId}/form/${formId}/answer`, {
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
