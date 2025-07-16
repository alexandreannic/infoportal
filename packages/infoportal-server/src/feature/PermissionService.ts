import {PrismaClient} from '@prisma/client'
import {Request} from 'express'
import {Ip, Permission} from 'infoportal-api-sdk'
import {AppError} from '../helper/Errors.js'
import {UserService} from './user/UserService.js'
import {FormAccessService} from './form/access/FormAccessService.js'
import {WorkspaceAccessService} from './workspace/WorkspaceAccessService.js'

export class PermissionService {
  constructor(
    private prisma: PrismaClient,
    private workspace = new WorkspaceAccessService(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly throwIfNoPermitted = async ({permissions, req}: {permissions?: Permission.Requirements; req: Request}) => {
    const connectedUser = await this.checkUserConnected(req)
    const hasPermission = await this.checkPermissions({
      workspaceId: req.params.workspaceId,
      formId: req.params.formId,
      user: connectedUser,
      permissions,
    })
    if (!hasPermission) throw new AppError.Forbidden()
  }

  readonly checkUserConnected = async (req: Request): Promise<Ip.User> => {
    const email = req.session.app?.user.email
    if (!email) {
      throw new AppError.Forbidden('auth_user_not_connected')
    }
    const user = await UserService.getInstance(this.prisma).getUserByEmail(email)
    if (!user) {
      throw new AppError.Forbidden('user_not_allowed')
    }
    return user
  }

  async checkPermissions({
    user,
    permissions,
    workspaceId,
    formId,
  }: {
    user: Ip.User
    permissions?: Permission.Requirements
    workspaceId?: Ip.Uuid
    formId?: Ip.FormId
  }): Promise<boolean> {
    if (!permissions) return false
    if (permissions.global && this.canGlobal(user, permissions.global)) return true
    if (permissions.workspace && (await this.canWorkspace({user, workspaceId, required: permissions.workspace})))
      return true
    if (permissions.form && (await this.canForm({user, workspaceId, formId, required: permissions.form}))) return true
    return false
  }

  private canGlobal(user: Ip.User, required: Array<keyof Permission.Global>): boolean {
    const evals = Permission.Evaluate.global(user)
    return required.some(perm => evals[perm])
  }

  private async canWorkspace({
    user,
    workspaceId,
    required,
  }: {
    user: Ip.User
    workspaceId?: Ip.Uuid
    required: Array<keyof Permission.Workspace>
  }): Promise<boolean> {
    if (!workspaceId) throw new AppError.BadRequest('Missing workspaceId')

    const wsAccess = await this.workspace.getByUser({workspaceId, user})
    if (!wsAccess) return false

    const evals = Permission.Evaluate.workspace(user, wsAccess)
    return required.some(perm => evals[perm])
  }

  private async canForm({
    user,
    workspaceId,
    formId,
    required,
  }: {
    user: Ip.User
    workspaceId?: Ip.Uuid
    formId?: Ip.FormId
    required: Array<keyof Permission.Form>
  }): Promise<boolean> {
    if (!workspaceId) throw new AppError.BadRequest('Missing workspaceId')
    if (!formId) throw new AppError.BadRequest('Missing formId')

    const wsAccess = await this.workspace.getByUser({workspaceId, user})
    if (!wsAccess) return false

    const formAccesses = await this.formAccess.searchForUser({workspaceId, user})
    if (!formAccesses) return false

    const evals = Permission.Evaluate.form(user, wsAccess, formAccesses)
    return required.some(perm => evals[perm])
  }
}

// readonly checkPermissions = async ({
//   permissions,
//   user,
//   workspaceId,
//   formId,
// }: {
//   workspaceId?: Ip.Uuid
//   formId: Ip.FormId
//   user: Ip.User
//   permissions?: Permission.Requirements
// }) => {
//   if (!permissions) return
//   if (permissions.global) {
//     const evaluation = Permission.Evaluate.global(user)
//     const can = permissions.global.some(_ => evaluation[_])
//     if (can) return true
//   }
//   if (permissions.workspace) {
//     if (!workspaceId) throw new AppError.BadRequest('Missing workspaceId')
//     const workspaceAccess = await this.workspace.getByUser({workspaceId, user})
//     if (workspaceAccess) {
//       const evaluation = Permission.Evaluate.workspace(user, workspaceAccess)
//       const can = permissions.workspace.some(_ => evaluation[_])
//       if (can) return true
//     }
//   }
//   if (permissions.form) {
//     if (!workspaceId) throw new AppError.BadRequest('Missing workspaceId')
//     if (!formId) throw new AppError.BadRequest('Missing formId')
//     const workspaceAccess = await this.workspace.getByUser({workspaceId, user})
//     const formAccesses = await this.formAccess.searchForUser({workspaceId, user})
//     if (workspaceAccess && formAccesses) {
//       const evaluation = Permission.Evaluate.form(user, workspaceAccess, formAccesses)
//       const can = permissions.form.some(_ => evaluation[_])
//       if (can) return true
//     }
//   }
// }
// }
