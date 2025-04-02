import {IKoboMeta} from '../kobo/IKoboMeta.js'
import {WfpDeduplication} from './WfpDeduplication.js'
import {DrcProject} from './Drc.js'
import {KoboBaseTags, KoboTagStatus} from '../kobo/mapper/Kobo.js'

export interface MpcaEntityTags extends KoboBaseTags, KoboTagStatus {
  projects?: DrcProject[]
}

export interface MpcaEntity extends IKoboMeta {
  deduplication?: WfpDeduplication
  amountUahSupposed?: number
  amountUahDedup?: number
  amountUahFinal?: number
  amountUahCommitted?: number
}
