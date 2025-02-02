import {ApiClient} from '../api-client/ApiClient'
import {Kobo, Logger} from '../Kobo'
import {KoboError} from '../KoboError'
import retry from 'promise-retry'
import {AxiosError} from 'axios'
import {KoboClientV1} from './KoboClientV1'

export class KoboClientV1Submission {
  constructor(
    private api: ApiClient,
    private parent: KoboClientV1,
    private log: Logger,
  ) {}

  static readonly parseBody = (
    obj: Record<string, undefined | string | (string | undefined)[] | number>,
  ): Record<string, string> => {
    for (const i in obj) {
      if (obj[i] === undefined || obj[i] === null) {
        delete obj[i]
      }
      const isSelectMultiple = Array.isArray(obj[i]) && typeof obj[i][0] === 'string'
      if (isSelectMultiple) {
        obj[i] = (obj[i] as any).join(' ')
      }
      if (typeof obj[i] === 'number') {
        obj[i] = '' + obj[i]
      }
    }
    return obj as any
  }

  /**
   * Include an auto retry mechanism.
   * @param formId
   * @param Only use question's name (without begin_group's path) as a key. The function will take care of formatting.
   * For `begin_repeat` section use nested array like
   * {
   *   location: 'Kharkiv',
   *   persons: [
   *    {name: 'Vlad'},
   *    {name: 'Masha'}
   *   ]
   * }
   * @param retries
   * @param uuid Automatically generated by default
   */
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
  }): Promise<Kobo.V1.SubmitResponse> => {
    const _uuid = uuid ?? (await this.parent.form.getAll().then((_) => _.find((f) => f.id_string === formId)?.uuid))
    if (!_uuid) throw new KoboError(`Form id ${formId} not found.`)
    return retry(
      (retry, number) => {
        return this.api
          .post<Kobo.V1.SubmitResponse>(`/submissions.json`, {
            body: {
              id: formId,
              submission: {
                formhub: {uuid: _uuid},
                ...KoboClientV1Submission.parseBody(data),
              },
            },
          })
          .catch((e: AxiosError) => {
            this.log.debug(`Retry ${number}: Code=${e.code} Cause=${e.cause}, e.message`)
            return retry(e)
          })
      },
      {retries},
    )
  }
}
