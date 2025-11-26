import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../helper/Schema.js'
import {Api} from '../../../Api.js'
import {map200, TsRestClient} from '../../../ApiClient.js'

const c = initContract()

export const formActionReportContract = c.router({
  getRunning: {
    method: 'GET',
    path: `/:workspaceId/form/:formId/action/report/running`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: c.type<Api.Form.Action.Report | undefined>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canRead'],
      },
    }),
  },
  getByFormId: {
    method: 'GET',
    path: `/:workspaceId/form/:formId/action/report`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: c.type<Api.Form.Action.Report[]>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canRead'],
      },
    }),
  },
})

export const formActionReportClient = (client: TsRestClient) => {
  return {
    getRunning: (params: {
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
    }): Promise<Api.Form.Action.Report | undefined> => {
      return client.form.action.report
        .getRunning({params})
        .then(map200)
        .then(_ => (_ ? Api.Form.Action.Report.map(_) : _))
    },
    getByFormId: (params: {workspaceId: Api.WorkspaceId; formId: Api.FormId}): Promise<Api.Form.Action.Report[]> => {
      return client.form.action.report
        .getByFormId({params})
        .then(map200)
        .then(_ => _.map(Api.Form.Action.Report.map))
    },
  }
}
