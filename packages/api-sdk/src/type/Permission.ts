import {KeyOf} from '@axanc/ts-utils'

  export namespace Permission {
    export type Scope = 'global' | 'workspace' | 'form'

    export type Requirements = {
      global?: KeyOf<Permission.Global>[]
      workspace?: KeyOf<Permission.Workspace>[]
      form?: KeyOf<Permission.Form>[]
    }

    export type Form = {
      canGet: boolean
      canUpdate: boolean
      canDelete: boolean
      canSyncWithKobo: boolean
      user_canAdd: boolean
      user_canDelete: boolean
      user_canEdit: boolean
      access_canAdd: boolean
      access_canDelete: boolean
      access_canEdit: boolean
      access_canRead: boolean
      answers_canSubmit: boolean
      answers_canUpdate: boolean
      answers_canDelete: boolean
      version_canCreate: boolean
      version_canDeploy: boolean
      version_canGet: boolean
      answers_import: boolean
      databaseview_manage: boolean
      action_canRead: boolean
      action_canDelete: boolean
      action_canRun: boolean
      action_canUpdate: boolean
      action_canCreate: boolean
    }

    export type Workspace = {
      canUpdate: boolean
      canDelete: boolean
      form_canCreate: boolean
      server_canGet: boolean
      server_canCreate: boolean
      server_canDelete: boolean
      server_canUpdate: boolean
      group_canCreate: boolean
      group_canDelete: boolean
      group_canUpdate: boolean
      group_canRead: boolean
      proxy_manage: boolean
      proxy_canRead: boolean
      user_canCreate: boolean
      user_canDelete: boolean
      user_canUpdate: boolean
      user_canRead: boolean
      user_canConnectAs: boolean
      form_canGetAll: boolean
      dashboard_canCreate: boolean
      dashboard_canUpdate: boolean
      dashboard_canDelete: boolean
    }

    export type Global = {
      workspace_canCreate: boolean
      cache_manage: boolean
  }
}