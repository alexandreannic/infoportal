import {Kobo} from 'kobo-sdk'
import {UUID} from 'infoportal-common'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Utils} from '@/utils/utils'
import {Ip} from 'infoportal-api-sdk'

const concat = (...args: (string | undefined)[]) => {
  return args.filter(_ => !!_)
}

export const queryKeys = {
  session: () => ['session'],
  workspaces: () => ['workspaces'],
  originalEmail: () => ['originalEmail'],
  koboForm: (workspaceId?: UUID) => concat('koboForm', workspaceId),
  server: (workspaceId?: UUID) => concat('server', workspaceId),
  access: (workspaceId?: UUID) => concat('access', workspaceId),
  user: (workspaceId?: UUID) => concat('user', workspaceId),
  koboSchema: (formId: Kobo.FormId) => ['koboSchema', formId],
  version: (workspaceId?: UUID, formId?: Kobo.FormId) => concat('version', workspaceId, formId),
  schema: (workspaceId?: UUID, formId?: Kobo.FormId, versionId?: Ip.Uuid) =>
    concat('schema', workspaceId, formId, versionId),
  form: (workspaceId: UUID, formId?: Kobo.FormId) => concat('form', workspaceId, formId),
  group: (workspaceId?: UUID, args?: Omit<ApiSdk['group']['search'], 'workspaceId'>) =>
    concat('group', workspaceId, args ? Utils.stableStringify(args) : undefined),
  answers: (formId?: Kobo.FormId) => concat('answers', formId),
}
