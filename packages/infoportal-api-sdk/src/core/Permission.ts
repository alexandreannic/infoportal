import {Ip} from './Types'
import {KeyOf, Obj} from '@axanc/ts-utils'

type Level = Ip.AccessLevel
const Level = Ip.AccessLevel

export namespace Permission {
  const define = <T extends Ip.Permission.Global | Ip.Permission.Form | Ip.Permission.Workspace>(
    _: Record<KeyOf<T>, Level>,
  ): Record<KeyOf<T>, Level> => {
    return _
  }

  const permissionsMatrix = {
    global: define<Ip.Permission.Global>({
      workspace_canCreate: Level.Read,
      cache_manage: Level.Admin,
    }),
    workspace: define<Ip.Permission.Workspace>({
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
      use_canConnectAs: Level.Admin,
      form_canCreate: Level.Write,
    }),
    form: define<Ip.Permission.Form>({
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
    static readonly global = (user: Ip.User): Ip.Permission.Global => {
      return Obj.mapValues(permissionsMatrix.global, _ => canDo({required: _, user: user.accessLevel}))
    }

    static readonly workspace = (
      user: Ip.User,
      workspaceAccess?: Ip.Workspace.Access | null,
    ): Ip.Permission.Workspace => {
      return Obj.mapValues(permissionsMatrix.workspace, _ => {
        const userLevel = workspaceAccess ? maxLevel(user.accessLevel, workspaceAccess.level) : undefined
        return canDo({required: _, user: userLevel})
      })
    }

    static readonly form = (
      user: Ip.User,
      workspaceAccess?: Ip.Workspace.Access | null,
      formAccesses?: Ip.Form.Access[] | null,
    ): Ip.Permission.Form => {
      return Obj.mapValues(permissionsMatrix.form, _ => {
        let userLevel
        if (user.accessLevel === Level.Admin) userLevel = Level.Admin
        if (workspaceAccess && workspaceAccess.level === Level.Admin) userLevel = Level.Admin
        if (formAccesses) userLevel = computeFormAccesses(formAccesses)
        return canDo({required: _, user: userLevel})
      })
    }
  }

  export const computeFormAccesses = (accesses: Ip.Form.Access[]): Level | undefined => {
    const levels = new Set(accesses.map(a => a.level))
    if (levels.has(Level.Admin)) return Level.Admin
    if (levels.has(Level.Write)) return Level.Write
    if (levels.has(Level.Read)) return Level.Read
  }
}
