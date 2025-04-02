import {NextFunction, Request, Response} from 'express'
import {app} from '../../index.js'
import {yup} from '../../helper/Utils.js'

export class ControllerCache {
  constructor(private appCache = app.cache) {}

  readonly get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cache = this.appCache.getAll()
      res.send(cache.getInfo())
    } catch (e) {
      console.log(e)
    }
  }

  readonly clear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {key, subKey} = await yup
        .object({
          key: yup.string().required(),
          subKey: yup.string().optional(),
        })
        .validate(req.body)
      this.appCache.clear(key, subKey)
      res.send()
    } catch (e) {
      console.log(e)
    }
  }
}
