import {
  Bn_cashForRentRegistration,
  Bn_rapidResponse,
  Bn_rapidResponse2,
  Bn_re,
  Ecrec_cashRegistration,
  Ecrec_cashRegistrationBha,
  Ecrec_msmeGrantEoi,
  Ecrec_msmeGrantReg,
  Ecrec_vet2_dmfa,
  Ecrec_vet_bha388,
  Ecrec_vetApplication,
  Ecrec_vetEvaluation,
  Meal_cashPdm,
  Partner_lampa,
  Protection_communityMonitoring,
  Protection_counselling,
  Protection_gbv,
  Protection_groupSession,
  Protection_hhs3,
  Protection_pss,
  Protection_referral,
  Shelter_cashForShelter,
  Shelter_nta,
} from '../generated'
import {Person} from '../../type/Person'
import {fnSwitch, seq} from '@alexandreannic/ts-utils'
import {OblastIndex} from '../../location'
import {DrcOffice} from '../../type/Drc'

export namespace KoboXmlMapper {
  type ExtractHh<T, K extends keyof T> = T[K] extends any[] | undefined ? NonNullable<T[K]>[0] : never

  namespace Xml {
    export type Gender =
      | 'male'
      | 'female'
      | 'other'
      | 'unspecified'
      | 'unable_unwilling_to_answer'
      | 'other_pns'
      | 'pnd'

    export type DisabilityLevel = ExtractHh<Ecrec_cashRegistration.T, 'hh_char_hh_det'>['hh_char_hh_det_dis_level']

    export type DisabilitySelected = ExtractHh<Ecrec_cashRegistration.T, 'hh_char_hh_det'>['hh_char_hh_det_dis_select']

    // export type Displacement = ExtractHh<Ecrec_cashRegistration.T, 'hh_char_hh_det'>['hh_char_hh_res_stat']
    export type Office =
      | 'dnk'
      | 'hrk'
      | 'cej'
      | 'lwo'
      | 'umy'
      | 'nlv'
      | 'slo'
      | 'chj'
      | 'zap'
      | 'khe'
      | 'other'
      | 'kharkiv'
      | 'dnipro'
      | 'mykovaiv'

    export type Displacement =
      | 'idp'
      | 'displaced'
      | 'long_res'
      | 'ret'
      | 'ref_asy'
      | 'other'
      | 'returnee'
      | 'long'
      | 'pnd'
      | 'non-displaced'
      | 'unspec'

    export type Individual = {
      hh_char_hh_det_gender?: Gender
      hh_char_hh_det_dis_select?: DisabilitySelected
      hh_char_hh_det_age?: ExtractHh<Ecrec_cashRegistration.T, 'hh_char_hh_det'>['hh_char_hh_det_age']
      hh_char_hh_det_dis_level?: DisabilityLevel
      hh_char_hh_res_stat?: Displacement
    }

    export type Row = {
      hh_char_dis_select?: DisabilitySelected
      hh_char_dis_level?: DisabilityLevel
      hh_char_hhh_dis_level?: DisabilityLevel
      hh_char_hhh_dis_select?: DisabilitySelected
      hh_char_hhh_res_stat?: Displacement
      hh_char_hhh_age?: number
      hh_char_hhh_gender?: Gender
      hh_char_res_dis_level?: DisabilityLevel
      hh_char_res_dis_select?: DisabilitySelected
      hh_char_res_age?: number
      hh_char_res_gender?: Gender
      ben_det_res_stat?: Displacement
      hh_char_hh_det?: Individual[]
    }
  }

  export const office = (_?: Xml.Office): DrcOffice | undefined =>
    fnSwitch(
      _!,
      {
        kharkiv: DrcOffice.Kharkiv,
        dnipro: DrcOffice.Dnipro,
        mykovaiv: DrcOffice.Mykolaiv,
        chj: DrcOffice.Chernihiv,
        cej: DrcOffice.Chernihiv,
        dnk: DrcOffice.Dnipro,
        hrk: DrcOffice.Kharkiv,
        umy: DrcOffice.Sumy,
        nlv: DrcOffice.Mykolaiv,
        slo: DrcOffice.Sloviansk,
        zap: DrcOffice.Zaporizhzhya,
        khe: DrcOffice.Kherson,
      },
      () => undefined,
    )

  export namespace Persons {
    namespace Gender {
      export const common = (person?: {hh_char_hh_det_gender?: Xml.Gender}) => {
        return fnSwitch(
          person?.hh_char_hh_det_gender!,
          {
            male: Person.Gender.Male,
            female: Person.Gender.Female,
            other: Person.Gender.Other,
            other_pns: Person.Gender.Other,
          },
          () => undefined,
        )
      }
    }

    namespace Displacement {
      export const common = (person: {
        hh_char_hh_res_stat?: Xml.Displacement
      }): undefined | Person.DisplacementStatus => {
        return fnSwitch(
          person.hh_char_hh_res_stat!,
          {
            idp: Person.DisplacementStatus.Idp,
            displaced: Person.DisplacementStatus.Idp,
            long: Person.DisplacementStatus.NonDisplaced,
            long_res: Person.DisplacementStatus.NonDisplaced,
            ret: Person.DisplacementStatus.Returnee,
            returnee: Person.DisplacementStatus.Returnee,
            ref_asy: Person.DisplacementStatus.Refugee,
            'non-displaced': Person.DisplacementStatus.NonDisplaced,
          },
          () => undefined,
        )
      }
    }

    namespace Disability {
      export const common = (person: {
        hh_char_hh_det_dis_level?: Xml.DisabilityLevel
        hh_char_hh_det_dis_select?: Xml.DisabilitySelected
      }): undefined | Person.WgDisability[] => {
        if (!person.hh_char_hh_det_dis_level) return undefined
        if (person.hh_char_hh_det_dis_level === 'zero') return [Person.WgDisability.None]
        return person.hh_char_hh_det_dis_select
          ?.map((_) =>
            fnSwitch(
              _,
              {
                diff_see: Person.WgDisability.See,
                diff_hear: Person.WgDisability.Hear,
                diff_walk: Person.WgDisability.Walk,
                diff_rem: Person.WgDisability.Rem,
                diff_care: Person.WgDisability.Care,
                diff_comm: Person.WgDisability.Comm,
                diff_none: Person.WgDisability.None,
              },
              () => undefined,
            ),
          )
          .filter((_) => !!_)
      }
    }

    const common = (row: Xml.Row): Person.Details[] => {
      return [
        ...(row.hh_char_hhh_age || row.hh_char_hhh_gender
          ? [
              {
                age: row.hh_char_hhh_age,
                gender: Gender.common({hh_char_hh_det_gender: row.hh_char_hhh_gender}),
                disability: Disability.common({
                  hh_char_hh_det_dis_level: row.hh_char_hhh_dis_level,
                  hh_char_hh_det_dis_select: row.hh_char_hhh_dis_select,
                }),
                displacement: Displacement.common({hh_char_hh_res_stat: row.hh_char_hhh_res_stat}),
              },
            ]
          : []),
        ...(row.hh_char_res_age || row.hh_char_res_gender
          ? [
              {
                age: row.hh_char_res_age,
                gender: Gender.common({hh_char_hh_det_gender: row.hh_char_res_gender}),
                disability: Disability.common({
                  hh_char_hh_det_dis_level: row.hh_char_res_dis_level,
                  hh_char_hh_det_dis_select: row.hh_char_res_dis_select,
                }),
                displacement: Displacement.common({hh_char_hh_res_stat: row.ben_det_res_stat}),
              },
            ]
          : []),
        ...(row.hh_char_hh_det ?? []).map((_) => ({
          age: _.hh_char_hh_det_age,
          gender: Gender.common(_),
          disability: Disability.common(_),
          displacement: Displacement.common(_),
        })),
      ]
    }

    export const bn_re = (row: Bn_re.T): Person.Details[] =>
      common({
        ...row,
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({
          ..._,
          hh_char_hh_res_stat: row.ben_det_res_stat,
        })),
      })

    export const bn_rapidResponse = (row: Bn_rapidResponse.T): Person.Details[] => {
      return [
        ...(row.hh_char_hhh_age_l || row.hh_char_hhh_gender_l
          ? [
              {
                age: row.hh_char_hhh_age_l,
                gender: Gender.common({hh_char_hh_det_gender: row.hh_char_hhh_gender_l}),
                disability: Disability.common({
                  hh_char_hh_det_dis_level: row.hh_char_hhh_dis_level_l,
                  hh_char_hh_det_dis_select: row.hh_char_hhh_dis_select_l,
                }),
                displacement: Displacement.common({hh_char_hh_res_stat: row.ben_det_res_stat_l}),
              },
            ]
          : []),
        ...(row.hh_char_res_age_l || row.hh_char_res_gender_l
          ? [
              {
                age: row.hh_char_res_age_l,
                gender: Gender.common({hh_char_hh_det_gender: row.hh_char_res_gender_l}),
                disability: Disability.common({
                  hh_char_hh_det_dis_level: row.hh_char_res_dis_level_l,
                  hh_char_hh_det_dis_select: row.hh_char_res_dis_select_l,
                }),
                displacement: Displacement.common({hh_char_hh_res_stat: row.ben_det_res_stat_l}),
              },
            ]
          : []),
        ...common({
          ...row,
          hh_char_hh_det: row.hh_char_hh_det_l?.map((_) => ({
            hh_char_hh_det_gender: _.hh_char_hh_det_gender_l,
            hh_char_hh_det_dis_select: _.hh_char_hh_det_dis_select_l,
            hh_char_hh_det_age: _.hh_char_hh_det_age_l,
            hh_char_hh_det_dis_level: _.hh_char_hh_det_dis_level_l,
            hh_char_hh_res_stat: row.ben_det_res_stat_l,
          })),
        }),
      ]
    }

    export const ecrec_cashRegistrationBha = (row: Ecrec_cashRegistrationBha.T) => {
      return common({
        ...row,
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({
          ..._,
          hh_char_hh_res_stat: row.ben_det_res_stat,
        })),
      })
    }

    export const shelter_nta = (row: Shelter_nta.T) => {
      const mapDis = (
        dis: Shelter_nta.T['hh_char_dis_select'],
      ): undefined | Ecrec_cashRegistration.T['hh_char_res_dis_select'] => {
        return seq(dis)
          ?.map((_) =>
            fnSwitch(_, {
              diff_see: 'diff_see',
              diff_hear: 'diff_hear',
              diff_walk: 'diff_walk',
              diff_rem: 'diff_rem',
              diff_care: 'diff_care',
              diff_comm: 'diff_comm',
              diff_none: 'diff_none',
              diff_medical: undefined,
              diff_mental: undefined,
            }),
          )
          .compact()
          .get() as Ecrec_cashRegistration.T['hh_char_res_dis_select']
      }
      return common({
        ...row,
        hh_char_dis_select: mapDis(row.hh_char_dis_select),
        hh_char_hhh_dis_select: mapDis(row.hh_char_hhh_dis_select),
        hh_char_res_dis_select: mapDis(row.hh_char_res_dis_select),
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({
          ..._,
          hh_char_hh_res_stat: row.ben_det_res_stat,
          hh_char_hh_det_dis_select: mapDis(_.hh_char_hh_det_dis_select),
        })),
      })
    }

    export const bn_cashForRentRegistration = (row: Bn_cashForRentRegistration.T) => {
      return common({
        ...row,
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({..._, hh_char_hh_res_stat: row.ben_det_res_stat})),
      })
    }
    export const bn_cashForRentApplication = (row: Bn_cashForRentRegistration.T) => {
      return common(row)
    }

    export const shelter_cashForShelter = (row: Shelter_cashForShelter.T) => common(row)

    export const protection_counselling = (row: Protection_counselling.T) => {
      const hasDisab = (_: Protection_counselling.T['difficulty_remembering']): boolean => {
        return (
          fnSwitch(_!, {
            no: false,
            yes_some: true,
            yes_lot: true,
            cannot_all: true,
          }) ?? false
        )
      }
      const disability = (
        [
          hasDisab(row.difficulty_seeing) ? Person.WgDisability.See : undefined,
          hasDisab(row.difficulty_hearing) ? Person.WgDisability.Hear : undefined,
          hasDisab(row.difficulty_walking) ? Person.WgDisability.Walk : undefined,
          hasDisab(row.difficulty_remembering) ? Person.WgDisability.Rem : undefined,
          hasDisab(row.difficulty_washing) ? Person.WgDisability.Care : undefined,
          hasDisab(row.difficulty_usual_language) ? Person.WgDisability.Comm : undefined,
        ] as const
      ).filter((_) => !!_)
      return [
        {
          age: row.age,
          gender: fnSwitch(
            row.gender!,
            {
              man: Person.Gender.Male,
              other: Person.Gender.Other,
              woman: Person.Gender.Female,
            },
            () => undefined,
          ),
          displacement: fnSwitch(
            row.disp_status!,
            {
              idp: Person.DisplacementStatus.Idp,
              idp_retuenee: Person.DisplacementStatus.Returnee,
              refugee_returnee: Person.DisplacementStatus.Returnee,
              non_displaced: Person.DisplacementStatus.NonDisplaced,
              refugee: Person.DisplacementStatus.Refugee,
              pnd: undefined,
            },
            () => undefined,
          ),
          disability,
        },
      ]
    }

    export const protection_pss = (row: Protection_pss.T) => {
      if (row.new_ben === 'no') return []
      return common({
        hh_char_hh_det: row.hh_char_hh_det
          ?.filter((_) => {
            if (_.hh_char_hh_new_ben === 'no') return false
            if (row.activity !== 'pgs') return true
            if (!_.hh_char_hh_session) return false
            if (row.cycle_type === 'long') return _.hh_char_hh_session.length >= 5
            if (row.cycle_type === 'short') return _.hh_char_hh_session.length >= 3
            return false
          })
          .map((_) => ({
            ..._,
            hh_char_hh_res_stat: _.hh_char_hh_det_status,
          })),
      })
    }

    export const protection_gbv = (row: Protection_gbv.T) => {
      return common({
        hh_char_hh_det: row.hh_char_hh_det
          ?.filter((_) => _.hh_char_hh_new_ben !== 'no')
          .map((_) => ({
            ..._,
            hh_char_hh_res_stat: _.hh_char_hh_det_status,
          })),
      })
    }

    export const protection_hhs3 = (row: Protection_hhs3.T): Person.Details[] => {
      const displacement = fnSwitch(
        row.do_you_identify_as_any_of_the_following!,
        {
          idp: Person.DisplacementStatus.Idp,
          non_displaced: Person.DisplacementStatus.NonDisplaced,
          refugee: Person.DisplacementStatus.Refugee,
          returnee: Person.DisplacementStatus.Returnee,
        },
        () => undefined,
      )
      return seq(row.hh_char_hh_det)
        ?.map((hh) => {
          return {
            age: hh.hh_char_hh_det_age,
            gender: Gender.common(hh),
            displacement: displacement,
            disability: hh.hh_char_hh_det_disability
              ?.map((_) =>
                fnSwitch(
                  _,
                  {
                    no: Person.WgDisability.None,
                    wg_seeing_even_if_wearing_glasses: Person.WgDisability.See,
                    wg_hearing_even_if_using_a_hearing_aid: Person.WgDisability.Hear,
                    wg_walking_or_climbing_steps: Person.WgDisability.Walk,
                    wg_remembering_or_concentrating: Person.WgDisability.Rem,
                    wg_selfcare_such_as_washing_all_over_or_dressing: Person.WgDisability.Care,
                    wg_using_your_usual_language_have_difficulty_communicating: Person.WgDisability.Comm,
                    unable_unwilling_to_answer: undefined,
                  },
                  () => undefined,
                ),
              )
              .filter((_) => !!_),
          }
        })
        .compact()
    }

    export const ecrec_cashRegistration = (row: Ecrec_cashRegistration.T) => common(row)

    export const protection_groupSession = (row: Protection_groupSession.T) =>
      common({
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({
          ..._,
          hh_char_hh_res_stat: _.hh_char_hh_det_status,
        })),
      })

    export const ecrec_vetApplication = (row: Ecrec_vetApplication.T) => common(row)

    export const ecrec_vetEvaluation = (row: Ecrec_vetEvaluation.T) => common(row)

    export const ecrec_vet_bha388 = (row: Ecrec_vet_bha388.T) =>
      common({
        hh_char_hh_det: row.family_member?.map(({gender, age, dis_select, dis_level}) => ({
          hh_char_hh_det_age: age,
          hh_char_hh_det_gender: gender,
          hh_char_hh_det_dis_select: dis_select,
          hh_char_hh_det_dis_level: dis_level,
          hh_char_hh_res_stat: row.res_stat, // notice it comes from the row, not the family member
        })),
      })

    export const ecrec_vet2_dmfa = (row: Ecrec_vet2_dmfa.T) =>
      common({
        ...row,
        hh_char_hh_det: row.family_member?.map((member) => ({
          hh_char_hh_det_age: member.age,
          hh_char_hh_det_gender: member.gender,
          hh_char_hh_det_dis_select: member.dis_select,
          hh_char_hh_det_dis_level: member.dis_level,
          hh_char_hh_res_stat: row.res_stat, // notice it comes from the row, not the family member
        })),
      })

    export const ecrec_msmeGrantReg = (row: Ecrec_msmeGrantReg.T) => {
      const safeAge = (age: any) => {
        try {
          const int = parseInt(age as any)
          if (int > 140 || int < 0) return undefined
          return int
        } catch (error) {
          return undefined
        }
      }
      return common({
        hh_char_res_age: safeAge(row.age),
        hh_char_res_gender: row.gender,
        ben_det_res_stat: row.res_stat,
        hh_char_res_dis_select: row.dis_select,
        hh_char_res_dis_level: row.dis_level,
        hh_char_hh_det: row.hh_member?.map((_) => ({
          ..._,
          hh_char_hh_det_age: safeAge(_.hh_char_hh_det_age),
          hh_char_hh_det_dis_select: row.dis_select,
          hh_char_hh_det_dis_level: row.dis_level,
        })),
      })
    }

    export const ecrec_msmeGrantEoi = (row: Ecrec_msmeGrantEoi.T) => common(row)

    export const partner_lampa = (row: Partner_lampa.T) => common(row)

    export const protection_communityMonitoring = (row: Protection_communityMonitoring.T) => {
      const hh_char_hh_det_dis_select = seq(row.key_informant_difficulty ?? [])
        .map((_) => {
          return fnSwitch(
            _!,
            {
              no: 'diff_none',
              seeing: 'diff_see',
              hearing: 'diff_hear',
              walking: 'diff_walk',
              remembering_concentrating: 'diff_rem',
              self_care: 'diff_care',
              using_usual_language: 'diff_comm',
            } as const,
            () => undefined,
          )
        })
        .compact()
      return common({
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({
          ..._,
          hh_char_hh_det_dis_select,
          hh_char_hh_res_stat: _.hh_char_hh_det_status,
        })),
      })
    }

    export const meal_cashPdm = (row: Meal_cashPdm.T): Person.Details[] => [
      {
        age: row.age,
        gender: Gender.common({hh_char_hh_det_gender: row.sex}),
        displacement: Displacement.common({hh_char_hh_res_stat: row.status_person}),
      },
    ]

    export const protection_referral = (row: Protection_referral.T): Person.Details[] => {
      const displacement = fnSwitch(
        row.displacement_status!,
        {
          idp: Person.DisplacementStatus.Idp,
          idp_returnee: Person.DisplacementStatus.Returnee,
          refugee_retuenee: Person.DisplacementStatus.Returnee,
          non_peenisplaced: Person.DisplacementStatus.NonDisplaced,
          refugee_Refenee: Person.DisplacementStatus.Refugee,
        },
        () => undefined,
      )
      return [
        {
          age: row.age,
          gender: fnSwitch(
            row.gender!,
            {
              man: Person.Gender.Male,
              woman: Person.Gender.Female,
              boy: Person.Gender.Male,
              girl: Person.Gender.Female,
              other: Person.Gender.Other,
            },
            () => undefined,
          ),
          displacement,
        },
      ]
    }

    export const bn_rapidResponse2 = (row: Bn_rapidResponse2.T) => {
      return common({
        ...row,
        hh_char_hh_det: row.hh_char_hh_det?.map((_) => ({
          ..._,
          hh_char_hh_res_stat: fnSwitch(
            _.hh_char_hh_res_stat!,
            {
              ret: 'ret',
              ref_asy: 'ref_asy',
              idp: 'idp',
              long_res: 'long_res',
              idp_after_evacuation: 'idp',
            },
            () => undefined,
          ),
        })),
      })
    }
  }

  export type Breakdown = {
    disabilities: Person.WgDisability[]
    persons: Person.Details[]
    disabilitiesCount: number
    elderlyCount: number
    childrenCount: number
    adultCount: number
  }

  export namespace Breakdown {
    export const addProperty = <T extends Record<string, any>>(
      row: T,
      mapper: (row: any) => Person.Details[],
    ): T & {custom: Breakdown} => {
      return {
        ...row,
        custom: get(mapper(row)),
      }
    }

    export const get = (persons: Person.Details[]): Breakdown => {
      const disabilities = new Set<Person.WgDisability>()
      let pwdCount = 0
      let childrenCount = 0
      let elderlyCount = 0
      let adultCount = 0
      persons?.forEach((_) => {
        _.disability?.forEach(disabilities.add, disabilities)
        if (_.age && _.age < 18) childrenCount++
        if (_.age && _.age >= 18 && _.age < 60) adultCount++
        if (_.age && _.age >= 60) elderlyCount++
        if (_.disability && !_.disability.includes(Person.WgDisability.None)) pwdCount++
      })
      disabilities.delete(Person.WgDisability.None)
      return {
        persons: persons,
        adultCount: adultCount,
        elderlyCount: elderlyCount,
        childrenCount: childrenCount,
        disabilitiesCount: pwdCount,
        disabilities: Array.from(disabilities),
      }
    }
  }

  export namespace Location {
    export const mapOblast = OblastIndex.byKoboName

    export const mapRaion = (_?: Bn_re.T['ben_det_raion']) => _

    export const mapHromada = (_?: Bn_re.T['ben_det_hromada']) => _

    export const searchRaion = (_?: string) => (Bn_re.options.ben_det_raion as any)[_!]

    export const searchHromada = (_?: string) => (Bn_re.options.ben_det_hromada as any)[_!]

    export const getRaionLabel = (_?: Bn_re.T['ben_det_raion']) => (Bn_re.options.ben_det_raion as any)[_!]

    export const getHromadaLabel = (_?: Bn_re.T['ben_det_hromada']) => (Bn_re.options.ben_det_hromada as any)[_!]
  }
}
