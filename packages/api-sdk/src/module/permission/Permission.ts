import {KeyOf, Obj} from '@axanc/ts-utils'
import {Api} from '../../Api.js'

type Level = Api.AccessLevel
const Level = Api.AccessLevel

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

  export namespace Helper {
    const define = <T extends Permission.Global | Permission.Form | Permission.Workspace>(
      _: Record<KeyOf<T>, Level>,
    ): Record<KeyOf<T>, Level> => {
      return _
    }

    const permissionsMatrix = {
      global: define<Permission.Global>({
        workspace_canCreate: Level.Read,
        cache_manage: Level.Admin,
      }),
      workspace: define<Permission.Workspace>({
        canDelete: Level.Admin,
        canUpdate: Level.Admin,
        server_canGet: Level.Read,
        server_canCreate: Level.Admin,
        server_canDelete: Level.Admin,
        server_canUpdate: Level.Admin,
        group_canCreate: Level.Write,
        group_canDelete: Level.Write,
        group_canUpdate: Level.Write,
        group_canRead: Level.Read,
        proxy_manage: Level.Write,
        proxy_canRead: Level.Read,
        user_canCreate: Level.Admin,
        user_canDelete: Level.Admin,
        user_canUpdate: Level.Admin,
        user_canRead: Level.Read,
        user_canConnectAs: Level.Admin,
        form_canCreate: Level.Write,
        form_canGetAll: Level.Admin,
        dashboard_canCreate: Level.Write,
        dashboard_canUpdate: Level.Write,
        dashboard_canDelete: Level.Write,
      }),
      form: define<Permission.Form>({
        canGet: Level.Read,
        canUpdate: Level.Admin,
        canDelete: Level.Admin,
        canSyncWithKobo: Level.Admin,
        user_canAdd: Level.Admin,
        user_canDelete: Level.Admin,
        user_canEdit: Level.Admin,
        access_canRead: Level.Read,
        access_canAdd: Level.Admin,
        access_canDelete: Level.Admin,
        access_canEdit: Level.Admin,
        answers_canSubmit: Level.Write,
        answers_canUpdate: Level.Write,
        answers_canDelete: Level.Admin,
        version_canCreate: Level.Admin,
        version_canDeploy: Level.Admin,
        version_canGet: Level.Read,
        answers_import: Level.Admin,
        databaseview_manage: Level.Admin,
        action_canRead: Level.Read,
        action_canDelete: Level.Admin,
        action_canUpdate: Level.Write,
        action_canRun: Level.Admin,
        action_canCreate: Level.Write,
      }),
    }

    const accessOrder = [Level.Read, Level.Write, Level.Admin]

    export const canDo = ({user, required}: {user?: Level; required: Level}): boolean => {
      if (!user) return false
      return accessOrder.indexOf(required) <= accessOrder.indexOf(user)
    }

    export const maxLevel = (...levels: Level[]) => {
      const sorted = [...levels].sort((a, b) => accessOrder.indexOf(a) - accessOrder.indexOf(b))
      return sorted[sorted.length - 1]
    }

    export class Evaluate {
      static readonly global = (user: Api.User): Permission.Global => {
        return Obj.mapValues(permissionsMatrix.global, _ => canDo({required: _, user: user.accessLevel}))
      }

      static readonly workspace = (
        user: Api.User,
        workspaceAccess?: Api.Workspace.Access | null,
      ): Permission.Workspace => {
        return Obj.mapValues(permissionsMatrix.workspace, _ => {
          const userLevel = workspaceAccess ? maxLevel(user.accessLevel, workspaceAccess.level) : undefined
          return canDo({required: _, user: userLevel})
        })
      }

      static readonly form = (
        user: Api.User,
        workspaceAccess?: Api.Workspace.Access | null,
        formAccesses?: Api.Access[] | null,
      ): Permission.Form => {
        return Obj.mapValues(permissionsMatrix.form, _ => {
          let userLevel
          if (user.accessLevel === Level.Admin) userLevel = Level.Admin
          if (workspaceAccess && workspaceAccess.level === Level.Admin) userLevel = Level.Admin
          if (formAccesses) userLevel = computeFormAccesses(formAccesses)
          return canDo({required: _, user: userLevel})
        })
      }
    }

    export const computeFormAccesses = (accesses: Api.Access[]): Level | undefined => {
      const levels = new Set(accesses.map(a => a.level))
      if (levels.has(Level.Admin)) return Level.Admin
      if (levels.has(Level.Write)) return Level.Write
      if (levels.has(Level.Read)) return Level.Read
    }
  }
}
