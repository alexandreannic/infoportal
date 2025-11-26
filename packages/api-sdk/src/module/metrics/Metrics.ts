import {FormId} from '../form/Form.js'

export namespace Metrics {
    export type ByType = 'location' | 'user' | 'status' | 'category' | 'month' | 'form'
    export namespace Payload {
      export type Filter = {
        start?: Date
        end?: Date
        formIds: FormId[]
      }
    }

    export type CountUserByDate = {date: string; countCreatedAt: number; countLastConnectedCount: number}[]
    export type CountBy<K extends string> = Array<Record<K, string> & {count: number}>
    export type CountByKey = CountBy<'key'>
  }
