import retry from 'promise-retry'
import {KoboV1Form, SubmitResponse} from './KoboV1'
import {AxiosError} from 'axios'
import {Kobo} from '../Kobo'
import {ApiClient} from '../api-client/ApiClient'

export class KoboClientV1 {
  constructor(private api: ApiClient) {
  }

  static readonly parseBody = (obj: Record<string, undefined | string | (string | undefined)[] | number>): Record<string, string> => {
    for (const i in obj) {
      if (obj[i] === undefined || obj[i] === null) {
        delete obj[i]
      }
      if (Array.isArray(obj[i])) {
        obj[i] = (obj[i] as any).join(' ')
      }
      if (typeof obj[i] === 'number') {
        obj[i] = '' + obj[i]
      }
    }
    return obj as any
  }

  readonly submit = async <T extends Record<string, any>>({
    formId,
    data,
    retries = 8,
    uuid,
  }: {
    uuid?: string
    retries?: number
    data: Partial<T>
    formId: Kobo.FormId
  }): Promise<SubmitResponse> => {
    const _uuid = uuid ?? await this.getForms().then(_ => _.find(f => f.id_string === formId)?.uuid)
    if (!_uuid) throw new Error(`Kobo form id ${formId} not found.`)
    return retry((retry, number) => {
      return this.api.post<SubmitResponse>(`/submissions.json`, {
        body: {
          id: formId,
          submission: {
            formhub: {uuid: _uuid},
            ...KoboClientV1.parseBody(data),
          }
        }
      }).catch((e: AxiosError) => {
        // console.log(`Retry ${number}: `, e.code, e.cause, e.message)
        return retry(e)
      })
    }, {retries})
  }

  readonly getForms = async (): Promise<KoboV1Form[]> => {
    return this.api.get(`/forms`)
  }
}
