import {Kobo} from 'kobo-sdk'
import {UUID} from 'infoportal-common'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Utils} from '@/utils/utils'

export const queryKeys = {
  session: () => ['session'],
  workspaces: () => ['workspaces'],
  originalEmail: () => ['originalEmail'],
  koboForm: (workspaceId?: UUID) => ['koboForm', ...(workspaceId ? [workspaceId] : [])],
  server: (workspaceId?: UUID) => ['server', ...(workspaceId ? [workspaceId] : [])],
  access: (workspaceId?: UUID) => ['access', ...(workspaceId ? [workspaceId] : [])],
  user: (workspaceId?: UUID) => ['user', ...(workspaceId ? [workspaceId] : [])],
  koboSchema: (formId: Kobo.FormId) => ['koboSchema', formId],
  schema: (workspaceId?: UUID, formId?: Kobo.FormId) => [
    'schema',
    ...(workspaceId ? [workspaceId] : []),
    ...(formId ? [formId] : []),
  ],
  form: (formId?: Kobo.FormId) => ['form', formId],
  group: (workspaceId?: UUID, args?: Omit<ApiSdk['group']['search'], 'workspaceId'>) => {
    return ['group', ...(workspaceId ? [workspaceId] : []), ...(args ? [Utils.stableStringify(args)] : [])]
  },
  answers: (formId?: Kobo.FormId) => (formId ? ['answers', formId] : ['answers']),
}
