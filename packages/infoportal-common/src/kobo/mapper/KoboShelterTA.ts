import {ShelterContractor} from './ShelterContractor'
import {Shelter_ta} from '../generated/Shelter_TA'
import {fnSwitch, KeyOfType, map} from '@alexandreannic/ts-utils'
import {KoboBaseTags, KoboTagStatus} from './Kobo'
import {DrcProject} from '../../type/Drc'
import {Bn_re, Shelter_nta} from '../generated'

export namespace KoboShelterTa {
  const harmonizeNtaDisability = (disabilities: Shelter_nta.T['hh_char_hhh_dis_select']): Bn_re.T['hh_char_dis_select'] => {
    return disabilities?.map(_ => {
      return fnSwitch(_!, {
        diff_medical: 'diff_care',
        diff_mental: 'diff_rem',
      }, () => _! as any)
    })
  }

  export const harmonizeNtaDisabilityAll = (row: Shelter_nta.T): any => {
    // @ts-ignore
    row.hh_char_hhh_dis_select = harmonizeNtaDisability(row.hh_char_hhh_dis_select)
    // @ts-ignore
    row.hh_char_res_dis_select = harmonizeNtaDisability(row.hh_char_res_dis_select)
    // @ts-ignore
    row.hh_char_hh_det = row.hh_char_hh_det?.map(_ => {
      return {
        ..._,
        hh_char_hh_det_dis_select: harmonizeNtaDisability(_.hh_char_hh_det_dis_select)
      }
    })
    return row
  }

  const lot1: KeyOfType<Shelter_ta.T, undefined | number>[] = [
    'dismantling_of_structures',
    'singleshutter_window_tripleglazed_pc',
    'singleshutter_window_tripleglazed_m',
    'singleshutter_windowdoubleglazed_pc',
    'singleshutter_windowdoubleglazed_m',
    'doubleshutter_window_tripleglazed_pc',
    'doubleshutter_window_tripleglazed_m',
    'doubleshutter_window_doubleglazed_pc',
    'doubleshutter_window_doubleglazed_m',
    'glass_replacement_doubleglazed_pc',
    'glass_replacement_doubleglazed_m',
    'glass_replacement_tripleglazed_pc',
    'glass_replacement_tripleglazed_m',
    'outer_seels_galvanized_with_pvc_coating_lm',
    'window_slopes_m',
    'minor_window_repairs_pc',
    'doubleglazed_upvc_door_pc',
    'doubleglazed_upvc_door_m',
  ]

  const lot2: KeyOfType<Shelter_ta.T, number | undefined>[] = [
    'dismantling_of_structures2',
    'wall_repair_clay_bricks_m',
    'wall_repair_concrete_blocks_m',
    'reinforced_concrete_lintels_foundations_columns_ring_beam_m',
    'reinforced_floor_screed_m',
    'floor_base_m',
    'minor_welding_works_kg',
    'mineral_wool_for_external_walls_m',
    'mineral_wool_for_the_ceiling_m',
    'plaster_primer_and_finishing_painting_m',
    'wooden_lathing__mm_x__mm_ml',
    'wooden_beams__mm_x__mm_ml',
    'roof_shiffer_m',
    'roof_metal_sheets_m',
    'roof_onduline_sheets_m',
    'bitumen_paint_m',
    'gypsum_boards_for_ceiling_m',
    'waterproofing_barrier_sheet_m',
    'steam_vapor_barrier_sheet_m',
    'electrical_wiring_lm',
    'double_electrical_sockets_pc',
    'double_switches_pc',
    'circuit_breaker_box_pc',
    'ppr_pipes_cold_and_hot_water_supply_lm',
    'ppr_heating_pipes_lm',
    'kitchen_sink_pc',
    'washing_basin_with_mixer_and_sifon_pc',
    'steel_bathtub_pc',
    'compact_toilet_bowl_including_seat_and_lid_pc',
    'water_heater_of_up_to__liters_dry_ten_pc',
    'steel_radiator_600mm',
    'steel_radiator_800mm',
    'steel_radiator_1000',
    'steel_radiator_2000',
    'bimetallic_radiator_sections_length_mm_pc',
    'wall_mountes_cable_wiring_lm',
  ]

  const lot3: KeyOfType<Shelter_ta.T, number | undefined>[] = [
    'external_doors_pc',
    'internal_wooden_doors_pc',
  ]

  export const hasLot1 = (row?: Shelter_ta.T): boolean | undefined => {
    if (row) return !!lot1.find(k => map(row[k], _ => _ > 0) ?? false)
  }
  export const hasLot2 = (row?: Shelter_ta.T): boolean | undefined => {
    if (row) return !!lot2.find(k => map(row[k], _ => _ > 0) ?? false)
  }
  export const hasLot3 = (row?: Shelter_ta.T): boolean | undefined => {
    if (row) return !!lot3.find(k => map(row[k], _ => _ > 0) ?? false)
  }
}

export enum ShelterProgress {
  ContractorVisitDone = 'ContractorVisitDone',
  WorkEstimatesReceived = 'WorkEstimatesReceived',
  PurchaseRequestDone = 'PurchaseRequestDone',
  WorkOrderDone = 'WorkOrderDone',
  RepairWorksStarted = 'RepairWorksStarted',
  RepairWorksCompleted = 'RepairWorksCompleted',
  // ContractorInvoiceReceived = 'ContractorInvoiceReceived',
  // HandoverCertificateOfCompletionSigned = 'HandoverCertificateOfCompletionSigned',
  // InvoicePaymentProcessed = 'InvoicePaymentProcessed',
}

export interface ShelterNtaTags extends KoboTagStatus, KoboBaseTags {
  interviewee_name?: string
  pay_det_tax_id_num?: string
  agreement?: string
  workOrder?: string
  project?: DrcProject[]
}

export enum ShelterTaPriceLevel {
  Light = 'Light',
  Medium = 'Medium',
  Heavy = 'Heavy',
}

export interface ShelterTaTags extends KoboBaseTags {
  progress?: ShelterProgress
  contractor1?: ShelterContractor
  contractor2?: ShelterContractor
  contractor3?: ShelterContractor
  contractor4?: ShelterContractor
  workDoneAt?: Date
  price?: number
  damageLevel: ShelterTaPriceLevel
}

export class ShelterTaTagsHelper {
  static readonly mapTags = (_: any): ShelterTaTags => {
    return {
      ..._,
      workDoneAt: _?.workDoneAt ? new Date(_.workDoneAt) : undefined
    }
  }
}

export const shelterDrcProject = [
  DrcProject['UKR-000270 Pooled Funds'],
  DrcProject['UKR-000298 Novo-Nordisk'],
  DrcProject['UKR-000308 UNHCR'],
  DrcProject['UKR-000314 UHF4'],
  DrcProject['UKR-000322 ECHO2'],
  DrcProject['UKR-000336 UHF6'],
  DrcProject['UKR-000345 BHA2'],
  DrcProject['UKR-000363 UHF8'],
  DrcProject['UKR-000372 ECHO3'],
]