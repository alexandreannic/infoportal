import {Obj} from '@alexandreannic/ts-utils'
import {Shelter_ta} from '../generated'
import {KoboShelterTa} from './KoboShelterTA'

export enum ShelterContractor {
  'Artbudservice' = 'Artbudservice',
  'Darwin' = 'Darwin',
  'Dom 2007' = 'Dom 2007',
  'Donmegastroy' = 'Donmegastroy',
  'Dosvid 2002' = 'Dosvid 2002',
  'Framplus' = 'Framplus',
  'Interbud' = 'Interbud',
  'Kramelitbud' = 'Kramelitbud',
  'Kronos' = 'Kronos',
  'Megalit' = 'Megalit',
  'Monolit' = 'Monolit',
  'NVO ProektStroy' = 'NVO ProektStroy',
  'Osnova-R' = 'Osnova-R',
  'PGS Group' = 'PGS Group',
  'Skytown' = 'Skytown',
  'Starlight' = 'Starlight',
  'Tribotechnika' = 'Tribotechnika',
  'Ukr Bud Tekhnolohiyi' = 'Ukr Bud Tekhnolohiyi',
  'Ukrbudtechnologii' = 'Ukrbudtechnologii',
  'Zhilvest' = 'Zhilvest',
}

export class ShelterContractorPrices {

  static readonly findContractor = ({
    oblast,
    lot
  }: {
    oblast?: keyof typeof Shelter_ta.options['ben_det_oblast']
    lot: 1 | 2 | 3
  }): ShelterContractor[] => {
    const contractors = oblasts[oblast as keyof typeof oblasts] ?? Obj.values(ShelterContractor)
    return contractors
    // .filter(_ => {
    // return (pricesCents[_]?.dismantling_of_structures && lot === 1)
    //   || (pricesCents[_]?.dismantling_of_structures2 && lot === 2)
    //   || (pricesCents[_]?.external_doors_pc && lot === 3)
    // })
  }

  static readonly compute = ({
    answer,
    contractor1,
    contractor2,
    contractor3,
  }: {
    contractor1?: ShelterContractor
    contractor2?: ShelterContractor
    contractor3?: ShelterContractor
    answer?: Shelter_ta.T
  }): number | undefined | null => {
    if (!answer || (!contractor1 && !contractor2 && !contractor3)) return undefined
    try {
      let total = 0
      if (KoboShelterTa.hasLot1(answer) && contractor1)
        lot1.map(question => {
          const quantity = answer[question] as number ?? 0
          const price = pricesCents[contractor1]![question]!
          if (price === undefined) throw new Error()
          total += quantity * price
        })
      if (KoboShelterTa.hasLot2(answer) && contractor2)
        lot2.map(question => {
          const quantity = answer[question] as number ?? 0
          const price = pricesCents[contractor2]![question]!
          if (price === undefined) throw new Error()
          total += quantity * price
        })
      if (KoboShelterTa.hasLot3(answer) && contractor3)
        lot1.map(question => {
          const quantity = answer[question] as number ?? 0
          const price = pricesCents[contractor3]![question]!
          if (price === undefined) throw new Error()
          total += quantity * price
        })
      return total / 100
    } catch (e) {
      return null
    }
  }
}

const lot1: (keyof Shelter_ta.T)[] = [
  'dismantling_of_structures',
  'singleshutter_window_tripleglazed_m',
  'singleshutter_windowdoubleglazed_m',
  'doubleshutter_window_tripleglazed_m',
  'doubleshutter_window_doubleglazed_m',
  'glass_replacement_doubleglazed_m',
  'glass_replacement_tripleglazed_m',
  'outer_seels_galvanized_with_pvc_coating_lm',
  'window_slopes_m',
  'minor_window_repairs_pc',
  'doubleglazed_upvc_door_m'
]

const lot2: (keyof Shelter_ta.T)[] = [
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
  'wall_mountes_cable_wiring_lm'
]
const lot3: (keyof Shelter_ta.T)[] = [
  'external_doors_pc',
  'internal_wooden_doors_pc',
]

const WAITING_FOR_PRICES_LOT: Partial<Record<keyof Shelter_ta.T, number>>[] = [
  {
    dismantling_of_structures: -1,
    singleshutter_window_tripleglazed_m: -1,
    singleshutter_windowdoubleglazed_m: -1,
    doubleshutter_window_tripleglazed_m: -1,
    doubleshutter_window_doubleglazed_m: -1,
    glass_replacement_doubleglazed_m: -1,
    glass_replacement_tripleglazed_m: -1,
    outer_seels_galvanized_with_pvc_coating_lm: -1,
    window_slopes_m: -1,
    minor_window_repairs_pc: -1,
    doubleglazed_upvc_door_m: -1
  },
  {
    dismantling_of_structures2: -1,
    wall_repair_clay_bricks_m: -1,
    wall_repair_concrete_blocks_m: -1,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: -1,
    reinforced_floor_screed_m: -1,
    floor_base_m: -1,
    minor_welding_works_kg: -1,
    mineral_wool_for_external_walls_m: -1,
    mineral_wool_for_the_ceiling_m: -1,
    plaster_primer_and_finishing_painting_m: -1,
    wooden_lathing__mm_x__mm_ml: -1,
    wooden_beams__mm_x__mm_ml: -1,
    roof_shiffer_m: -1,
    roof_metal_sheets_m: -1,
    roof_onduline_sheets_m: -1,
    bitumen_paint_m: -1,
    gypsum_boards_for_ceiling_m: -1,
    waterproofing_barrier_sheet_m: -1,
    steam_vapor_barrier_sheet_m: -1,
    electrical_wiring_lm: -1,
    double_electrical_sockets_pc: -1,
    double_switches_pc: -1,
    circuit_breaker_box_pc: -1,
    ppr_pipes_cold_and_hot_water_supply_lm: -1,
    ppr_heating_pipes_lm: -1,
    kitchen_sink_pc: -1,
    washing_basin_with_mixer_and_sifon_pc: -1,
    steel_bathtub_pc: -1,
    compact_toilet_bowl_including_seat_and_lid_pc: -1,
    water_heater_of_up_to__liters_dry_ten_pc: -1,
    steel_radiator_600mm: -1,
    steel_radiator_800mm: -1,
    steel_radiator_1000: -1,
    steel_radiator_2000: -1,
    bimetallic_radiator_sections_length_mm_pc: -1,
    wall_mountes_cable_wiring_lm: -1
  },
  {
    external_doors_pc: -1,
    internal_wooden_doors_pc: -1,
  }
]


const WAITING_FOR_PRICES = WAITING_FOR_PRICES_LOT.reduce((acc, _) => ({...acc, ..._}), {})

const pricesCents: Partial<Record<ShelterContractor, Partial<Record<keyof Shelter_ta.T, number>>>> = {
  [ShelterContractor['Zhilvest']]: {
    dismantling_of_structures2: 140000,
    wall_repair_clay_bricks_m: 1284000,
    wall_repair_concrete_blocks_m: 795000,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: 1266000,
    reinforced_floor_screed_m: 151000,
    floor_base_m: 95500,
    minor_welding_works_kg: 5500,
    mineral_wool_for_external_walls_m: 254500,
    mineral_wool_for_the_ceiling_m: 58000,
    plaster_primer_and_finishing_painting_m: 121000,
    wooden_lathing__mm_x__mm_ml: 25000,
    wooden_beams__mm_x__mm_ml: 46000,
    roof_shiffer_m: 68500,
    roof_metal_sheets_m: 76800,
    roof_onduline_sheets_m: 97800,
    bitumen_paint_m: 35000,
    gypsum_boards_for_ceiling_m: 120000,
    waterproofing_barrier_sheet_m: 12000,
    steam_vapor_barrier_sheet_m: 12000,
    external_doors_pc: 1520000,
    internal_wooden_doors_pc: 1168500,
    electrical_wiring_lm: 25000,
    double_electrical_sockets_pc: 27300,
    double_switches_pc: 31200,
    circuit_breaker_box_pc: 89000,
    ppr_pipes_cold_and_hot_water_supply_lm: 27200,
    ppr_heating_pipes_lm: 57100,
    kitchen_sink_pc: 499500,
    washing_basin_with_mixer_and_sifon_pc: 445700,
    steel_bathtub_pc: 1130000,
    compact_toilet_bowl_including_seat_and_lid_pc: 592000,
    water_heater_of_up_to__liters_dry_ten_pc: 1070000,
    steel_radiator_600mm: 413000,
    steel_radiator_800mm: 413000,
    steel_radiator_1000: 654200,
    steel_radiator_2000: 654200,
    bimetallic_radiator_sections_length_mm_pc: 189700,
    wall_mountes_cable_wiring_lm: 25000
  },
  [ShelterContractor['Megalit']]: {
    dismantling_of_structures: 85000,
    singleshutter_window_tripleglazed_m: 695000,
    singleshutter_windowdoubleglazed_m: 665000,
    doubleshutter_window_tripleglazed_m: 625000,
    doubleshutter_window_doubleglazed_m: 605000,
    glass_replacement_doubleglazed_m: 280000,
    glass_replacement_tripleglazed_m: 320000,
    outer_seels_galvanized_with_pvc_coating_lm: 38000,
    window_slopes_m: 121900,
    minor_window_repairs_pc: 90000,
    doubleglazed_upvc_door_m: 530000
  },
  [ShelterContractor['Artbudservice']]: {
    dismantling_of_structures2: 202,
    wall_repair_clay_bricks_m: 1200225,
    wall_repair_concrete_blocks_m: 1126365,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: 1200225,
    reinforced_floor_screed_m: 1126365,
    floor_base_m: 40888,
    minor_welding_works_kg: 52920,
    mineral_wool_for_external_walls_m: 223188,
    mineral_wool_for_the_ceiling_m: 91864,
    plaster_primer_and_finishing_painting_m: 67558,
    wooden_lathing__mm_x__mm_ml: 60426,
    wooden_beams__mm_x__mm_ml: 44023,
    roof_shiffer_m: 107097,
    roof_metal_sheets_m: 162988,
    roof_onduline_sheets_m: 114483,
    bitumen_paint_m: 33631,
    gypsum_boards_for_ceiling_m: 158621,
    waterproofing_barrier_sheet_m: 62478,
    steam_vapor_barrier_sheet_m: 15362,
    external_doors_pc: 1667307,
    internal_wooden_doors_pc: 1084911,
    electrical_wiring_lm: 19113,
    double_electrical_sockets_pc: 99711,
    double_switches_pc: 32490,
    circuit_breaker_box_pc: 85413,
    ppr_pipes_cold_and_hot_water_supply_lm: 110790,
    ppr_heating_pipes_lm: 110790,
    kitchen_sink_pc: 595269,
    washing_basin_with_mixer_and_sifon_pc: 1282561,
    steel_bathtub_pc: 1857579,
    compact_toilet_bowl_including_seat_and_lid_pc: 809736,
    water_heater_of_up_to__liters_dry_ten_pc: 963005,
    steel_radiator_600mm: 571103,
    steel_radiator_800mm: 571103,
    steel_radiator_1000: 571103,
    steel_radiator_2000: 571103,
    bimetallic_radiator_sections_length_mm_pc: 571103,
    wall_mountes_cable_wiring_lm: 38749
  },
  [ShelterContractor['Kramelitbud']]: {
    dismantling_of_structures: 85000,
    singleshutter_window_tripleglazed_m: 695000,
    singleshutter_windowdoubleglazed_m: 665000,
    doubleshutter_window_tripleglazed_m: 625000,
    doubleshutter_window_doubleglazed_m: 605000,
    glass_replacement_doubleglazed_m: 280000,
    glass_replacement_tripleglazed_m: 320000,
    outer_seels_galvanized_with_pvc_coating_lm: 38000,
    window_slopes_m: 121900,
    minor_window_repairs_pc: 90000,
    doubleglazed_upvc_door_m: 530000,
    dismantling_of_structures2: 85000,
    wall_repair_clay_bricks_m: 1650000,
    wall_repair_concrete_blocks_m: 720000,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: 1220000,
    reinforced_floor_screed_m: 85000,
    floor_base_m: 40700,
    minor_welding_works_kg: 13800,
    mineral_wool_for_external_walls_m: 250000,
    mineral_wool_for_the_ceiling_m: 52000,
    plaster_primer_and_finishing_painting_m: 134900,
    wooden_lathing__mm_x__mm_ml: 49000,
    wooden_beams__mm_x__mm_ml: 59600,
    roof_shiffer_m: 120000,
    roof_metal_sheets_m: 120000,
    roof_onduline_sheets_m: 120000,
    bitumen_paint_m: 10100,
    gypsum_boards_for_ceiling_m: 40800,
    waterproofing_barrier_sheet_m: 20400,
    steam_vapor_barrier_sheet_m: 6700,
    external_doors_pc: 950000,
    internal_wooden_doors_pc: 690000,
    electrical_wiring_lm: 24200,
    double_electrical_sockets_pc: 22000,
    double_switches_pc: 14200,
    circuit_breaker_box_pc: 21700,
    ppr_pipes_cold_and_hot_water_supply_lm: 34300,
    ppr_heating_pipes_lm: 34300,
    kitchen_sink_pc: 765000,
    washing_basin_with_mixer_and_sifon_pc: 783000,
    steel_bathtub_pc: 1136500,
    compact_toilet_bowl_including_seat_and_lid_pc: 792500,
    water_heater_of_up_to__liters_dry_ten_pc: 1317300,
    steel_radiator_600mm: 327000,
    steel_radiator_800mm: 327000,
    steel_radiator_1000: 497000,
    steel_radiator_2000: 497000,
    bimetallic_radiator_sections_length_mm_pc: 487000,
    wall_mountes_cable_wiring_lm: 31500
  },
  [ShelterContractor['Osnova-R']]: {
    dismantling_of_structures: 111111,
    singleshutter_window_tripleglazed_m: 445175,
    singleshutter_windowdoubleglazed_m: 363519,
    doubleshutter_window_tripleglazed_m: 403313,
    doubleshutter_window_doubleglazed_m: 377387,
    glass_replacement_doubleglazed_m: 128611,
    glass_replacement_tripleglazed_m: 199722,
    outer_seels_galvanized_with_pvc_coating_lm: 9504,
    window_slopes_m: 284776,
    minor_window_repairs_pc: 38241,
    doubleglazed_upvc_door_m: 341101
  },
  [ShelterContractor['Dosvid 2002']]: {
    dismantling_of_structures: 134000,
    singleshutter_window_tripleglazed_m: 527500,
    singleshutter_windowdoubleglazed_m: 393500,
    doubleshutter_window_tripleglazed_m: 577700,
    doubleshutter_window_doubleglazed_m: 318100,
    glass_replacement_doubleglazed_m: 234400,
    glass_replacement_tripleglazed_m: 251200,
    outer_seels_galvanized_with_pvc_coating_lm: 23400,
    window_slopes_m: 134000,
    minor_window_repairs_pc: 25100,
    doubleglazed_upvc_door_m: 736700,
    dismantling_of_structures2: 134000,
    wall_repair_clay_bricks_m: 527500,
    wall_repair_concrete_blocks_m: 393500,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: 577700,
    reinforced_floor_screed_m: 318100,
    floor_base_m: 26800,
    minor_welding_works_kg: 7500,
    mineral_wool_for_external_walls_m: 117200,
    mineral_wool_for_the_ceiling_m: 34400,
    plaster_primer_and_finishing_painting_m: 39400,
    wooden_lathing__mm_x__mm_ml: 22100,
    wooden_beams__mm_x__mm_ml: 45900,
    roof_shiffer_m: 38500,
    roof_metal_sheets_m: 71800,
    roof_onduline_sheets_m: 36900,
    bitumen_paint_m: 25900,
    gypsum_boards_for_ceiling_m: 92500,
    waterproofing_barrier_sheet_m: 7200,
    steam_vapor_barrier_sheet_m: 6800,
    external_doors_pc: 1105000,
    internal_wooden_doors_pc: 753500,
    electrical_wiring_lm: 8400,
    double_electrical_sockets_pc: 60300,
    double_switches_pc: 24300,
    circuit_breaker_box_pc: 159100,
    ppr_pipes_cold_and_hot_water_supply_lm: 43500,
    ppr_heating_pipes_lm: 60300,
    kitchen_sink_pc: 426900,
    washing_basin_with_mixer_and_sifon_pc: 435400,
    steel_bathtub_pc: 1506900,
    compact_toilet_bowl_including_seat_and_lid_pc: 594400,
    water_heater_of_up_to__liters_dry_ten_pc: 803700,
    steel_radiator_600mm: 376800,
    steel_radiator_800mm: 376800,
    steel_radiator_1000: 418600,
    steel_radiator_2000: 418600,
    bimetallic_radiator_sections_length_mm_pc: 711500,
    wall_mountes_cable_wiring_lm: 37700
  },
  [ShelterContractor['Donmegastroy']]: {
    ...WAITING_FOR_PRICES,
    dismantling_of_structures2: 113855,
    wall_repair_clay_bricks_m: 856776,
    wall_repair_concrete_blocks_m: 808767,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: 856776,
    reinforced_floor_screed_m: 808767,
    floor_base_m: 58903,
    minor_welding_works_kg: 16988,
    mineral_wool_for_external_walls_m: 251124,
    mineral_wool_for_the_ceiling_m: 53622,
    plaster_primer_and_finishing_painting_m: 88078,
    wooden_lathing__mm_x__mm_ml: 46273,
    wooden_beams__mm_x__mm_ml: 92214,
    roof_shiffer_m: 73860,
    roof_metal_sheets_m: 76630,
    roof_onduline_sheets_m: 82502,
    bitumen_paint_m: 21899,
    gypsum_boards_for_ceiling_m: 103219,
    waterproofing_barrier_sheet_m: 10082,
    steam_vapor_barrier_sheet_m: 10082,
    external_doors_pc: 2233896,
    internal_wooden_doors_pc: 2100541,
    electrical_wiring_lm: 42728,
    double_electrical_sockets_pc: 32942,
    double_switches_pc: 40808,
    circuit_breaker_box_pc: 39884,
    ppr_pipes_cold_and_hot_water_supply_lm: 42580,
    ppr_heating_pipes_lm: 42580,
    kitchen_sink_pc: 618947,
    washing_basin_with_mixer_and_sifon_pc: 1186265,
    steel_bathtub_pc: 2103902,
    compact_toilet_bowl_including_seat_and_lid_pc: 920185,
    water_heater_of_up_to__liters_dry_ten_pc: 2305909,
    steel_radiator_600mm: 1819541,
    steel_radiator_800mm: 1819541,
    steel_radiator_1000: 2213400,
    steel_radiator_2000: 2213400,
    bimetallic_radiator_sections_length_mm_pc: 1699962,
    wall_mountes_cable_wiring_lm: 42839,
  },
  [ShelterContractor['Framplus']]: {
    dismantling_of_structures2: 113855,
    wall_repair_clay_bricks_m: 856776,
    wall_repair_concrete_blocks_m: 808767,
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: 856776,
    reinforced_floor_screed_m: 808767,
    floor_base_m: 58903,
    minor_welding_works_kg: 16988,
    mineral_wool_for_external_walls_m: 251124,
    mineral_wool_for_the_ceiling_m: 53622,
    plaster_primer_and_finishing_painting_m: 88078,
    wooden_lathing__mm_x__mm_ml: 46273,
    wooden_beams__mm_x__mm_ml: 92214,
    roof_shiffer_m: 73860,
    roof_metal_sheets_m: 76630,
    roof_onduline_sheets_m: 82502,
    bitumen_paint_m: 21899,
    gypsum_boards_for_ceiling_m: 103219,
    waterproofing_barrier_sheet_m: 10082,
    steam_vapor_barrier_sheet_m: 10082,
    external_doors_pc: 2233896,
    internal_wooden_doors_pc: 2100541,
    electrical_wiring_lm: 42728,
    double_electrical_sockets_pc: 32942,
    double_switches_pc: 40808,
    circuit_breaker_box_pc: 39884,
    ppr_pipes_cold_and_hot_water_supply_lm: 42580,
    ppr_heating_pipes_lm: 42580,
    kitchen_sink_pc: 618947,
    washing_basin_with_mixer_and_sifon_pc: 1186265,
    steel_bathtub_pc: 2103902,
    compact_toilet_bowl_including_seat_and_lid_pc: 920185,
    water_heater_of_up_to__liters_dry_ten_pc: 2305909,
    steel_radiator_600mm: 1819541,
    steel_radiator_800mm: 1819541,
    steel_radiator_1000: 2213400,
    steel_radiator_2000: 2213400,
    bimetallic_radiator_sections_length_mm_pc: 1699962,
    wall_mountes_cable_wiring_lm: 42839
  },
  // [ShelterContractor['Framplus']]: WAITING_FOR_PRICES,
  [ShelterContractor['Kronos']]: WAITING_FOR_PRICES,
  [ShelterContractor['Monolit']]: WAITING_FOR_PRICES,
  [ShelterContractor['Darwin']]: WAITING_FOR_PRICES,
  [ShelterContractor['Ukrbudtechnologii']]: WAITING_FOR_PRICES,
  [ShelterContractor['NVO ProektStroy']]: WAITING_FOR_PRICES,
  [ShelterContractor['Tribotechnika']]: WAITING_FOR_PRICES,
  [ShelterContractor['Skytown']]: WAITING_FOR_PRICES,
}
const oblasts = {
  mykolaivska: [
    ShelterContractor['Dosvid 2002'],
    ShelterContractor['Osnova-R'],
    ShelterContractor['Megalit'],
    // ShelterContractor['Kramelitbud'],
    ShelterContractor['Donmegastroy'],
    ShelterContractor['Kronos'],
    ShelterContractor['Darwin'],
    ShelterContractor['Monolit'],
    ShelterContractor['Ukrbudtechnologii'],
    ShelterContractor['NVO ProektStroy'],
    ShelterContractor['Tribotechnika'],
  ],
  sumska: [
    ShelterContractor['Dosvid 2002'],
    ShelterContractor['Osnova-R'],
    // ShelterContractor['Kramelitbud'],
    ShelterContractor['Zhilvest'],
    ShelterContractor['Donmegastroy'],
  ],
  kharkivska: [
    ShelterContractor['Dosvid 2002'],
    ShelterContractor['Osnova-R'],
    // ShelterContractor['Kramelitbud'],
    // ShelterContractor['Artbudservice'],
    ShelterContractor['Donmegastroy'],
    ShelterContractor['Framplus'],
    ShelterContractor['Kronos'],
    ShelterContractor['Monolit'],
    ShelterContractor['Darwin'],
  ]
}