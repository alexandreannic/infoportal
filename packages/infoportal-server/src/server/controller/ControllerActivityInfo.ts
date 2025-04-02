import {NextFunction, Request, Response} from 'express'
import {ActivityInfoSdk} from 'infoportal-common'
import {app, AppLogger} from '../../index.js'
import {appConf} from '../../core/conf/AppConf.js'
import {AppError} from '../../helper/Errors.js'
import {Util} from '../../helper/Utils.js'

export class ControllerActivityInfo {
  constructor(
    private conf = appConf,
    private api = new ActivityInfoSdk(conf.activityInfo.apiToken),
    private log: AppLogger = app.logger('ControllerActivityInfo'),
  ) {}

  readonly submitActivity = async (req: Request, res: Response, next: NextFunction) => {
    const activities: any[] = req.body
    try {
      // TODO Remove hard email
      if (
        req.session.user?.email !== this.conf.ownerEmail &&
        req.session.user?.email !== 'isabel.pearson@drc.ngo' &&
        req.session.user?.email !== 'vladyslav.marchenko@drc.ngo'
      ) {
        throw new AppError.Forbidden('only_owner_can_submit_ai')
      }
      this.log.info(`Inserting ${activities.length} activities...`)
      const status = await Util.promiseSequentially(activities.map((_) => () => this.api.publish(_))) //.then(_ => _.map(_ => JSON.parse(_)))
      // const status = await Promise.all(activities.map(this.api.publish))//.then(_ => _.map(_ => JSON.parse(_)))
      const errors = status.filter((_) => _ !== '')
      if (errors.length > 0) {
        this.log.error(`Failed to insert ${errors.length} activities on ${activities.length}`)
        throw new AppError.BadRequest(JSON.stringify(errors))
      }
      this.log.info(`${activities.length} activities inserted !`)
      res.send(status)
    } catch (e) {
      console.error(activities)
      console.error(e)
      throw e
    }
  }
}
