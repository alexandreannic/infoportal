import {KoboEcrec_cashRegistration, KoboGeneralMapping, KoboIndex} from 'infoportal-common'

export const databaseCustomMapping: Record<any, (_: any) => any> = {
  [KoboIndex.byName('ecrec_cashRegistration').id]: (_: KoboEcrec_cashRegistration.T) => KoboEcrec_cashRegistration.calculateVulnerabilities(_),
  [KoboIndex.byName('ecrec_cashRegistrationBha').id]: (_: KoboEcrec_cashRegistration.T) => KoboEcrec_cashRegistration.calculateVulnerabilities(_),
  [KoboIndex.byName('ecrec_vetApplication').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('ecrec_vetEvaluation').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('ecrec_msmeGrantEoi').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('ecrec_msmeGrantReg').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_re').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_rapidResponse').id]: KoboGeneralMapping.addIndividualBreakdownColumnForRrm,
  [KoboIndex.byName('bn_rapidResponse2').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_cashForRentRegistration').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_cashForRentApplication').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('shelter_cashForShelter').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('shelter_nta').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('protection_pss').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('protection_hhs3').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('protection_groupSession').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('meal_cashPdm').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('partner_lampa').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
}