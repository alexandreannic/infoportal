import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../helper/Schema.js'
import {Api} from '../../../Api.js'
import {map200, TsRestClient} from '../../../ApiClient.js'

const c = initContract()

export const formActionContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/form/:formId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<Omit<Api.Form.Action.Payload.Create, 'formId' | 'workspaceId'>>(),
    responses: {
      200: c.type<Api.Form.Action>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canCreate'],
      },
    }),
  },
  runAllActionsByForm: {
    method: 'POST',
    path: `/:workspaceId/form/:formId/action/run`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<undefined>(),
    responses: {
      200: c.type<Api.Form.Action.Report>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canRun'],
      },
    }),
  },
  update: {
    method: 'PATCH',
    path: `/:workspaceId/form/:formId/action/:id`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
      id: schema.formActionId,
    }),
    body: c.type<Omit<Api.Form.Action.Payload.Update, 'id' | 'formId' | 'workspaceId'>>(),
    responses: {
      200: c.type<Api.Form.Action>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canUpdate'],
      },
    }),
  },
  getByDbId: {
    method: 'GET',
    path: `/:workspaceId/form/:formId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: c.type<Api.Form.Action[]>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canRead'],
      },
    }),
  },
})

export const formActionClient = (client: TsRestClient) => {
  return {
    getByDbId: ({workspaceId, formId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}): Promise<Api.Form.Action[]> => {
      return client.form.action
        .getByDbId({
          params: {workspaceId, formId: formId},
        })
        .then(map200)
        .then(_ => _.map(Api.Form.Action.map))
    },
    create: ({workspaceId, formId, ...body}: Api.Form.Action.Payload.Create): Promise<Api.Form.Action> => {
      return client.form.action
        .create({
          params: {workspaceId, formId},
          body,
        })
        .then(map200)
        .then(Api.Form.Action.map)
    },
    update: ({workspaceId, formId, id, ...body}: Api.Form.Action.Payload.Update): Promise<Api.Form.Action> => {
      return client.form.action
        .update({
          params: {workspaceId, formId, id},
          body,
        })
        .then(map200)
        .then(Api.Form.Action.map)
    },
    runAllActionsByForm: (params: Api.Form.Action.Payload.Run) => {
      return client.form.action
        .runAllActionsByForm({
          params,
        })
        .then(map200)
        .then(Api.Form.Action.Report.map)
    },
  }
}
