import express, {NextFunction, Request, Response} from 'express'
import {app, AppLogger} from '../index.js'
import {ControllerMain} from './controller/ControllerMain.js'
import {PrismaClient} from '@prisma/client'
import {ControllerKoboApi} from './controller/kobo/ControllerKoboApi.js'
import {ControllerSession} from './controller/ControllerSession.js'
import {ControllerKoboForm} from './controller/kobo/ControllerKoboForm.js'
import {ControllerKoboServer} from './controller/kobo/ControllerKoboServer.js'
import {ControllerKoboAnswer} from './controller/kobo/ControllerKoboAnswer.js'
import {ControllerAccess} from './controller/ControllerAccess.js'
import {ControllerUser} from './controller/ControllerUser.js'
import {AppError} from '../helper/Errors.js'
import {ControllerProxy} from './controller/ControllerProxy.js'
import {ControllerGroup} from './controller/ControllerGroup.js'
import {ControllerJsonStore} from './controller/ControllerJsonStore.js'
import {ControllerKoboAnswerHistory} from './controller/kobo/ControllerKoboAnswerHistory.js'
import {ControllerCache} from './controller/ControllerCache.js'
import {UserService} from '../feature/user/UserService.js'
import {ControllerDatabaseView} from './controller/ControllerDatabaseView.js'
import {ControllerKoboApiXlsImport} from './controller/kobo/ControllerKoboApiXlsImport.js'
import {ControllerWorkspace} from './controller/ControllerWorkspace.js'
import {AuthRequest} from '../typings'
import {ControllerWorkspaceAccess} from './controller/ControllerWorkspaceAccess.js'
import {UUID} from 'infoportal-common'
import multer from 'multer'
import {initServer} from '@ts-rest/express'
import {ipContract} from 'infoportal-api-sdk'
import {FormVersionService} from '../feature/kobo/FormVersionService.js'

export const isAuthenticated = (req: Request): req is AuthRequest => {
  return !!req.session.app && !!req.session.app.user
}

export const getWorkspaceId = (req: Request): UUID => {
  return req.params.workspaceId
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
  const workspace = new ControllerWorkspace(prisma)
  const workspaceAccess = new ControllerWorkspaceAccess(prisma)
  const koboForm = new ControllerKoboForm(prisma)
  const koboServer = new ControllerKoboServer(prisma)
  const koboAnswer = new ControllerKoboAnswer(prisma)
  const koboApi = new ControllerKoboApi(prisma)
  const session = new ControllerSession(prisma)
  const access = new ControllerAccess(prisma)
  const accessGroup = new ControllerGroup(prisma)
  const user = new ControllerUser(prisma)
  const proxy = new ControllerProxy(prisma)
  const jsonStore = new ControllerJsonStore(prisma)
  const koboAnswerHistory = new ControllerKoboAnswerHistory(prisma)
  const databaseView = new ControllerDatabaseView(prisma)
  const cacheController = new ControllerCache()
  const importData = new ControllerKoboApiXlsImport(prisma)

  interface HandlerArgs<TReq = Request, TParams = any, TBody = any> {
    req: Request
    res: Response
    params: TParams
    body?: TBody
    headers: any
    file?: unknown //Express.Multer.File
    files?: unknown //Express.Multer.File[]
  }

  const checkAccess = async <T extends HandlerArgs>(
    access: Access = {},
    args: T,
  ): Promise<Omit<T, 'req'> & {req: AuthRequest}> => {
    const email = args.req.session.app?.user.email
    if (!email) {
      throw new AppError.Forbidden('auth_user_not_connected')
    }
    const user = await UserService.getInstance(prisma).getUserByEmail(email)
    if (!user) {
      throw new AppError.Forbidden('user_not_allowed')
    }
    if (access.level === 'admin' && access.scope === 'global' && !user.admin) {
      throw new AppError.Forbidden('user_not_admin')
    }
    return args as any
  }

  const ok = <T>(body: T): {status: 200; body: T} => {
    return {status: 200, body}
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
          throw new AppError.Forbidden('auth_user_not_connected')
        }
        const user = await UserService.getInstance(prisma).getUserByEmail(email)
        if (!user) {
          throw new AppError.Forbidden('user_not_allowed')
        }
        if (options.adminOnly && !user.admin) {
          throw new AppError.Forbidden('user_not_admin')
        }
        next()
      } catch (e) {
        next(e)
      }
    }
  }

  type Access = {
    level?: 'read' | 'write' | 'admin'
    scope?: 'global' | 'workspace' | 'form'
  }

  type WithAuthOptions = {
    ensureFile?: boolean
    access?: Access
  }

  type EnrichedRequest<TArgs extends HandlerArgs, Opts extends WithAuthOptions> = AuthRequest<TArgs['req']> &
    (Opts['ensureFile'] extends true ? {file: Express.Multer.File} : {}) // & (Opts['access'] extends true ? {admin: true} : {})

  function controller<Opts extends WithAuthOptions, TArgs extends HandlerArgs, TResult>(
    options: Opts,
    handler: (args: Omit<TArgs, 'req'> & {req: EnrichedRequest<TArgs, Opts>}) => Promise<TResult>,
  ): (args: TArgs) => Promise<{status: 200; body: TResult}> {
    return async (args: TArgs) => {
      await checkAccess(options.access, args as any)

      if (options.ensureFile && !args.req.file) {
        throw new AppError.BadRequest('Missing file.')
      }

      return ok(await handler(args as any)) // still needs `as any`, but contained
    }
  }

  const formVersion = new FormVersionService(prisma)

  const s = initServer()
  const tsRestRouter = s.router(ipContract, {
    form: {
      version: {
        validateXlsForm: {
          middleware: [uploader.single('file')],
          handler: controller({ensureFile: true}, async ({req}) => {
            return formVersion.validateAndParse(req.file.path)
          }),
        },
        uploadXlsForm: {
          middleware: [uploader.single('file')],
          handler: controller({ensureFile: true}, async ({params, req, body}) => {
            return formVersion.upload({
              uploadedBy: req.session.app.user.email,
              formId: params.formId,
              file: req.file!,
              message: body.message,
            })
          }),
        },
        getSchema: controller({}, async ({req, params}) => {
          return formVersion.getSchema({formId: params.formId, versionId: params.versionId}) as any
        }),
        getByFormId: controller({}, ({params}) => {
          return formVersion.getVersions({formId: params.formId})
        }),
        deployLast: controller({}, async ({req, params}) => {
          return formVersion.deployLastDraft({formId: params.formId})
        })
      },
    },
  })

  try {
    r.get('/', safe(main.ping))

    r.post('/session/track', safe(session.track))
    r.post('/session/login', safe(session.login))
    r.post('/session/connect-as', auth({adminOnly: true}), safe(session.connectAs))
    r.post('/session/connect-as-revert', auth(), safe(session.revertConnectAs))
    r.delete('/session', safe(session.logout))
    r.get('/session/me', safe(session.getMe))

    r.get('/workspace/me', auth(), safe(workspace.getMine))
    r.put('/workspace', auth(), safe(workspace.create))
    r.post('/workspace/check-slug', auth(), safe(workspace.checkSlug))
    r.post('/workspace/:id', auth(), safe(workspace.update))
    r.delete('/workspace/:id', safe(workspace.remove))

    r.put('/workspace-access', safe(workspaceAccess.create))

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

    r.get('/:workspaceId/access/me', auth(), safe(access.searchMine))
    r.get('/:workspaceId/access', auth(), safe(access.search))
    r.put('/:workspaceId/access', auth(), safe(access.create))
    r.post('/:workspaceId/access/:id', auth(), safe(access.update))
    r.delete('/:workspaceId/access/:id', auth(), safe(access.remove))

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
    r.get('/kobo-api/:formId/schema', auth(), safe(koboApi.getSchema))
    r.get('/kobo-api/:formId/edit-url/:answerId', safe(koboApi.edit))
    r.post('/kobo-api/proxy', safe(koboApi.proxy))
    r.post(
      '/kobo-api/:formId/import-from-xls',
      auth(),
      uploader.single('uf-import-answers'),
      safe(importData.handleFileUpload),
    )

    r.post('/kobo-answer-history/search', safe(koboAnswerHistory.search))

    r.put('/:workspaceId/kobo/server', auth(), safe(koboServer.create))
    r.delete('/:workspaceId/kobo/server/:id', auth(), safe(koboServer.delete))
    r.get('/:workspaceId/kobo/server', auth(), safe(koboServer.getAll))

    r.get('/:workspaceId/form', auth(), safe(koboForm.getAll))
    r.post('/:workspaceId/form/refresh', auth(), safe(koboForm.refreshAll))
    r.get('/:workspaceId/form/:id', auth(), safe(koboForm.get))
    r.put('/:workspaceId/form', auth(), safe(koboForm.add))

    // r.post('/:workspaceId/form/:formId/schema', auth(), uploader.single('uf-xlsform'), safe(schema.uploadXlsForm))
    // r.post(
    //   '/:workspaceId/form/:formId/schema/validate',
    //   auth(),
    //   uploader.single('uf-xlsform'),
    //   safe(schema.validateXlsForm),
    // )
    // r.get('/:workspaceId/form/:formId/schema', auth(), safe(schema.get))
    // r.post('/:workspaceId/form/:formId/schema/:versionId', auth(), safe(schema.updateVersion))

    r.post('/:workspaceId/form/:formId/answer/by-access', auth(), safe(koboAnswer.searchByUserAccess))
    r.patch('/:workspaceId/form/:formId/answer/validation', auth(), safe(koboAnswer.updateValidation))
    r.patch('/:workspaceId/form/:formId/answer', auth(), safe(koboAnswer.updateAnswers))
    r.delete('/:workspaceId/form/:formId/answer', auth({adminOnly: true}), safe(koboAnswer.deleteAnswers))
    r.post('/:workspaceId/form/:formId/answer', safe(koboAnswer.search))

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
