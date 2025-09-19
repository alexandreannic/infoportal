import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../core/Schema.js'
import {Ip} from '../../../core/Types.js'
import {map200, TsRestClient} from '../../../core/IpClient.js'

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
      200: c.type<Ip.Form.Action.Report | undefined>(),
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
      200: c.type<Ip.Form.Action.Report[]>(),
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
      workspaceId: Ip.WorkspaceId
      formId: Ip.FormId
    }): Promise<Ip.Form.Action.Report | undefined> => {
      return client.form.action.report
        .getRunning({params})
        .then(map200)
        .then(_ => (_ ? Ip.Form.Action.Report.map(_) : _))
    },
    getByFormId: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}): Promise<Ip.Form.Action.Report[]> => {
      return client.form.action.report
        .getByFormId({params})
        .then(map200)
        .then(_ => _.map(Ip.Form.Action.Report.map))
    },
  }
}
