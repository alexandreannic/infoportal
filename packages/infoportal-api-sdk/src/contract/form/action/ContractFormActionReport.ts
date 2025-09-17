import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../core/Schema.js'
import {Ip} from '../../../core/Types.js'
import {map200, TsRestClient} from '../../../core/IpClient.js'

const c = initContract()

export const formActionReportContract = c.router({
  getLive: {
    method: 'GET',
    path: `/:workspaceId/form/:formId/action/report/live`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: c.type<Ip.Form.Action.ExecReport | undefined>(),
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
      200: c.type<Ip.Form.Action.ExecReport[]>(),
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
    getLive: (params: {
      workspaceId: Ip.WorkspaceId
      formId: Ip.FormId
    }): Promise<Ip.Form.Action.ExecReport | undefined> => {
      return client.form.action.report
        .getLive({params})
        .then(map200)
        .then(_ => (_ ? Ip.Form.Action.ExecReport.map(_) : _))
    },
    getByFormId: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}): Promise<Ip.Form.Action.ExecReport[]> => {
      return client.form.action.report
        .getByFormId({params})
        .then(map200)
        .then(_ => _.map(Ip.Form.Action.ExecReport.map))
    },
  }
}
