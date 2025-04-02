import {Obj, seq} from '@axanc/ts-utils'
import {KeyOf, NonNullableKeys} from './Generic.js'

export type Person = {
  age?: number
  gender?: Person.Gender
}

export namespace Person {
  export type AgeGroup = Record<string, [number, number]>

  export interface Details extends Person {
    displacement?: DisplacementStatus
    disability?: WgDisability[]
  }

  export enum DisplacementStatus {
    Idp = 'Idp',
    Returnee = 'Returnee',
    Refugee = 'Refugee',
    NonDisplaced = 'NonDisplaced',
  }

  export enum WgDisability {
    See = 'See',
    Hear = 'Hear',
    Walk = 'Walk',
    Rem = 'Rem',
    Care = 'Care',
    Comm = 'Comm',
    None = 'None',
  }

  export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
  }

  export const create = (_: Person.Details) => _

  export const filterDefined = (p: Person[]): NonNullableKeys<Person>[] => p.filter((_) => !!_.gender && _.age) as any

  export const elderlyLimitIncluded = 60

  export const isElderly = (age: number | string) => +age >= elderlyLimitIncluded

  export const ageGroup = Object.freeze({
    SuperQuick: {
      '0 - 17': [0, 17] as [number, number],
      '18+': [18, Infinity] as [number, number],
    },
    Quick: {
      '0 - 17': [0, 17] as [number, number],
      '18 - 49': [18, 49] as [number, number],
      '50+': [50, Infinity] as [number, number],
    },
    DRC: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 11': [5, 11] as [number, number],
      '12 - 17': [12, 17] as [number, number],
      '18 - 24': [18, 24] as [number, number],
      '25 - 49': [25, 49] as [number, number],
      '50 - 59': [50, 59] as [number, number],
      '60+': [elderlyLimitIncluded, Infinity] as [number, number],
    },
    ECHO: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 17': [5, 17] as [number, number],
      '18 - 49': [18, 49] as [number, number],
      '50+': [50, Infinity] as [number, number],
    },
    BHA_Shelter: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 14': [5, 14] as [number, number],
      '15 - 18': [15, 18] as [number, number],
      '19 - 49': [19, 49] as [number, number],
      '50+': [50, Infinity] as [number, number],
    },
    BHA: {
      '0 - 4': [0, 4] as [number, number],
      '5 - 9': [5, 9] as [number, number],
      '10 - 14': [10, 14] as [number, number],
      '15 - 18': [15, 18] as [number, number],
      '19 - 29': [19, 29] as [number, number],
      '30 - 59': [30, 59] as [number, number],
      '60+': [elderlyLimitIncluded, Infinity] as [number, number],
    },
    UNHCR: {
      '0 - 17': [0, 17] as [number, number],
      '18 - 59': [18, 59] as [number, number],
      '60+': [60, Infinity] as [number, number],
    },
  })

  export const getAgeGroup = (str: keyof typeof ageGroup): AgeGroup => {
    return ageGroup[str] as unknown as AgeGroup
  }

  export const ageGroups = Obj.keys(ageGroup)

  export const ageToAgeGroup = <AG extends AgeGroup>(age: number | undefined, ag: AG): keyof AG | undefined => {
    for (const [k, [min, max]] of Obj.entries(ag)) {
      if (age !== undefined && age >= min && age <= max) return k as any
    }
    return undefined
  }

  export const groupByAgeGroup =
    <AG extends AgeGroup>(ag: AG = Person.ageGroup.BHA as unknown as AG) =>
    <T>(p: T, getAge: (_: T) => number) => {
      return ageToAgeGroup(getAge(p), ag)
    }

  export const filterByAgegroup =
    <AG extends AgeGroup>(ag: AG, key: keyof AG) =>
    (p: Person) => {
      const [min, max] = ag[key]
      return p.age !== undefined && p.age >= min && p.age <= max
    }

  // TODO Can improve perf if needed
  export const groupByGenderAndGroup =
    <AG extends AgeGroup>(ag: AG = Person.ageGroup.BHA as unknown as AG, skipOther?: boolean) =>
    (data: Person[]): Record<KeyOf<AG>, Record<Gender, number>> => {
      const res = seq(skipOther ? data.filter((_) => [Gender.Female, Gender.Male].includes(_.gender!)) : data).groupBy(
        (_) => _.gender ?? Gender.Other,
      )
      // const order = [
      //   Person.Gender.Female,
      //   Person.Gender.Male,
      //   Person.Gender.Other,
      // ]
      return new Obj(ag)
        .map((k) => {
          return [
            k as KeyOf<AG>,
            new Obj(res)
              .mapValues((byGender, gender) => {
                return byGender.filter(filterByAgegroup(ag, k)).length
              })
              // .sort(([aK], [bK]) => order.indexOf(aK as any) - order.indexOf(bK as any))
              .get(),
          ]
        })
        .get() as any
    }
}
