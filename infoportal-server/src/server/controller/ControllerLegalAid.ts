import {NextFunction, Request, Response} from 'express'
import {LegalaidSdk} from '../../feature/connector/legalaid/LegalaidSdk'
import {Controller} from './Controller'
import {AppLogger} from '../../index'

export class ControllerLegalAid extends Controller {

  constructor(
    private legalAidSdk: LegalaidSdk,
    private logger: AppLogger,
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
