import {object, z} from 'zod'
import {Api} from '../../Api.js'
import {schema} from '../../helper/Schema.js'

export class DatabaseViewValidation {
  static readonly id = z.string() as unknown as z.ZodType<Api.DatabaseViewId>

  static readonly visibility = z.enum(['Public', 'Sealed', 'Private'])

  static readonly colVisibility = z.enum(['Hidden', 'Visible'])

  static readonly create = object({
    name: z.string(),
    databaseId: z.string(),
    visibility: this.visibility,
  })

  static readonly search = z.object({
    databaseId: schema.formId,
    email: z.string().optional(),
  })

  static readonly update = object({
    id: this.id,
    name: z.string().optional(),
    databaseId: schema.formId.optional(),
    visibility: this.visibility.optional(),
  })

  static readonly updateCol = object({
    viewId: this.id,
    name: z.string(),
    width: z.number().optional(),
    visibility: this.colVisibility.optional(),
  })
}
