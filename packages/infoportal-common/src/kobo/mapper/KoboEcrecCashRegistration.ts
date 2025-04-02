import {CashStatus, KoboBaseTags, KoboSubmissionFlat} from './Kobo.js'
import {fnSwitch} from '@axanc/ts-utils'
import {Ecrec_cashRegistration, Ecrec_cashRegistrationBha} from '../generated/index.js'
import {DrcProgram, DrcProject, DrcProjectHelper} from '../../type/Drc.js'
import {KoboXmlMapper} from './KoboXmlMapper.js'

const minimumWageUah = 7100

export namespace KoboEcrec_cashRegistration {
  export const getProgram = (_: Ecrec_cashRegistration.T): DrcProgram[] => {
    const project = DrcProjectHelper.search(Ecrec_cashRegistration.options.back_donor[_.back_donor!])
    const activities = []
    if (
      [
        DrcProject['UKR-000336 UHF6'],
        DrcProject['UKR-000363 UHF8'],
        DrcProject['UKR-000322 ECHO2'],
        DrcProject['UKR-000372 ECHO3'],
      ].includes(project!)
    )
      activities.push(DrcProgram.SectoralCashForAgriculture)
    else {
      if (_.animal_shelter_need === 'yes') activities.push(DrcProgram.SectoralCashForAnimalShelterRepair)
      if (_.barriers_providing_sufficient === 'yes' && _.back_donor === 'uhf7')
        activities.push(DrcProgram.SectoralCashForAnimalFeed)
    }
    if (activities.length === 0) activities.push(DrcProgram.SectoralCashForAgriculture)
    return activities
  }

  export enum Program {
    CashforAnimalFeed = 'CashforAnimalFeed',
    CashforAnimalShelter = 'CashforAnimalShelter',
  }

  export interface Tags extends KoboBaseTags {
    status?: CashStatus
    paidUah?: number
    program?: Program
  }

  export type T = KoboSubmissionFlat<Ecrec_cashRegistrationBha.T | Ecrec_cashRegistration.T, Tags> & {
    custom: KoboXmlMapper.Breakdown & {
      eligibility: boolean
      vulnerability: number
    }
  }

  const isBha = (res: any): res is Ecrec_cashRegistrationBha.T => res.known_contamination_your !== undefined
  const isUhf = (res: any): res is Ecrec_cashRegistration.T => res.lost_breadwiner !== undefined

  const breadWinerMapper = <T>(row: T, q: keyof T, yes: number, exhausted: number) => {
    if (row[q] === 'yes') return yes
    if (row[q] === 'no_have_already_exhausted_this_coping_strategy_and_cannot_use_it_again') return exhausted
    return 0
  }

  export const calculateVulnerabilities = (_: KoboEcrec_cashRegistration.T) => {
    const res = KoboXmlMapper.Breakdown.addProperty(_, KoboXmlMapper.Persons.ecrec_cashRegistration)
    res.custom.eligibility =
      (_.land_cultivate ?? 0) >= 5 &&
      res.consume_majority === 'yes' &&
      res.depend_basic_needs === 'yes' &&
      isBha(res) &&
      res.known_contamination_your === 'yes'
    res.custom.vulnerability = 0
    // known_contamination_your
    res.custom.vulnerability += fnSwitch(
      _.ben_det_hh_size!,
      {
        3: 2,
        4: 3,
        5: 5,
      },
      () => 0,
    )
    res.custom.vulnerability += res.custom.disabilitiesCount === 1 ? 2 : res.custom.disabilitiesCount > 1 ? 3 : 0
    res.custom.vulnerability += res.custom.elderlyCount === 1 ? 1 : res.custom.disabilitiesCount > 1 ? 3 : 0
    if (['single', 'widow', 'div_sep'].includes(res.hh_char_civ_stat!) && res.custom.childrenCount > 0)
      res.custom.vulnerability += 2
    if (isUhf(res) && res.lost_breadwiner === 'yes') res.custom.vulnerability += 2
    if (isUhf(res) && res.Documented_loss_Assets === 'yes') res.custom.vulnerability += 3
    if (res.ben_det_income) {
      if (res.ben_det_income < minimumWageUah) res.custom.vulnerability += 5
      else if (res.ben_det_income < minimumWageUah * (res.ben_det_hh_size ?? 0)) res.custom.vulnerability += 3
    }
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_sell_hh_assets', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_spent_savings', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_forrowed_food', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_eat_elsewhere', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_sell_productive_assets', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_reduce_health_expenditures', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_reduce_education_expenditures', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_reduce_education_expenditures', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_sell_house', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_move_elsewhere', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_degrading_income_source', 1, 2)
    res.custom.vulnerability += breadWinerMapper(res, 'lcs_ask_stranger', 1, 2)
    return res
  }
}
