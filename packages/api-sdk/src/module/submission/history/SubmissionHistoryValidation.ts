import {z} from 'zod'
import {schema} from '../../../helper/Schema.js'

export class SubmissionHistoryValidation {
  static readonly search = z.object({
    formId: schema.formId,
    workspaceId: schema.workspaceId,
  })
}
