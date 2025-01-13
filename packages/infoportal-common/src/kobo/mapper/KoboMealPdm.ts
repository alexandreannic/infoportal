import {Meal_cashPdm, Meal_shelterPdm, Meal_nfiPdm} from '../generated'
import {Person} from '../../type/Person'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {KoboSubmissionFlat} from './Kobo'
import {KoboClient} from 'kobo-sdk'

export namespace KoboMealPdm {
  export type Person = Person.Details

  export type T = KoboSubmissionFlat<PdmFormAnswers> & {
    persons: Person[]
  }

  export type PdmFormAnswers = Omit<Meal_cashPdm.T, 'hh_char_hh_det'> | Meal_shelterPdm.T | Meal_nfiPdm.T

  export const map = (d: KoboSubmissionFlat<PdmFormAnswers, KoboClient>): KoboSubmissionFlat<T> => {
    const r: T = d as unknown as T
    r.persons = mapPersons(d)
    return r
  }

  const mapPersons = (data: PdmFormAnswers): Person.Details[] => {
    if (isCashForm(data)) {
      return mapCashPersons(data as Meal_cashPdm.T)
    } else if (isShelterForm(data)) {
      return mapShelterPersons(data as Meal_shelterPdm.T)
    } else {
      return mapNfiPersons(data as Meal_nfiPdm.T)
    }
  }

  export const mapCashPersons = (_: Meal_cashPdm.T): Person.Details[] => {
    return [
      {
        age: _.age!,
        gender: _.sex!,
        displacement: _.status_person!,
        disability: undefined,
      },
    ].map((person) => ({
      age: person.age,
      gender: fnSwitch(
        person.gender,
        {
          male: Person.Gender.Male,
          female: Person.Gender.Female,
        },
        () => undefined,
      ),
      displacement: fnSwitch(
        person.displacement,
        {
          idp: Person.DisplacementStatus.Idp,
          long: Person.DisplacementStatus.NonDisplaced,
          returnee: Person.DisplacementStatus.Returnee,
        },
        () => undefined,
      ),
      disability: person.disability,
    }))
  }

  export const mapShelterPersons = (_: Meal_shelterPdm.T): Person.Details[] => {
    return [
      {
        age: _.Please_state_your_age!,
        gender: _.Please_state_your_gender!,
        displacement: _.Are_you_an_IDP_conflict_affected_person!,
        disability: undefined,
      },
    ].map((person) => ({
      age: person.age,
      gender: fnSwitch(
        person.gender,
        {
          male: Person.Gender.Male,
          female: Person.Gender.Female,
        },
        () => undefined,
      ),
      displacement: fnSwitch(
        person.displacement,
        {
          idp: Person.DisplacementStatus.Idp,
          long: Person.DisplacementStatus.NonDisplaced,
          returnee: Person.DisplacementStatus.Returnee,
        },
        () => undefined,
      ),
      disability: person.disability,
    }))
  }

  export const mapNfiPersons = (_: Meal_nfiPdm.T): Person.Details[] => {
    return [
      {
        age: _.age!,
        gender: _.sex!,
        displacement: undefined,
        disability: undefined,
      },
    ].map((person) => ({
      age: person.age,
      gender: fnSwitch(
        person.gender,
        {
          male: Person.Gender.Male,
          female: Person.Gender.Female,
        },
        () => undefined,
      ),
      displacement: person.displacement,
      disability: person.disability,
    }))
  }

  const isCashForm = (data: PdmFormAnswers): data is Meal_cashPdm.T => {
    return 'age' in data && 'sex' in data
  }
  const isShelterForm = (data: PdmFormAnswers): data is Meal_shelterPdm.T => {
    return 'Please_state_your_age' in data && 'Please_state_your_gender' in data
  }
}
