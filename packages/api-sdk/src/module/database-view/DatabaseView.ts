import {Api} from '../../Api.js'
import {Brand} from '../common/Common'
import {DatabaseViewValidation} from './DatabaseViewValidation'
import {z} from 'zod'

export type DatabaseView = {
  id: DatabaseViewId
  name: string
  databaseId: string
  createdAt: Date
  updatedAt?: Date
  createdBy: Api.User.Email
  updatedBy?: Api.User.Email
  visibility: DatabaseView.Visibility
  details: DatabaseView.Col[]
}

export type DatabaseViewId = Brand<string, 'DatabaseView'>

export namespace DatabaseView {
  export namespace Payload {
    export type Create = z.infer<typeof DatabaseViewValidation.create>
    export type Search = z.infer<typeof DatabaseViewValidation.search>
    export type Update = z.infer<typeof DatabaseViewValidation.update>
    export type UpdateCol = z.infer<typeof DatabaseViewValidation.updateCol>
  }
  export const map = (_: any): DatabaseView => {
    return {
      ..._,
      createdAt: new Date(_.createdAt),
      updatedAt: new Date(_.updatedAt),
    }
  }

  export type Col = {
    name: string
    width?: number
    visibility?: ColVisibility
  }

  export enum Visibility {
    Public = 'Public',
    Sealed = 'Sealed',
    Private = 'Private',
  }

  export enum ColVisibility {
    Hidden = 'Hidden',
    Visible = 'Visible',
  }
}
