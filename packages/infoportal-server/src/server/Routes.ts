import express, {NextFunction, Request, Response} from 'express'
import {app, AppLogger} from '../index'
import {ControllerMain} from './controller/ControllerMain'
import {PrismaClient} from '@prisma/client'
import {ControllerActivityInfo} from './controller/ControllerActivityInfo'
import {ControllerEcrec} from './controller/ControllerEcrec'
import {ControllerKoboApi} from './controller/kobo/ControllerKoboApi'
import {ControllerSession} from './controller/ControllerSession'
import {ControllerKoboForm} from './controller/kobo/ControllerKoboForm'
import {ControllerKoboServer} from './controller/kobo/ControllerKoboServer'
import {ControllerKoboAnswer} from './controller/kobo/ControllerKoboAnswer'
import {ControllerWfp} from './controller/ControllerWfp'
import {Server} from './Server'
import {ControllerAccess} from './controller/ControllerAccess'
import {ControllerUser} from './controller/ControllerUser'
import {UserSession} from '../feature/session/UserSession'
import {AppError} from '../helper/Errors'
import apicache from 'apicache'
import {ControllerProxy} from './controller/ControllerProxy'
import {ControllerMpca} from './controller/ControllerMpca'
import {ControllerMealVerification} from './controller/ControllerMealVerification'
import {ControllerGroup} from './controller/ControllerGroup'
import {ControllerKoboMeta} from './controller/ControllerKoboMeta'
import {ControllerJsonStore} from './controller/ControllerJsonStore'
import {ControllerHdp} from './controller/ControllerHdp'
import {ControllerKoboAnswerHistory} from './controller/kobo/ControllerKoboAnswerHistory'
import {ControllerCache} from './controller/ControllerCache'
import {UserService} from '../feature/user/UserService'
import {ControllerDatabaseView} from './controller/ControllerDatabaseView'
import {ControllerKoboApiXlsImport} from './controller/kobo/ControllerKoboApiXlsImport'

export interface AuthenticatedRequest extends Request {
  user?: UserSession
}

export const getRoutes = (
  prisma: PrismaClient,
  // ecrecSdk: EcrecSdk,
  // legalAidSdk: LegalaidSdk,
  log: AppLogger = app.logger('Routes'),
) => {
  const cache = apicache.middleware

  const errorCatcher = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next)
      } catch (err) {
        log.error(req.url + '' + req.session.user?.email)
        next(err)
      }
    }
  }

  const router = express.Router()
  // const ecrec = new ControllerEcrec(
  //   ecrecSdk,
  // )
  // const legalaid = new ControllerLegalAid(
  //   legalAidSdk,
  //   logger,
  // )
  const ecrec = new ControllerEcrec(prisma)
  const mpca = new ControllerMpca(prisma)
  const main = new ControllerMain()
  const koboForm = new ControllerKoboForm(prisma)
  const koboServer = new ControllerKoboServer(prisma)
  const koboAnswer = new ControllerKoboAnswer(prisma)
  const koboApi = new ControllerKoboApi(prisma)
  const activityInfo = new ControllerActivityInfo()
  const session = new ControllerSession(prisma)
  const wfp = new ControllerWfp(prisma)
  const access = new ControllerAccess(prisma)
  const accessGroup = new ControllerGroup(prisma)
  const user = new ControllerUser(prisma)
  const proxy = new ControllerProxy(prisma)
  const mealVerification = new ControllerMealVerification(prisma)
  const koboMeta = new ControllerKoboMeta(prisma)
  const jsonStore = new ControllerJsonStore(prisma)
  const hdp = new ControllerHdp()
  const koboAnswerHistory = new ControllerKoboAnswerHistory(prisma)
  const databaseView = new ControllerDatabaseView(prisma)
  const cacheController = new ControllerCache()
  const importData = new ControllerKoboApiXlsImport(prisma)

  const auth =
    ({adminOnly = false}: {adminOnly?: boolean} = {}) =>
    async (req: Request, res: Response, next: NextFunction) => {
      // req.session.user = {
      //   email: 'alexandre.annic@drc.ngo',
      //   admin: true,
      // } as any
      // next()
      try {
        const email = req.session.user?.email
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
    router.get('/session', errorCatcher(session.get))

    router.post('/kobo-meta/search', errorCatcher(koboMeta.search))
    router.post('/kobo-meta/sync', errorCatcher(koboMeta.sync))
    router.post('/kobo-meta/kill-cache', errorCatcher(koboMeta.killCache))

    router.get('/proxy/:slug', errorCatcher(proxy.redirect))
    router.put('/proxy', auth({adminOnly: true}), errorCatcher(proxy.create))
    router.post('/proxy/:id', auth({adminOnly: true}), errorCatcher(proxy.update))
    router.delete('/proxy/:id', auth({adminOnly: true}), errorCatcher(proxy.delete))
    router.get('/proxy', errorCatcher(proxy.search))

    router.get('/group/me', auth(), errorCatcher(accessGroup.getMine))
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

    router.post('/activity-info/activity', auth({adminOnly: true}), errorCatcher(activityInfo.submitActivity))

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

    router.get('/kobo/server', auth(), errorCatcher(koboServer.getServers))
    router.get('/kobo/form', auth(), errorCatcher(koboForm.getAll))
    router.post('/kobo/form/refresh', auth(), errorCatcher(koboForm.refreshAll))
    router.get('/kobo/form/:id', auth(), errorCatcher(koboForm.get))
    router.put('/kobo/form', auth(), errorCatcher(koboForm.add))
    router.post('/kobo/answer/:formId/by-access', auth(), errorCatcher(koboAnswer.searchByUserAccess))
    router.patch('/kobo/answer/:formId/tag', auth(), errorCatcher(koboAnswer.updateTag))
    router.patch('/kobo/answer/:formId/validation', auth(), errorCatcher(koboAnswer.updateValidation))
    router.patch('/kobo/answer/:formId', auth(), errorCatcher(koboAnswer.updateAnswers))
    router.delete('/kobo/answer/:formId', auth({adminOnly: true}), errorCatcher(koboAnswer.deleteAnswers))
    router.post('/kobo/answer/:formId', errorCatcher(koboAnswer.search))

    router.get('/hdp/risk-education', errorCatcher(hdp.fetchRiskEducation))

    router.post(`/database-view/:viewId/col/:colName`, auth(), errorCatcher(databaseView.updateCol))
    router.post(`/database-view`, auth(), errorCatcher(databaseView.search))
    router.put(`/database-view/:databaseId`, auth(), errorCatcher(databaseView.create))
    router.post(`/database-view/:id`, auth(), errorCatcher(databaseView.update))
    router.delete(`/database-view/:viewId`, auth(), errorCatcher(databaseView.delete))

    router.get('/json-store/:key', auth(), errorCatcher(jsonStore.get))
    router.put('/json-store', auth(), errorCatcher(jsonStore.set))
    router.patch('/json-store', auth(), errorCatcher(jsonStore.update))

    router.post('/mpca/search', auth(), errorCatcher(mpca.search))
    router.post('/mpca/refresh', auth(), errorCatcher(mpca.refresh))
    router.post('/wfp-deduplication/refresh', auth(), errorCatcher(wfp.refresh))
    router.post('/wfp-deduplication/search', auth(), errorCatcher(wfp.search))
    router.post(
      '/wfp-deduplication/upload-taxid',
      auth(),
      Server.upload.single('aa-file'),
      errorCatcher(wfp.uploadTaxIdMapping),
    )
    router.post('/ecrec/search', /*auth(),*/ errorCatcher(ecrec.search))

    router.put('/meal-verification', auth(), errorCatcher(mealVerification.create))
    router.get('/meal-verification', auth(), errorCatcher(mealVerification.getAll))
    router.get('/meal-verification/:id/answers', auth(), errorCatcher(mealVerification.getAnswers))
    router.delete('/meal-verification/:id', auth(), errorCatcher(mealVerification.remove))
    router.post('/meal-verification/:id', auth(), errorCatcher(mealVerification.update))
    router.post('/meal-verification/answer/:id', auth(), errorCatcher(mealVerification.updateAnswerStatus))

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
