import {map200, TsRestClient} from '../../ApiClient.js'
import {Api} from '../../Api.js'
import {initContract} from '@ts-rest/core'
import {object, z} from 'zod'
import {DatabaseViewValidation} from './DatabaseViewValidation.js'

const c = initContract()

export const databaseViewContract = c.router({
  search: {
    method: 'POST',
    path: '/database-view/search',
    body: DatabaseViewValidation.search,
    responses: {200: z.any() as z.ZodType<Api.DatabaseView[]>},
  },

  create: {
    method: 'PUT',
    path: '/database-view/create',
    body: DatabaseViewValidation.create,
    responses: {200: z.any() as z.ZodType<Api.DatabaseView>},
  },

  update: {
    method: 'POST',
    path: '/database-view/update',
    body: DatabaseViewValidation.update,
    responses: {200: z.any() as z.ZodType<Api.DatabaseView>},
  },

  delete: {
    method: 'DELETE',
    path: '/database-view/delete',
    body: object({
      id: DatabaseViewValidation.id,
    }),
    responses: {200: z.any() as z.ZodType<Api.DatabaseView[]>},
  },

  updateCol: {
    method: 'POST',
    path: '/database-view/updateCol',
    body: DatabaseViewValidation.updateCol,
    responses: {200: z.any() as z.ZodType<Api.DatabaseView>},
  },
})

export const databaseViewClient = (client: TsRestClient) => {
  return {
    search: (body: Api.DatabaseView.Payload.Search) => {
      return client.databaseView
        .search({body})
        .then(map200)
        .then(_ => _.map(Api.DatabaseView.map))
    },

    create: (body: Api.DatabaseView.Payload.Create) => {
      return client.databaseView.create({body}).then(map200).then(Api.DatabaseView.map)
    },

    update: (body: Api.DatabaseView.Payload.Update) => {
      return client.databaseView.update({body}).then(map200).then(Api.DatabaseView.map)
    },

    delete: (id: Api.DatabaseViewId) => {
      return client.databaseView
        .delete({body: {id}})
        .then(map200)
        .then(_ => _.map(Api.DatabaseView.map))
    },

    updateCol: (body: Api.DatabaseView.Payload.UpdateCol) => {
      return client.databaseView.updateCol({body}).then(map200).then(Api.DatabaseView.map)
    },
  }
}
