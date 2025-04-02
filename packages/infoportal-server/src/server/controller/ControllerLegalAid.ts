import {NextFunction, Request, Response} from 'express'
import {LegalaidSdk} from '../../core/externalSdk/legalaid/LegalaidSdk.js'
import {Controller} from './Controller.js'
import {AppLogger} from '../../index.js'

export class ControllerLegalAid extends Controller {
  constructor(
    private legalAidSdk: LegalaidSdk,
    private log: AppLogger,
  ) {
    super({errorKey: 'monitoring'})
  }

  readonly index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({})
    } catch (e) {
      next(e)
    }
  }
}
