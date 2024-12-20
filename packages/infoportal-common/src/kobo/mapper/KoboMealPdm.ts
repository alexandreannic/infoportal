import {Meal_cashPdm} from '../generated'
import {Person} from '../../type/Person'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {DisplacementStatus, KoboSubmissionFlat, PersonDetails} from './Kobo'
import {Meal_shelterPdm} from '../generated/Meal_shelterPdm'
import {KoboClient} from 'kobo-sdk'

export namespace KoboMealPdm {

  export type Person = PersonDetails

  export type T = KoboSubmissionFlat<PdmFormAnswers> & {
    persons: Person[]
  }

  export type PdmFormAnswers = | Omit<Meal_cashPdm.T, 'hh_char_hh_det'> | Meal_shelterPdm.T;

  export const map = (d: KoboSubmissionFlat<PdmFormAnswers, KoboClient>): KoboSubmissionFlat<T> => {
    const r: T = d as unknown as T
    r.persons = mapPersons(d)
    return r
  }

  const mapPersons = (data: PdmFormAnswers): PersonDetails[] => {
    if (isCashForm(data)) {
      return mapCashPersons(data as Meal_cashPdm.T)
    } else {
      return mapShelterPersons(data as Meal_shelterPdm.T)
    }
  }

  export const mapCashPersons = (_: Meal_cashPdm.T): PersonDetails[] => {
    return [
      {
        age: _.age!,
        gender: _.sex!,
        displacement: _.status_person!,
        disability: undefined,
      },
    ].map(person => ({
        age: person.age,
        gender: fnSwitch(person.gender, {
          'male': Person.Gender.Male,
          'female': Person.Gender.Female,
        }, () => undefined),
        displacement: fnSwitch(person.displacement, {
          'idp': DisplacementStatus.Idp,
          'long': DisplacementStatus.NonDisplaced,
          'returnee': DisplacementStatus.Returnee,
        }, () => undefined),
        disability: person.disability,
      }
    ))
  }

  export const mapShelterPersons = (_: Meal_shelterPdm.T): PersonDetails[] => {
    return [
      {
        age: _.Please_state_your_age!,
        gender: _.Please_state_your_gender!,
        displacement: _.Are_you_an_IDP_conflict_affected_person!,
        disability: undefined,
      },
    ].map(person => ({
        age: person.age,
        gender: fnSwitch(person.gender, {
          'male': Person.Gender.Male,
          'female': Person.Gender.Female,
        }, () => undefined),
        displacement: fnSwitch(person.displacement, {
          'idp': DisplacementStatus.Idp,
          'long': DisplacementStatus.NonDisplaced,
          'returnee': DisplacementStatus.Returnee,
        }, () => undefined),
        disability: person.disability,
      }
    ))
  }

  const isCashForm = (data: PdmFormAnswers): data is Meal_cashPdm.T => {
    return 'age' in data && 'sex' in data
  }
}