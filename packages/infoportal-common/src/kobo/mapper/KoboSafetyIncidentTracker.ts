import {Safety_incident} from '../generated/Safety_incident.js'
import {OblastIndex} from '../../location/oblastIndex.js'

export namespace KoboSafetyIncidentHelper {
  export const mapData = (_: any) => {
    const d = Safety_incident.map(_)
    return {...d, oblastISO: OblastIndex.byKoboName(d.oblast!).iso}
  }

  export type Type = ReturnType<typeof mapData>
}
