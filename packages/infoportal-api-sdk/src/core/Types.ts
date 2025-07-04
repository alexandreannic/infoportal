import {FormVersion} from '@prisma/client'
import {Kobo} from 'kobo-sdk'

export namespace Ip {
  export type Uuid = string
  export type FormId = Form.Id
  export namespace Form {
    export type Id = string

    export type Schema = Kobo.Form['content']

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
