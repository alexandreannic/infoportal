import {FormVersion, KoboForm, KoboServer} from '@prisma/client'
import {Kobo} from 'kobo-sdk'

export namespace Ip {
  export type Uuid = string

  export type FormId = Form.Id

  export type Form = KoboForm

  export type Server = KoboServer

  export namespace Form {
    export namespace Payload {
      export type Import = {
        serverId: Ip.Uuid
        uid: Kobo.FormId
      }

      export type Create = {
        name: string
        category?: string
      }
    }

    export type Id = string

    export type Schema = Kobo.Form['content'] & {files?: Kobo.Form.File[]}

    export type Version = Omit<FormVersion, 'schema'>

    export namespace Schema {
      export type Validation = {
        status: 'error' | 'warning' | 'success'
        code: number
        message: string
        warnings?: string[]
        schema?: any
      }
    }

    export namespace Version {}
  }
}
