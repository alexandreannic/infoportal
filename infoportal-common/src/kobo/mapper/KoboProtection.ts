import {Protection_pss} from '../generated'
import {KoboAnswerFlat, PersonDetails} from './Common'
import {KoboGeneralMapping} from './KoboMapper'

export namespace KoboProtection {
  export const pssGetUniqueIndividuls = (row: Protection_pss.T): PersonDetails[] => {
    return (row.hh_char_hh_det ?? []).filter(_ => {
      if (_.hh_char_hh_new_ben === 'no') return false
      if (row.activity !== 'pgs') return true
      if (!_.hh_char_hh_session) return false
      if (row.cycle_type === 'long') return _.hh_char_hh_session.length >= 5
      if (row.cycle_type === 'short') return _.hh_char_hh_session.length >= 3
      return false
    }).map(KoboGeneralMapping.mapPersonDetails)
  }
}