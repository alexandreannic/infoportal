import {PrismaClient} from '@infoportal/prisma'
import {Request} from 'express'
import {Api, HttpError} from '@infoportal/api-sdk'
import {UserService} from './user/UserService.js'
import {FormAccessService} from './form/access/FormAccessService.js'
import {WorkspaceAccessService} from './workspace/WorkspaceAccessService.js'

export class PermissionService {
  constructor(
    private prisma: PrismaClient,
    private workspace = new WorkspaceAccessService(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly hasPermission = async ({
    permissions,
    req,
    connectedUser,
  }: {
    connectedUser: Api.User
    permissions?: Api.Permission.Requirements
    req: Request
  }) => {
    return this.checkPermissions({
      workspaceId: (req.params.workspaceId ?? req.body.workspaceId) as Api.WorkspaceId,
      formId: PermissionService.searchWhereIsFormId(req),
      user: connectedUser,
      permissions,
    })
  }

  private static readonly searchWhereIsFormId = (req: Request) => {
    return (req.params.formId ?? req.body.formId ?? req.query.formId) as Api.FormId | undefined
  }

  readonly checkUserConnected = async (req: Request): Promise<Api.User> => {
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
    user: Api.User
    permissions?: Api.Permission.Requirements
    workspaceId?: Api.WorkspaceId
    formId?: Api.FormId
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

  async getGlobal({user}: {user: Api.User}): Promise<Api.Permission.Global> {
    return Api.Permission.Helper.Evaluate.global(user)
  }

  async getByWorkspace({
    user,
    workspaceId,
  }: {
    user: Api.User
    workspaceId: Api.WorkspaceId
  }): Promise<Api.Permission.Workspace> {
    const wsAccess = await this.workspace.getByUser({workspaceId, user})
    return Api.Permission.Helper.Evaluate.workspace(user, wsAccess)
  }

  async getByForm({
    user,
    workspaceId,
    formId,
  }: {
    user: Api.User
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
  }): Promise<Api.Permission.Form> {
    const wsAccess = await this.workspace.getByUser({workspaceId, user})
    const formAccesses = await this.formAccess
      .search({workspaceId, formId, user})
      .then(_ => _.filter(_ => _.formId === formId))
    return Api.Permission.Helper.Evaluate.form(user, wsAccess, formAccesses)
  }

  private async canGlobal(user: Api.User, required: Array<keyof Api.Permission.Global>): Promise<boolean> {
    const evals = await this.getGlobal({user})
    return required.some(perm => evals[perm])
  }

  private async canWorkspace({
    user,
    workspaceId,
    required,
  }: {
    user: Api.User
    workspaceId: Api.WorkspaceId
    required: Array<keyof Api.Permission.Workspace>
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
    user: Api.User
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
    required: Array<keyof Api.Permission.Form>
  }): Promise<boolean> {
    const evals = await this.getByForm({user, workspaceId, formId})
    return required.some(perm => evals[perm])
  }
}
