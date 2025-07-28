import {PrismaClient} from '@prisma/client'
import {Request} from 'express'
import {Ip, Permission} from 'infoportal-api-sdk'
import {HttpError} from 'infoportal-common'
import {UserService} from './user/UserService.js'
import {FormAccessService} from './form/access/FormAccessService.js'
import {WorkspaceAccessService} from './workspace/WorkspaceAccessService.js'

export class PermissionService {
  constructor(
    private prisma: PrismaClient,
    private workspace = new WorkspaceAccessService(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly throwIfNoPermitted = async ({
    permissions,
    req,
  }: {
    permissions?: Ip.Permission.Requirements
    req: Request
  }) => {
    const connectedUser = await this.checkUserConnected(req)
    const hasPermission = await this.checkPermissions({
      workspaceId: req.params.workspaceId as Ip.WorkspaceId,
      formId: PermissionService.searchWhereIsFormId(req),
      user: connectedUser,
      permissions,
    })
    if (!hasPermission) throw new HttpError.Forbidden(`Permissions does not match`, {permissions})
  }

  private static readonly searchWhereIsFormId = (req: Request) => {
    return (req.params.formId ?? req.body.formId ?? req.query.formId) as Ip.FormId | undefined
  }

  readonly checkUserConnected = async (req: Request): Promise<Ip.User> => {
    const email = req.session.app?.user.email
    if (!email) {
      throw new HttpError.Forbidden('auth_user_not_connected')
    }
    const user = await UserService.getInstance(this.prisma).getByEmail(email)
    if (!user) {
      throw new HttpError.Forbidden('user_not_allowed')
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
    permissions?: Ip.Permission.Requirements
    workspaceId?: Ip.WorkspaceId
    formId?: Ip.FormId
  }): Promise<boolean> {
    if (!permissions) return false
    if (permissions.global && (await this.canGlobal(user, permissions.global))) return true
    if (permissions.workspace) {
      if (!workspaceId) throw new HttpError.BadRequest('Missing workspaceId')
      if (await this.canWorkspace({user, workspaceId, required: permissions.workspace})) return true
    }
    if (permissions.form) {
      if (!workspaceId) throw new HttpError.BadRequest('Missing workspaceId')
      if (!formId) throw new HttpError.BadRequest('Missing formId')
      if (await this.canForm({user, workspaceId, formId, required: permissions.form})) return true
    }
    return false
  }

  async getGlobal({user}: {user: Ip.User}): Promise<Ip.Permission.Global> {
    return Permission.Evaluate.global(user)
  }

  async getByWorkspace({
    user,
    workspaceId,
  }: {
    user: Ip.User
    workspaceId: Ip.WorkspaceId
  }): Promise<Ip.Permission.Workspace> {
    const wsAccess = await this.workspace.getByUser({workspaceId, user})
    return Permission.Evaluate.workspace(user, wsAccess)
  }

  async getByForm({
    user,
    workspaceId,
    formId,
  }: {
    user: Ip.User
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
  }): Promise<Ip.Permission.Form> {
    const wsAccess = await this.workspace.getByUser({workspaceId, user})
    const formAccesses = await this.formAccess
      .search({workspaceId, formId, user})
      .then(_ => _.filter(_ => _.formId === formId))
    return Permission.Evaluate.form(user, wsAccess, formAccesses)
  }

  private async canGlobal(user: Ip.User, required: Array<keyof Ip.Permission.Global>): Promise<boolean> {
    const evals = await this.getGlobal({user})
    return required.some(perm => evals[perm])
  }

  private async canWorkspace({
    user,
    workspaceId,
    required,
  }: {
    user: Ip.User
    workspaceId: Ip.WorkspaceId
    required: Array<keyof Ip.Permission.Workspace>
  }): Promise<boolean> {
    const evals = await this.getByWorkspace({user, workspaceId})
    return required.some(perm => evals[perm])
  }

  private async canForm({
    user,
    workspaceId,
    formId,
    required,
  }: {
    user: Ip.User
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
    required: Array<keyof Ip.Permission.Form>
  }): Promise<boolean> {
    const evals = await this.getByForm({user, workspaceId, formId})
    return required.some(perm => evals[perm])
  }
}
