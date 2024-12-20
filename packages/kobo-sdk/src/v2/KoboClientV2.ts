import {map} from '@alexandreannic/ts-utils'
import axios from 'axios'
import {KoboClientv2FixedUpdated, KoboUpdateDataParams, KoboUpdateDataParamsData} from './KoboClientV2FixedUpdated'
import {Kobo, Logger} from '../Kobo'
import {ApiClient} from '../api-client/ApiClient'
import {queuify} from '../helper/Utils'

export class KoboClientV2 {
  constructor(
    private api: ApiClient,
    private logger: Logger,
    private editSdk = new KoboClientv2FixedUpdated(api, logger),
  ) {
  }

  static readonly parseDate = (_: Date) => _.toISOString()
  static readonly webHookName = 'InfoPortal'

  static readonly makeDateFilter = (name: string, operator: 'gte' | 'lte', date: Date) => {
    return {[name]: {['$' + operator]: KoboClientV2.parseDate(date)}}
  }

  readonly getForm = (form: string) => {
    return this.api.get<Kobo.Form>(`/v2/assets/${form}`).then(_ => {
      _.content.survey.forEach(q => {
        q.name = q.$autoname ?? q.name
      })
      return _
    })
  }

  readonly getHook = (formId: Kobo.Form.Id): Promise<Kobo.Paginate<Kobo.Hook>> => {
    return this.api.get(`/v2/assets/${formId}/hooks/`)
  }

  readonly createWebHook = (formId: Kobo.FormId, destinationUrl: string) => {
    return this.api.post(`/v2/assets/${formId}/hooks/`, {
      body: {
        'name': KoboClientV2.webHookName,
        endpoint: destinationUrl,
        // 'endpoint': this.conf.baseUrl + `/kobo-api/webhook`,
        'active': true,
        'subset_fields': [],
        'email_notification': true,
        'export_type': 'json',
        'auth_level': 'no_auth',
        'settings': {'custom_headers': {}},
        'payload_template': ''
      }
    })
  }

  readonly edit = (formId: Kobo.FormId, answerId: Kobo.SubmissionId) => {
    return this.api.get<{url: string, detail?: string}>(`/v2/assets/${formId}/data/${answerId}/enketo/edit/?return_url=false`)
  }

  readonly getVersions = (formId: Kobo.FormId) => {
    return this.api.get<Kobo.Paginate<Kobo.Submission.Version>>(`/v2/assets/${formId}/versions`)
      .then(_ => {
        _.results.forEach(r => {
          r.date_modified = new Date(r.date_modified)
          r.date_deployed = new Date(r.date_deployed)
        })
        return _
      })
  }

  readonly updateDataSimple = ({
    formId,
    submissionIds,
    group,
    questionName,
    newValue,
  }: {
    formId: Kobo.FormId,
    submissionIds: Kobo.SubmissionId[],
    group?: string,
    questionName: string,
    newValue: string
  }) => {
    // return this.api.patch(`/v2/assets/${formId}/data/${submissionId}/`, {
    //   body: {
    //     'start': new Date().toISOString(),
    //   }
    // })
    return this.api.patch(`/v2/assets/${formId}/data/bulk/`, {
      // qs: {format: 'json'},
      body: {
        payload: {
          submission_ids: submissionIds,
          data: {[(group ? group + '/' : '') + questionName]: newValue}
        }
      }
    })
  }

  readonly updateValidation = queuify({
    extractDataFromParams: _ => _.submissionIds,
    reconcileParams: (submissionIds, params) => {
      return [{...params[0], submissionIds}] as const
    },
    run: ({
      formId,
      submissionIds,
      status
    }: {
      formId: Kobo.FormId,
      submissionIds: Kobo.Submission.Id[],
      status: Kobo.Submission.Validation
    }): Promise<Kobo.ApiRes.UpdateValidation> => {
      return this.api.patch(`/v2/assets/${formId}/data/validation_statuses/`, {
        body: {
          payload: {
            submission_ids: submissionIds,
            'validation_status.uid': status,
          }
        }
      })
    }
  })

  readonly delete = (formId: Kobo.Form.Id, ids: Kobo.SubmissionId[]): Promise<{detail: string}> => {
    return this.api.delete(`/v2/assets/${formId}/data/bulk/`, {
      body: {
        payload: {submission_ids: ids}
      }
    })
  }

  readonly updateData = <TData extends KoboUpdateDataParamsData>(p: KoboUpdateDataParams<TData>): Promise<void> => {
    return this.editSdk.enqueue(p)
  }

  readonly getFormByVersion = (formId: Kobo.Form.Id, versionId: string) => {
    return this.api.get<Kobo.Form>(`/v2/assets/${formId}/versions/${versionId}`)
  }

  /**
   * It's 30k but use 20k is for safety
   */
  private static readonly MAX_KOBO_PAGESIZE = 2e4

  readonly getAnswersRaw = (form: Kobo.Form.Id, {limit, offset, ...params}: Kobo.Submission.Filter = {}) => {
    const fetchPage = async ({
      limit = KoboClientV2.MAX_KOBO_PAGESIZE,
      offset = 0,
      accumulated = []
    }: {
      limit?: number,
      offset?: number,
      accumulated?: Array<Kobo.Submission>
    }): Promise<Kobo.Paginate<Kobo.Submission>> => {
      const start = map(params.start, _ => KoboClientV2.makeDateFilter('_submission_time', 'gte', _))
      const end = map(params.end, _ => KoboClientV2.makeDateFilter('_submission_time', 'lte', _))
      const query = start && end ? {'$and': [start, end]} : start ?? end
      const response = await this.api.get<Kobo.Paginate<Kobo.Submission.MetaData & Record<string, any>>>(`/v2/assets/${form}/data`, {
        qs: {
          limit: limit,
          start: offset,
          query: query ? JSON.stringify(query) : undefined
        }
      })
      const results = [...accumulated, ...response.results]
      return results.length >= response.count ? {count: response.count, results} : fetchPage({offset: offset + response.results.length, accumulated: results})
    }
    return fetchPage({limit, offset})
  }

  readonly getAnswers = async (form: Kobo.Form.Id, params: Kobo.Submission.Filter = {}): Promise<Kobo.Paginate<Kobo.Submission>> => {
    return await this.getAnswersRaw(form, params)
      .then(res => {
        return ({
          ...res,
          results: res.results
            .map(_ => {
              const submissionTime = new Date(_._submission_time)
              _._id = '' + _._id
              _._submission_time = submissionTime
              _.start = _.start ? new Date(_.start) : undefined
              _.end = _.end ? new Date(_.end) : undefined
              return _
            })
            .sort((a, b) => {
              return a._submission_time.getTime() - b._submission_time.getTime()
            })
        })
      })
  }

  readonly getSchemas = () => {
    // return this.api.get(`/v2/assets/`)
    return this.api.get<Kobo.Paginate<Kobo.Form>>(`/v2/assets/?q=asset_type%3Asurvey&limit=1000`)
  }

  readonly getAttachement = (path: string) => {
    return axios.create().request({
      url: this.api.params.baseUrl + path,
      method: 'GET',
      headers: this.api.params.headers,
      responseType: 'arraybuffer',
    }).then(_ => _.data)
  }
}
