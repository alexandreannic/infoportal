import express, {NextFunction, Request, Response} from 'express'
import {app, AppLogger} from '../index.js'
import {ControllerMain} from './controller/ControllerMain.js'
import {PrismaClient} from '@prisma/client'
import {ControllerKoboApi} from './controller/kobo/ControllerKoboApi.js'
import {ControllerSession} from './controller/ControllerSession.js'
import {ControllerKoboForm} from './controller/kobo/ControllerKoboForm.js'
import {ControllerKoboServer} from './controller/kobo/ControllerKoboServer.js'
import {ControllerKoboAnswer} from './controller/kobo/ControllerKoboAnswer.js'
import {Server} from './Server.js'
import {ControllerAccess} from './controller/ControllerAccess.js'
import {ControllerUser} from './controller/ControllerUser.js'
import {AppSession} from '../feature/session/AppSession.js'
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

export const isAuthenticated = (req: Request): req is AuthRequest => {
  return !!req.session.app && !!req.session.app.user
}

export const getRoutes = (prisma: PrismaClient, log: AppLogger = app.logger('Routes')) => {
  const errorCatcher = <T extends Request>(handler: (req: T, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: T, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next)
      } catch (err) {
        log.error(req.url + '' + req.session.app?.user.email)
        next(err)
      }
    }
  }

  const router = express.Router()
  const main = new ControllerMain()
  const workspace = new ControllerWorkspace(prisma)
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

  const auth =
    ({adminOnly = false}: {adminOnly?: boolean} = {}) =>
    async (req: Request, res: Response, next: NextFunction) => {
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
        if (adminOnly && !user.admin) {
          throw new AppError.Forbidden('user_not_admin')
        }
        next()
      } catch (e) {
        next(e)
      }
    }

  try {
    router.get('/', errorCatcher(main.ping))

    router.post('/session/track', errorCatcher(session.track))
    router.post('/session/login', errorCatcher(session.login))
    router.post('/session/connect-as', auth({adminOnly: true}), errorCatcher(session.connectAs))
    router.post('/session/connect-as-revert', auth(), errorCatcher(session.revertConnectAs))
    router.delete('/session', errorCatcher(session.logout))
    router.get('/session/me', errorCatcher(session.getMe))

    router.put('/workspace', auth(), errorCatcher(workspace.create))
    router.post('/workspace/check-slug', auth(), errorCatcher(workspace.checkSlug))
    router.post('/workspace/:id', auth(), errorCatcher(workspace.update))
    router.delete('/workspace/:id', errorCatcher(workspace.remove))

    router.get('/proxy/:slug', errorCatcher(proxy.redirect))
    router.put('/proxy', auth({adminOnly: true}), errorCatcher(proxy.create))
    router.post('/proxy/:id', auth({adminOnly: true}), errorCatcher(proxy.update))
    router.delete('/proxy/:id', auth({adminOnly: true}), errorCatcher(proxy.delete))
    router.get('/proxy', errorCatcher(proxy.search))

    router.get('/group/item', auth({adminOnly: true}), errorCatcher(accessGroup.getItems))
    router.post('/group/item/:id', auth({adminOnly: true}), errorCatcher(accessGroup.updateItem))
    router.delete('/group/item/:id', auth({adminOnly: true}), errorCatcher(accessGroup.removeItem))
    router.put('/group/:id/item', auth({adminOnly: true}), errorCatcher(accessGroup.createItem))
    router.post('/group', auth({adminOnly: true}), errorCatcher(accessGroup.searchWithItems))
    router.put('/group', auth({adminOnly: true}), errorCatcher(accessGroup.create))
    router.post('/group/:id', auth({adminOnly: true}), errorCatcher(accessGroup.update))
    router.delete('/group/:id', auth({adminOnly: true}), errorCatcher(accessGroup.remove))

    router.get('/access/me', auth(), errorCatcher(access.searchMine))
    router.get('/access', auth(), errorCatcher(access.search))
    router.put('/access', auth(), errorCatcher(access.create))
    router.post('/access/:id', auth(), errorCatcher(access.update))
    router.delete('/access/:id', auth(), errorCatcher(access.remove))

    router.post('/user/me', auth(), errorCatcher(user.updateMe))
    router.get('/user', auth(), errorCatcher(user.search))
    router.get('/user/avatar/:email', auth(), errorCatcher(user.avatar))
    router.get('/user/drc-job', auth(), errorCatcher(user.getDrcJobs))

    router.post('/proxy-request', errorCatcher(main.proxy))

    router.post('/kobo-api/webhook', errorCatcher(koboApi.handleWebhookNewAnswers))
    router.post('/kobo-api/sync', auth({adminOnly: true}), errorCatcher(koboApi.syncAnswersAll))
    router.post('/kobo-api/schema', auth(), errorCatcher(koboApi.searchSchemas))
    router.post('/kobo-api/:formId/sync', auth(), errorCatcher(koboApi.syncAnswersByForm))
    router.get(
      '/kobo-api/:formId/submission/:submissionId/attachment/:attachmentId',
      errorCatcher(koboApi.getAttachementsWithoutAuth),
    )
    router.get('/kobo-api/:formId/schema', auth(), errorCatcher(koboApi.getSchema))
    router.get('/kobo-api/:formId/edit-url/:answerId', errorCatcher(koboApi.edit))
    router.post('/kobo-api/proxy', errorCatcher(koboApi.proxy))
    router.post(
      '/kobo-api/:formId/import-from-xls',
      auth(),
      Server.upload.single('aa-file'),
      errorCatcher(importData.handleFileUpload),
    )

    router.post('/kobo-answer-history/search', errorCatcher(koboAnswerHistory.search))

    router.put('/kobo/server', auth(), errorCatcher(koboServer.create))
    router.delete('/kobo/server/:id', auth(), errorCatcher(koboServer.delete))
    router.get('/kobo/server', auth(), errorCatcher(koboServer.getAll))
    router.get('/kobo/form', auth(), errorCatcher(koboForm.getAll))
    router.post('/kobo/form/refresh', auth(), errorCatcher(koboForm.refreshAll))
    router.get('/kobo/form/:id', auth(), errorCatcher(koboForm.get))
    router.put('/kobo/form', auth(), errorCatcher(koboForm.add))
    router.post('/kobo/answer/:formId/by-access', auth(), errorCatcher(koboAnswer.searchByUserAccess))
    router.patch('/kobo/answer/:formId/validation', auth(), errorCatcher(koboAnswer.updateValidation))
    router.patch('/kobo/answer/:formId', auth(), errorCatcher(koboAnswer.updateAnswers))
    router.delete('/kobo/answer/:formId', auth({adminOnly: true}), errorCatcher(koboAnswer.deleteAnswers))
    router.post('/kobo/answer/:formId', errorCatcher(koboAnswer.search))

    router.post(`/database-view/:viewId/col/:colName`, auth(), errorCatcher(databaseView.updateCol))
    router.post(`/database-view`, auth(), errorCatcher(databaseView.search))
    router.put(`/database-view/:databaseId`, auth(), errorCatcher(databaseView.create))
    router.post(`/database-view/:id`, auth(), errorCatcher(databaseView.update))
    router.delete(`/database-view/:viewId`, auth(), errorCatcher(databaseView.delete))

    router.get('/json-store/:key', auth(), errorCatcher(jsonStore.get))
    router.put('/json-store', auth(), errorCatcher(jsonStore.set))
    router.patch('/json-store', auth(), errorCatcher(jsonStore.update))

    router.get('/cache', cacheController.get)
    router.post('/cache/clear', cacheController.clear)

    // router.get('/legalaid', auth(), errorCatcher(legalaid.index))
    // router.get('/ecrec', auth(), errorCatcher(ecrec.index))
    // router.get('/*', errorCatcher(ecrec.index))
  } catch (e) {
    if (e instanceof Error) {
      log.error(e.toString())
    }
    log.error(e)
    console.error(e)
  }
  return router
}
