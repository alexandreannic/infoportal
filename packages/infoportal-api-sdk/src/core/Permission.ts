import {Ip} from './Types'
import {KeyOf, Obj} from '@axanc/ts-utils'

type Level = Ip.AccessLevel
const Level = Ip.AccessLevel

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
    answers_canSubmit: boolean
    answers_canUpdate: boolean
    answers_canDelete: boolean
    version_canCreate: boolean
    version_canDeploy: boolean
    version_canGet: boolean
  }

  export type Workspace = {
    form_canCreate: boolean
    canDelete: boolean
    server_canGet: boolean
    server_canCreate: boolean
    server_canDelete: boolean
    server_canUpdate: boolean
  }

  export type Global = {
    workspace_canCreate: boolean
  }

  const define = <T extends Global | Form | Workspace>(_: Record<KeyOf<T>, Level>): Record<KeyOf<T>, Level> => {
    return _
  }

  const permissionsMatrix = {
    global: define<Global>({
      workspace_canCreate: Level.Admin,
    }),
    workspace: define<Workspace>({
      canDelete: Level.Admin,
      server_canGet: Level.Read,
      server_canCreate: Level.Admin,
      server_canDelete: Level.Admin,
      server_canUpdate: Level.Admin,
      form_canCreate: Level.Write,
    }),
    form: define<Form>({
      canGet: Level.Read,
      canUpdate: Level.Admin,
      canDelete: Level.Admin,
      canSyncWithKobo: Level.Admin,
      user_canAdd: Level.Admin,
      user_canDelete: Level.Admin,
      user_canEdit: Level.Admin,
      access_canAdd: Level.Admin,
      access_canDelete: Level.Admin,
      access_canEdit: Level.Admin,
      answers_canSubmit: Level.Write,
      answers_canUpdate: Level.Write,
      answers_canDelete: Level.Admin,
      version_canCreate: Level.Admin,
      version_canDeploy: Level.Admin,
      version_canGet: Level.Read,
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
    static readonly global = (user: Ip.User): Global => {
      return Obj.mapValues(permissionsMatrix.global, _ => canDo({required: _, user: user.accessLevel}))
    }

    static readonly workspace = (user: Ip.User, workspaceAccess: Ip.Workspace.Access): Workspace => {
      return Obj.mapValues(permissionsMatrix.workspace, _ => {
        const userLevel = maxLevel(user.accessLevel, workspaceAccess.level)
        return canDo({required: _, user: userLevel})
      })
    }

    static readonly form = (
      user: Ip.User,
      workspaceAccess: Ip.Workspace.Access,
      formAccesses: Ip.Form.Access[],
    ): Form => {
      return Obj.mapValues(permissionsMatrix.form, _ => {
        const userLevel =
          user.accessLevel === Level.Admin || workspaceAccess.level === Level.Admin
            ? Level.Admin
            : computeFormAccesses(formAccesses)
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
