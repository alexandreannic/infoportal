import express, {NextFunction, Request, Response} from 'express'
import {app, AppLogger} from '../index.js'
import {ControllerMain} from './controller/ControllerMain.js'
import {PrismaClient} from '@prisma/client'
import {ControllerKoboApi} from './controller/kobo/ControllerKoboApi.js'
import {ControllerSession} from './controller/ControllerSession.js'
import {ControllerUser} from './controller/ControllerUser.js'
import {HttpError, Ip, ipContract, Meta} from 'infoportal-api-sdk'
import {ControllerProxy} from './controller/ControllerProxy.js'
import {ControllerGroup} from './controller/ControllerGroup.js'
import {ControllerJsonStore} from './controller/ControllerJsonStore.js'
import {ControllerKoboAnswerHistory} from './controller/kobo/ControllerKoboAnswerHistory.js'
import {ControllerCache} from './controller/ControllerCache.js'
import {UserService} from '../feature/user/UserService.js'
import {ControllerDatabaseView} from './controller/ControllerDatabaseView.js'
import {ControllerKoboApiXlsImport} from './controller/kobo/ControllerKoboApiXlsImport.js'
import {AuthRequest} from '../typings'
import multer from 'multer'
import {initServer} from '@ts-rest/express'
import {FormVersionService} from '../feature/form/FormVersionService.js'
import {KoboFormService} from '../feature/kobo/KoboFormService.js'
import {ServerService} from '../feature/ServerService.js'
import {FormService} from '../feature/form/FormService.js'
import {ErrorHttpStatusCode, SuccessfulHttpStatusCode} from '@ts-rest/core'
import {FormAccessService} from '../feature/form/access/FormAccessService.js'
import {PermissionService} from '../feature/PermissionService.js'
import {WorkspaceService} from '../feature/workspace/WorkspaceService.js'
import {WorkspaceAccessService} from '../feature/workspace/WorkspaceAccessService.js'
import {SubmissionService} from '../feature/form/submission/SubmissionService.js'
import {WorkspaceInvitationService} from '../feature/workspace/WorkspaceInvitationService.js'
import {MetricsService} from '../feature/MetricsService.js'

export const isAuthenticated = (req: Request): req is AuthRequest => {
  return !!req.session.app && !!req.session.app.user
}

const uploader = multer({dest: 'uploads/'})

export const getRoutes = (prisma: PrismaClient, log: AppLogger = app.logger('Routes')) => {
  const safe = <T extends Request>(handler: (req: T, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: T, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next)
      } catch (err) {
        log.error(req.url + '' + req.session.app?.user.email)
        next(err)
      }
    }
  }

  const r = express.Router()
  const main = new ControllerMain()
  const koboApi = new ControllerKoboApi(prisma)
  const session = new ControllerSession(prisma)
  const accessGroup = new ControllerGroup(prisma)
  const user = new ControllerUser(prisma)
  const proxy = new ControllerProxy(prisma)
  const jsonStore = new ControllerJsonStore(prisma)
  const koboAnswerHistory = new ControllerKoboAnswerHistory(prisma)
  const databaseView = new ControllerDatabaseView(prisma)
  const cacheController = new ControllerCache()
  const importData = new ControllerKoboApiXlsImport(prisma)

  interface HandlerArgs<TReq = Request, TParams = any, TBody = any, TQuery = any> {
    req: TReq
    query?: TQuery
    res: Response
    params?: TParams
    body?: TBody
    headers: any
    file?: unknown //Express.Multer.File
    files?: unknown //Express.Multer.File[]
  }

  const auth = (options: {adminOnly?: true} = {}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      //req.session.app.user = {
      //   email: 'alexandre.annic@drc.ngo',
      //   admin: true,
      // } as any
      // next()
      try {
        const email = req.session.app?.user.email
        if (!email) {
          throw new HttpError.Forbidden('auth_user_not_connected')
        }
        const user = await UserService.getInstance(prisma).getByEmail(email)
        if (!user) {
          throw new HttpError.Forbidden('user_not_allowed')
        }
        if (options.adminOnly && user.accessLevel === Ip.AccessLevel.Admin) {
          throw new HttpError.Forbidden('user_not_admin')
        }
        next()
      } catch (e) {
        next(e)
      }
    }
  }

  const ok200 = <T>(body: T): {status: SuccessfulHttpStatusCode; body: T} => {
    return {
      status: 200,
      body: body as T,
    }
  }

  const ok204 = <T>(body: T): {status: 204; body: undefined} => {
    return {
      status: 204,
      body: {} as unknown as undefined,
    }
  }

  type ErrBody = {message: string; data?: object}

  const notFound = (): {status: ErrorHttpStatusCode; body: ErrBody} => {
    return {status: 404, body: {message: 'Resource not found'}}
  }

  const okOrNotFound = <T>(
    body: T,
  ): {status: SuccessfulHttpStatusCode; body: T} | {status: ErrorHttpStatusCode; body: ErrBody} => {
    return body ? ok200(body) : notFound()
  }

  const handleError = (e: Error): {status: ErrorHttpStatusCode; body: ErrBody} => {
    const statusMap = new Map<Function, ErrorHttpStatusCode>([
      [HttpError.Conflict, 409],
      [HttpError.Forbidden, 403],
      [HttpError.NotFound, 404],
    ])

    const status = Array.from(statusMap.entries()).find(([ErrClass]) => e instanceof ErrClass)?.[1] ?? 500

    log.error(status + ':' + e.name + ' - ' + e.message)
    return {
      status,
      body: {
        message: e.message,
        data: (e as any)?.data,
      },
    }
  }

  const workspace = new WorkspaceService(prisma)
  const workspaceAccess = new WorkspaceAccessService(prisma)
  const workspaceInvitation = new WorkspaceInvitationService(prisma)
  const koboForm = new KoboFormService(prisma)
  const form = new FormService(prisma)
  const formVersion = new FormVersionService(prisma)
  const formAccess = new FormAccessService(prisma)
  const formSubmission = new SubmissionService(prisma)
  const server = new ServerService(prisma)
  const permission = new PermissionService(prisma, undefined, formAccess)
  const metrics = new MetricsService(prisma)

  const auth2 = async <T extends HandlerArgs>(args: T): Promise<Omit<T, 'req'> & {req: AuthRequest<T['req']>}> => {
    const connectedUser = await permission.checkUserConnected(args.req)
    if (!connectedUser) {
      throw new HttpError.Forbidden('User not connected.')
    }
    const meta: Meta | undefined = (args.req as any).tsRestRoute.metadata
    if (meta) {
      const permissions = meta.access
      const hasPermission = await permission.hasPermission({req: args.req, permissions, connectedUser})
      if (!hasPermission) throw new HttpError.Forbidden(`Permissions does not match`, {permissions})
    }
    return args as any
  }

  const ensureFile = <T extends HandlerArgs>(args: T): Promise<T & {file: Express.Multer.File}> => {
    return new Promise((resolve, reject) => {
      if (!args.req.file) {
        return reject(new HttpError.BadRequest('Missing file.'))
      }
      return resolve(args as any)
    })
  }

  const s = initServer()

  const tsRestRouter = s.router(ipContract, {
    workspace: {
      getMine: _ =>
        auth2(_)
          .then(({req}) => workspace.getByUser(req.session.app.user.email))
          .then(ok200)
          .catch(handleError),
      checkSlug: _ =>
        auth2(_)
          .then(({body}) => workspace.checkSlug(body.slug))
          .then(ok200)
          .catch(handleError),
      create: _ =>
        auth2(_)
          .then(({body, req}) => workspace.create(body, req.session.app.user))
          .then(ok200)
          .catch(handleError),
      update: _ =>
        auth2(_)
          .then(({body, params}) => workspace.update(params.id, body))
          .then(ok200)
          .catch(handleError),
      remove: _ =>
        auth2(_)
          .then(({params}) => workspace.remove(params.id))
          .then(ok204)
          .catch(handleError),
      invitation: {
        remove: _ =>
          auth2(_)
            .then(({params}) => workspaceInvitation.remove(params))
            .then(ok204)
            .catch(handleError),
        create: _ =>
          auth2(_)
            .then(({body, params, req}) => workspaceInvitation.create({...body, ...params}, req.session.app.user.email))
            .then(ok200)
            .catch(handleError),
        accept: _ =>
          auth2(_)
            .then(({params, body}) => workspaceInvitation.accept({id: params.id, accept: body.accept}))
            .then(ok204)
            .catch(handleError),
        getMine: _ =>
          auth2(_)
            .then(({req}) => workspaceInvitation.getByUser({user: req.session.app.user}))
            .then(ok200)
            .catch(handleError),
        search: _ =>
          auth2(_)
            .then(({params}) => workspaceInvitation.getByWorkspace({workspaceId: params.workspaceId}))
            .then(ok200)
            .catch(handleError),
      },
      access: {},
    },
    permission: {
      getMineGlobal: _ =>
        auth2(_)
          .then(({req}) =>
            permission.getGlobal({
              user: req.session.app?.user,
            }),
          )
          .then(ok200)
          .catch(handleError),
      getMineByWorkspace: _ =>
        auth2(_)
          .then(({params, req}) =>
            permission.getByWorkspace({
              user: req.session.app?.user,
              ...params,
            }),
          )
          .then(ok200)
          .catch(handleError),
      getMineByForm: _ =>
        auth2(_)
          .then(({params, req}) =>
            permission.getByForm({
              user: req.session.app?.user,
              ...params,
            }),
          )
          .then(ok200)
          .catch(handleError),
    },
    server: {
      delete: _ =>
        auth2(_)
          .then(({params}) => server.delete({id: params.id}))
          .then(ok204)
          .catch(handleError),
      create: _ =>
        auth2(_)
          .then(({params, body}) => server.create({workspaceId: params.workspaceId, ...body}))
          .then(ok200)
          .catch(handleError),
      getAll: _ =>
        auth2(_)
          .then(({params}) => server.getAll(params))
          .then(ok200)
          .catch(handleError),
      get: _ =>
        auth2(_)
          .then(({params}) => server.get(params))
          .then(okOrNotFound)
          .catch(handleError),
    },
    kobo: {
      importFromKobo: _ =>
        auth2(_)
          .then(({req, body, params}) =>
            koboForm.importFromKobo({
              ...body,
              uploadedBy: req.session.app?.user.email!,
              workspaceId: params.workspaceId,
            }),
          )
          .then(ok200)
          .catch(handleError),
    },
    submission: {
      submit: ({params, body, req}) =>
        formSubmission
          .submit({
            ...params,
            ...body,
            author: req.session.app?.user?.email,
          })
          .then(ok200)
          .catch(handleError),
      updateAnswers: _ =>
        auth2(_)
          .then(({req, params, body}) =>
            formSubmission.updateAnswers({...body, ...params, authorEmail: req.session.app?.user.email!}),
          )
          .then(ok200)
          .catch(handleError),
      updateValidation: _ =>
        auth2(_)
          .then(({req, params, body}) =>
            formSubmission.updateValidation({...body, ...params, authorEmail: req.session.app?.user.email!}),
          )
          .then(ok200)
          .catch(handleError),
      remove: _ =>
        auth2(_)
          .then(({req, params, body}) =>
            formSubmission.deleteAnswers({...body, ...params, authorEmail: req.session.app?.user.email!}),
          )
          .then(ok204)
          .catch(handleError),
      search: _ =>
        auth2(_)
          .then(({req, params, body}) =>
            formSubmission.searchAnswersByUsersAccess({
              ...body,
              ...params,
              user: req.session.app.user,
            }),
          )
          .then(ok200)
          .catch(handleError),
    },
    form: {
      disconnectFromKobo: _ =>
        auth2(_)
          .then(({params}) => form.disconnectFromKobo(params))
          .then(ok200)
          .catch(handleError),
      update: _ =>
        auth2(_)
          .then(({params, body}) => form.update({...params, ...body}))
          .then(ok200)
          .catch(handleError),
      remove: _ =>
        auth2(_)
          .then(({params}) => form.remove(params.formId))
          .then(ok204)
          .catch(handleError),
      getAll: _ =>
        auth2(_)
          .then(({params}) => form.getAll({wsId: params.workspaceId}))
          .then(ok200)
          .catch(handleError),
      getMine: _ =>
        auth2(_)
          .then(({params, req}) => form.getByUser({user: req.session.app.user, workspaceId: params.workspaceId}))
          .then(ok200)
          .catch(handleError),
      get: ({params}) => form.get(params.formId).then(okOrNotFound).catch(handleError),
      create: _ =>
        auth2(_).then(({req, body, params}) =>
          form
            .create({
              uploadedBy: req.session.app?.user.email!,
              workspaceId: params.workspaceId,
              ...body,
            })
            .then(ok200)
            .catch(handleError),
        ),
      refreshAll: _ =>
        auth2(_)
          .then(({req, params}) =>
            koboForm.refreshAll({
              byEmail: req.session.app?.user.email!,
              wsId: params.workspaceId,
            }),
          )
          .then(ok200)
          .catch(handleError),
      getSchema: ({params}) => form.getSchema({formId: params.formId}).then(ok200).catch(handleError),
      getSchemaByVersion: _ =>
        auth2(_)
          .then(({params}) => form.getSchemaByVersion({formId: params.formId, versionId: params.versionId}))
          .then(ok200)
          .catch(handleError),
      access: {
        create: _ =>
          auth2(_)
            .then(({params, body}) => formAccess.create({...params, ...body}))
            .then(ok200)
            .catch(handleError),
        update: _ =>
          auth2(_)
            .then(({params, body}) => formAccess.update({...params, ...body}))
            .then(ok200)
            .catch(handleError),
        remove: _ =>
          auth2(_)
            .then(({req, params}) => formAccess.remove({id: params.id, deletedByEmail: req.session.app.user.email}))
            .then(ok204)
            .catch(handleError),
        search: _ =>
          auth2(_)
            .then(({params, body, req}) => formAccess.search({formId: body.formId, workspaceId: params.workspaceId}))
            .then(ok200)
            .catch(handleError),
        searchMine: _ =>
          auth2(_)
            .then(({params, req, body}) =>
              formAccess.search({formId: body.formId, workspaceId: params.workspaceId, user: req.session.app.user}),
            )
            .then(ok200)
            .catch(handleError),
      },
      version: {
        validateXlsForm: {
          middleware: [uploader.single('file')],
          handler: _ =>
            auth2(_)
              .then(ensureFile)
              .then(({file}) => formVersion.validateAndParse(file.path))
              .then(ok200)
              .catch(handleError),
        },
        uploadXlsForm: {
          middleware: [uploader.single('file')],
          handler: _ =>
            auth2(_)
              .then(ensureFile)
              .then(({params, req, body}) =>
                formVersion.upload({
                  uploadedBy: req.session.app.user.email,
                  formId: params.formId,
                  file: req.file!,
                  message: body.message,
                }),
              )
              .then(ok200)
              .catch(handleError),
        },
        getByFormId: _ =>
          auth2(_)
            .then(({params}) => formVersion.getVersions({formId: params.formId}))
            .then(ok200)
            .catch(handleError),
        deployLast: _ =>
          auth2(_)
            .then(({req, params}) => formVersion.deployLastDraft({formId: params.formId}))
            .then(ok200)
            .catch(handleError),
      },
    },
    metrics: {
      getUsersByDate: _ =>
        auth2(_)
          .then(({req, params, query}) =>
            metrics.usersByDate({...params, user: req.session.app.user, ...parseMetricsQs(query)}),
          )
          .then(ok200)
          .catch(handleError),
      getSubmissionsBy: _ =>
        auth2(_)
          .then(({req, params, query}) =>
            metrics.submissionsBy({...params, user: req.session.app.user, ...parseMetricsQs(query)}),
          )
          .then(ok200)
          .catch(handleError),
    },
  })

  function parseMetricsQs(
    _: Partial<Record<keyof Ip.Metrics.Payload.Filter, string | string[]>>,
  ): Ip.Metrics.Payload.Filter {
    const res = _ as any
    if (res.end) res.end = new Date(res.end)
    if (res.start) res.start = new Date(res.start)
    return res
  }

  try {
    r.get('/', safe(main.ping))

    r.post('/session/track', safe(session.track))
    r.post('/session/login', safe(session.login))
    r.post('/session/connect-as', auth({adminOnly: true}), safe(session.connectAs))
    r.post('/session/connect-as-revert', auth(), safe(session.revertConnectAs))
    r.delete('/session', safe(session.logout))
    r.get('/session/me', safe(session.getMe))

    r.get('/proxy/:slug', safe(proxy.redirect))
    r.put('/proxy', auth({adminOnly: true}), safe(proxy.create))
    r.post('/proxy/:id', auth({adminOnly: true}), safe(proxy.update))
    r.delete('/proxy/:id', auth({adminOnly: true}), safe(proxy.delete))
    r.get('/proxy', safe(proxy.search))

    r.get('/:workspaceId/group/item', auth({adminOnly: true}), safe(accessGroup.getItems))
    r.post('/:workspaceId/group/item/:id', auth({adminOnly: true}), safe(accessGroup.updateItem))
    r.delete('/:workspaceId/group/item/:id', auth({adminOnly: true}), safe(accessGroup.removeItem))
    r.put('/:workspaceId/group/:id/item', auth({adminOnly: true}), safe(accessGroup.createItem))
    r.post('/:workspaceId/group', auth({adminOnly: true}), safe(accessGroup.searchWithItems))
    r.put('/:workspaceId/group', auth({adminOnly: true}), safe(accessGroup.create))
    r.post('/:workspaceId/group/:id', auth({adminOnly: true}), safe(accessGroup.update))
    r.delete('/:workspaceId/group/:id', auth({adminOnly: true}), safe(accessGroup.remove))

    r.get('/user/avatar/:email', auth(), safe(user.avatar))
    r.post('/:workspaceId/user/me', auth(), safe(user.updateMe))
    r.get('/:workspaceId/user', auth(), safe(user.search))
    r.get('/:workspaceId/user/drc-job', auth(), safe(user.getDrcJobs))

    r.post('/proxy-request', safe(main.proxy))

    r.post('/kobo-api/webhook', safe(koboApi.handleWebhookNewAnswers))
    r.post('/kobo-api/sync', auth({adminOnly: true}), safe(koboApi.syncAnswersAll))
    r.post('/kobo-api/schema', auth(), safe(koboApi.searchSchemas))
    r.post('/kobo-api/:formId/sync', auth(), safe(koboApi.syncAnswersByForm))
    r.get(
      '/kobo-api/:formId/submission/:submissionId/attachment/:attachmentId',
      safe(koboApi.getAttachementsWithoutAuth),
    )
    r.get('/kobo-api/:formId/edit-url/:answerId', safe(koboApi.edit))
    r.post('/kobo-api/proxy', safe(koboApi.proxy))
    r.post(
      '/kobo-api/:formId/import-from-xls',
      auth(),
      uploader.single('uf-import-answers'),
      safe(importData.handleFileUpload),
    )

    r.post('/kobo-answer-history/search', safe(koboAnswerHistory.search))

    r.post(`/database-view/:viewId/col/:colName`, auth(), safe(databaseView.updateCol))
    r.post(`/database-view`, auth(), safe(databaseView.search))
    r.put(`/database-view/:databaseId`, auth(), safe(databaseView.create))
    r.post(`/database-view/:id`, auth(), safe(databaseView.update))
    r.delete(`/database-view/:viewId`, auth(), safe(databaseView.delete))

    r.get('/json-store/:key', auth(), safe(jsonStore.get))
    r.put('/json-store', auth(), safe(jsonStore.set))
    r.patch('/json-store', auth(), safe(jsonStore.update))

    r.get('/cache', cacheController.get)
    r.post('/cache/clear', cacheController.clear)

    // r.get('/legalaid', auth(), safe(legalaid.index))
    // r.get('/ecrec', auth(), safe(ecrec.index))
    // r.get('/*', safe(ecrec.index))
  } catch (e) {
    if (e instanceof Error) {
      log.error(e.toString())
    }
    log.error(e)
    console.error(e)
  }
  return {rawRoutes: r, tsRestRoutes: tsRestRouter}
}
