import {HdpSdk} from '../../core/externalSdk/hdp/HdpSdk.js'
import {NextFunction, Request, Response} from 'express'

export class ControllerHdp {
  readonly fetchRiskEducation = async (req: Request, res: Response, next: NextFunction) => {
    const data = await HdpSdk.fetchAiRiskEducation().then((_) => _.recordset)
    res.send(data)
  }
}
