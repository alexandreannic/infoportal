import {Bn_re} from '../generated/Bn_re.js'
import {fnSwitch} from '@axanc/ts-utils'
import {Person} from '../../type/Person.js'

export class KoboBnReHelper {
  static readonly getPersons = (_: Bn_re.T): Person[] => {
    return [
      ...(_.hh_char_hhh_age || _.hh_char_hhh_gender ? [{age: _.hh_char_hhh_age, gender: _.hh_char_hhh_gender}] : []),
      ...(_.hh_char_res_age || _.hh_char_res_gender ? [{age: _.hh_char_res_age, gender: _.hh_char_res_gender}] : []),
      ...(_.hh_char_hh_det ?? []).map((p) => ({
        age: p.hh_char_hh_det_age,
        gender: p.hh_char_hh_det_gender,
      })),
    ].map((_) => ({
      age: _.age,
      gender: fnSwitch(
        _.gender!,
        {
          male: Person.Gender.Male,
          female: Person.Gender.Female,
        },
        () => undefined,
      ),
    }))
  }
}
