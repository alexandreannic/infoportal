import express, {NextFunction, Request, Response} from 'express'
import {AppLogger} from '../index'
import {ControllerMain} from './controller/ControllerMain'
import {Services} from './services'
import {PrismaClient} from '@prisma/client'
import {ControllerActivityInfo} from './controller/ControllerActivityInfo'
import {ControllerKoboApi} from './controller/kobo/ControllerKoboApi'
import {ControllerMpcaPayment} from './controller/ControllerMpcaPayment'
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
import {ControllerShelter} from './controller/ControllerShelter'
import {ControllerMealVerification} from './controller/ControllerMealVerification'
import {ControllerGroup} from './controller/ControllerGroup'
import {ControllerKoboMeta} from './controller/ControllerKoboMeta'
import {ControllerJsonStore} from './controller/ControllerJsonStore'
import {ControllerHdp} from './controller/ControllerHdp'
import {ControllerKoboAnswerHistory} from './controller/kobo/ControllerKoboAnswerHistory'

export interface AuthenticatedRequest extends Request {
  user?: UserSession
}

export const errorCatcher = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next)
    } catch (err) {
      console.error('[errorCatcher()]', req.url, req.session.user?.email)
      next(err)
    }
  }
}

export const getRoutes = (
  prisma: PrismaClient,
  // ecrecSdk: EcrecSdk,
  // legalAidSdk: LegalaidSdk,
  services: Services,
  logger: AppLogger,
) => {
  const cache = apicache.middleware

  const router = express.Router()
  // const ecrec = new ControllerEcrec(
  //   ecrecSdk,
  // )
  // const legalaid = new ControllerLegalAid(
  //   legalAidSdk,
  //   logger,
  // )
  const mpcaPayment = new ControllerMpcaPayment(services.mpcaPayment)
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
  const shelter = new ControllerShelter(prisma)
  const mealVerification = new ControllerMealVerification(prisma)
  const koboMeta = new ControllerKoboMeta(prisma)
  const jsonStore = new ControllerJsonStore(prisma)
  const hdp = new ControllerHdp()
  const koboAnswerHistory = new ControllerKoboAnswerHistory(prisma)

  const auth = ({adminOnly = false}: {adminOnly?: boolean} = {}) => async (req: Request, res: Response, next: NextFunction) => {
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
      const user = await prisma.user.findFirst({where: {email}})
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

    router.post('/activity-info/activity', auth({adminOnly: true}), errorCatcher(activityInfo.submitActivity))

    router.post('/proxy-request', errorCatcher(main.proxy))

    router.post('/kobo-api/webhook', errorCatcher(koboApi.answersWebHook))
    router.post('/kobo-api/sync', auth({adminOnly: true}), errorCatcher(koboApi.synchronizeAllAnswersFromKoboServer))
    router.post('/kobo-api/:id/:formId/sync', auth(), errorCatcher(koboApi.synchronizeAnswersFromKoboServer))
    router.get('/kobo-api/:id/attachment', errorCatcher(koboApi.getAttachementsWithoutAuth))
    router.get('/kobo-api/:id/:formId/answers', auth(), errorCatcher(koboApi.getAnswers))
    router.get('/kobo-api/:id', auth(), errorCatcher(koboApi.getForms))
    router.get('/kobo-api/:id/:formId', auth(), errorCatcher(cache('24 hour')), errorCatcher(koboApi.getSchema))
    router.get('/kobo-api/:id/:formId/:answerId/edit-url', errorCatcher(koboApi.edit))

    router.post('/kobo-answer-history/search', errorCatcher(koboAnswerHistory.search))

    router.get('/kobo/server', auth(), errorCatcher(koboServer.getServers))
    router.get('/kobo/form', auth(), errorCatcher(koboForm.getAll))
    router.get('/kobo/form/:id', auth(), errorCatcher(koboForm.get))
    router.put('/kobo/form', auth(), errorCatcher(koboForm.create))
    router.post('/kobo/answer/:formId/by-access', auth(), errorCatcher(koboAnswer.searchByUserAccess))
    router.patch('/kobo/answer/:formId/tag', auth(), errorCatcher(koboAnswer.updateTag))
    router.patch('/kobo/answer/:formId', auth(), errorCatcher(koboAnswer.updateAnswers))
    router.post('/kobo/answer/:formId', errorCatcher(koboAnswer.search))

    router.get('/hdp/risk-education', errorCatcher(hdp.fetchRiskEducation))

    router.post('/shelter/search', errorCatcher(shelter.search))

    router.get('/json-store/:key', auth(), errorCatcher(jsonStore.get))
    router.put('/json-store', auth(), errorCatcher(jsonStore.set))
    router.patch('/json-store', auth(), errorCatcher(jsonStore.update))

    router.post('/mpca/search', errorCatcher(mpca.search))
    router.post('/mpca/refresh', auth(), errorCatcher(mpca.refresh))
    router.put('/mpca-payment', auth(), errorCatcher(mpcaPayment.create))
    router.post('/mpca-payment/:id', auth(), errorCatcher(mpcaPayment.update))
    router.get('/mpca-payment', auth(), errorCatcher(mpcaPayment.getAll))
    router.get('/mpca-payment/:id', auth(), errorCatcher(mpcaPayment.get))
    router.post('/wfp-deduplication/refresh', auth(), errorCatcher(wfp.refresh))
    router.post('/wfp-deduplication/search', auth(), errorCatcher(wfp.search))
    router.post('/wfp-deduplication/upload-taxid', auth(), Server.upload.single('aa-file'), errorCatcher(wfp.uploadTaxIdMapping))

    router.put('/meal-verification', auth(), errorCatcher(mealVerification.create))
    router.get('/meal-verification', auth(), errorCatcher(mealVerification.getAll))
    router.get('/meal-verification/:id/answers', auth(), errorCatcher(mealVerification.getAnswers))
    router.delete('/meal-verification/:id', auth(), errorCatcher(mealVerification.remove))
    router.post('/meal-verification/:id', auth(), errorCatcher(mealVerification.update))
    router.post('/meal-verification/answer/:id', auth(), errorCatcher(mealVerification.updateAnswerStatus))

    // router.get('/legalaid', auth(), errorCatcher(legalaid.index))
    // router.get('/ecrec', auth(), errorCatcher(ecrec.index))
    // router.get('/*', errorCatcher(ecrec.index))
  } catch (e) {
    logger.error('Error caught in Routes.')
    console.error(e)
  }
  return router
}
