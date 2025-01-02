import {DrcProgram, IKoboMeta, KoboMetaStatus} from 'infoportal-common'

export interface KoboMetaSearchParans {
  activities?: DrcProgram[]
  status?: KoboMetaStatus[]
}

export class KoboMetaHelper {

  static readonly mapEntity = (_: Record<keyof IKoboMeta, any>): IKoboMeta => {
    if (_.date) _.date = new Date(_.date)
    console.log(_.lastStatusUpdate)
    if (_.lastStatusUpdate) _.lastStatusUpdate = new Date(_.lastStatusUpdate)
    return _
  }
}