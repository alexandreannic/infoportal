import {ApiClient, RequestOption} from '../ApiClient'
import {objectToQueryString, UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {appConfig, AppConfig} from '@/conf/AppConfig'
import {ApiPagination} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Method} from 'axios'

export interface FilterBy {
  column: string
  value: (string | null)[]
  type?: 'array'
}

export interface AnswersFilters<T extends FilterBy[] = FilterBy[]> {
  start?: Date
  end?: Date
  ids?: Kobo.FormId[]
  filterBy?: T
}

export interface FiltersProps {
  paginate?: ApiPagination
  filters?: AnswersFilters
}

export interface FnMap<T> {
  fnMap?: (_: Record<string, string | undefined>) => T
}

export class KoboApiSdk {
  constructor(
    private client: ApiClient,
    private conf: AppConfig = appConfig,
  ) {}

  readonly synchronizeAnswers = (formId: Kobo.FormId) => {
    return this.client.post(`/kobo-api/${formId}/sync`)
  }

  readonly getSchema = ({id}: {id: Kobo.FormId}): Promise<Kobo.Form> => {
    return this.client.get(`/kobo-api/${id}/schema`)
  }

  readonly getEditUrl = ({formId, answerId}: {formId: Kobo.FormId; answerId: Kobo.SubmissionId}): string => {
    return `${this.conf.apiURL}/kobo-api/${formId}/edit-url/${answerId}`
  }

  readonly searchSchemas = (body: {serverId: UUID}): Promise<Kobo.Form[]> => {
    return this.client.post(`/kobo-api/schema`, {body}).then((_) =>
      _.results.map((_: Record<keyof Kobo.Form, any>): Kobo.Form => {
        return {
          ..._,
          date_created: new Date(_.date_created),
          date_modified: new Date(_.date_modified),
        }
      }),
    )
  }

  static readonly getAttachementUrl = ({
    baseUrl,
    formId,
    attachmentId,
    answerId,
    fileName,
  }: {
    baseUrl: string
    formId: Kobo.FormId
    answerId: Kobo.SubmissionId
    attachmentId: number
    fileName?: string
  }) => {
    return (
      baseUrl +
      `/kobo-api/${formId}/submission/${answerId}/attachment/${attachmentId}` +
      (fileName ? '?' + objectToQueryString({fileName}) : '')
    )
  }

  readonly proxy = <T = any>({
    url,
    method,
    formId,
    options,
  }: {
    formId: Kobo.FormId
    method: Method
    url: string
    options?: RequestOption
  }) => {
    return this.client.post<T>(`/kobo-api/proxy`, {
      // responseType: 'blob',
      body: {
        formId,
        method,
        url,
        body: options?.body,
        headers: options?.headers,
        mapData: (_: any) => _,
      },
    })
  }
}
