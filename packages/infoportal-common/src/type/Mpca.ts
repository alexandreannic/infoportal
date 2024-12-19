import {IKoboMeta} from '../kobo/IKoboMeta'
import {WfpDeduplication} from './WfpDeduplication'
import {DrcProject} from './Drc'
import {KoboBaseTags, KoboTagStatus} from '../kobo/mapper/Kobo'

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
