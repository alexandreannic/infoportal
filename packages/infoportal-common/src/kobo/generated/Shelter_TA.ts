export namespace Shelter_ta {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aTP5nwZjpyR7oy7bdMZktC
  export interface T {
    start: string
    end: string
    // nta_form [select_one] NTA Form
    nta_form: undefined | Option<'nta_form'>
    // nta_id [text] NTA ID
    nta_id: string | undefined
    // interwiever_name [text] Interwiever's name
    interwiever_name: string | undefined
    // ben_det_oblast [select_one] Specify the Oblast
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // ben_det_raion [select_one] Specify the Rayon
    ben_det_raion: undefined | string
    // ben_det_hromada [select_one] Specify the Hromada
    ben_det_hromada: undefined | string
    // ben_det_settlement [text] Specify the Settlement
    ben_det_settlement: string | undefined
    // ben_det_addres [text] Specify the Address and house/apartment number
    ben_det_addres: string | undefined
    // house_or_apartment [select_one] House or Apartment
    house_or_apartment: undefined | Option<'house_or_apartment'>
    // dismantling_of_structures [decimal] ####1.1 Dismantling of structures (M3)
    dismantling_of_structures: number | undefined
    // singleshutter_window_tripleglazed [note] ####1.2 Single-shutter window, triple-glazed
    singleshutter_window_tripleglazed: string
    // singleshutter_window_tripleglazed_pc [decimal] pc
    singleshutter_window_tripleglazed_pc: number | undefined
    // singleshutter_window_tripleglazed_m [decimal] m2
    singleshutter_window_tripleglazed_m: number | undefined
    // singleshutter_windowdoubleglazed [note] ####1.3 Single-shutter window,double-glazed
    singleshutter_windowdoubleglazed: string
    // singleshutter_windowdoubleglazed_pc [decimal] pc
    singleshutter_windowdoubleglazed_pc: number | undefined
    // singleshutter_windowdoubleglazed_m [decimal] m2
    singleshutter_windowdoubleglazed_m: number | undefined
    // doubleshutter_window_tripleglazed [note] ####1.4 Double-shutter window triple-glazed
    doubleshutter_window_tripleglazed: string
    // doubleshutter_window_tripleglazed_pc [decimal] pc
    doubleshutter_window_tripleglazed_pc: number | undefined
    // doubleshutter_window_tripleglazed_m [decimal] m2
    doubleshutter_window_tripleglazed_m: number | undefined
    // doubleshutter_window_doubleglazed [note] ####1.5 Double-shutter window double-glazed
    doubleshutter_window_doubleglazed: string
    // doubleshutter_window_doubleglazed_pc [decimal] pc
    doubleshutter_window_doubleglazed_pc: number | undefined
    // doubleshutter_window_doubleglazed_m [decimal] m2
    doubleshutter_window_doubleglazed_m: number | undefined
    // glass_replacement_doubleglazed [note] ####1.6 Glass replacement double-glazed
    glass_replacement_doubleglazed: string
    // glass_replacement_doubleglazed_pc [decimal] pc
    glass_replacement_doubleglazed_pc: number | undefined
    // glass_replacement_doubleglazed_m [decimal] m2
    glass_replacement_doubleglazed_m: number | undefined
    // glass_replacement_tripleglazed [note] ####1.7 Glass replacement triple-glazed
    glass_replacement_tripleglazed: string
    // glass_replacement_tripleglazed_pc [decimal] pc
    glass_replacement_tripleglazed_pc: number | undefined
    // glass_replacement_tripleglazed_m [decimal] m2
    glass_replacement_tripleglazed_m: number | undefined
    // outer_seels_galvanized_with_pvc_coating_lm [decimal] 1.8 Outer seels galvanized with PVC coating (lm)
    outer_seels_galvanized_with_pvc_coating_lm: number | undefined
    // window_slopes_m [decimal] ####1.9 Window slopes (m2)
    window_slopes_m: number | undefined
    // minor_window_repairs_pc [decimal] ####1.10 Minor window repairs (pc)
    minor_window_repairs_pc: number | undefined
    // doubleglazed_upvc_door [note] ####1.11 Double-glazed UPVC door (pc)
    doubleglazed_upvc_door: string
    // doubleglazed_upvc_door_pc [decimal] pc
    doubleglazed_upvc_door_pc: number | undefined
    // doubleglazed_upvc_door_m [decimal] m2
    doubleglazed_upvc_door_m: number | undefined
    // dismantling_of_structures2 [decimal] 2.1 Dismantling of structures (M3)
    dismantling_of_structures2: number | undefined
    // wall_repair_clay_bricks_m [decimal] 2.2 Wall repair clay bricks (m3)
    wall_repair_clay_bricks_m: number | undefined
    // wall_repair_concrete_blocks_m [decimal] 2.3 Wall repair concrete blocks (m3)
    wall_repair_concrete_blocks_m: number | undefined
    // reinforced_concrete_lintels_foundations_columns_ring_beam_m [decimal] 2.4 Reinforced concrete lintels, foundations, columns, ring beam (m3)
    reinforced_concrete_lintels_foundations_columns_ring_beam_m: number | undefined
    // reinforced_floor_screed_m [decimal] 2.5 Reinforced floor screed (m2)
    reinforced_floor_screed_m: number | undefined
    // floor_base_m [decimal] 2.6 Floor base (m2)
    floor_base_m: number | undefined
    // minor_welding_works_kg [decimal] 2.7 Minor welding works (kg)
    minor_welding_works_kg: number | undefined
    // mineral_wool_for_external_walls_m [decimal] 2.8 Mineral wool for external walls (m2)
    mineral_wool_for_external_walls_m: number | undefined
    // mineral_wool_for_the_ceiling_m [decimal] 2.9 Mineral wool for the ceiling (m2)
    mineral_wool_for_the_ceiling_m: number | undefined
    // plaster_primer_and_finishing_painting_m [decimal] 2.10 Plaster, primer and finishing painting (m2)
    plaster_primer_and_finishing_painting_m: number | undefined
    // wooden_lathing__mm_x__mm_ml [decimal] ####2.11 Wooden lathing (20 mm x 200 mm) (m2)
    wooden_lathing__mm_x__mm_ml: number | undefined
    // wooden_beams__mm_x__mm_ml [decimal] ####2.12 Wooden beams (50 mm x 300 mm) (m2)
    wooden_beams__mm_x__mm_ml: number | undefined
    // roof_shiffer_m [decimal] ####2.13 Roof Shiffer (m2)
    roof_shiffer_m: number | undefined
    // roof_metal_sheets_m [decimal] ####2.14 Roof metal sheets (m2)
    roof_metal_sheets_m: number | undefined
    // roof_onduline_sheets_m [decimal] 2.15 Roof onduline sheets (m2)
    roof_onduline_sheets_m: number | undefined
    // bitumen_paint_m [decimal] 2.16 Bitumen paint (m2)
    bitumen_paint_m: number | undefined
    // gypsum_boards_for_ceiling_m [decimal] 2.17 Gypsum boards for ceiling (m2)
    gypsum_boards_for_ceiling_m: number | undefined
    // waterproofing_barrier_sheet_m [decimal] 2.18 Waterproofing barrier sheet (m2)
    waterproofing_barrier_sheet_m: number | undefined
    // steam_vapor_barrier_sheet_m [decimal] 2.19 Steam vapor barrier sheet (m2)
    steam_vapor_barrier_sheet_m: number | undefined
    // external_doors_pc [decimal] ####2.20 External doors (pc)
    external_doors_pc: number | undefined
    // internal_wooden_doors_pc [decimal] ####2.21 Internal wooden doors (pc)
    internal_wooden_doors_pc: number | undefined
    // electrical_wiring_lm [decimal] 2.22 Electrical wiring (lm)
    electrical_wiring_lm: number | undefined
    // double_electrical_sockets_pc [decimal] 2.23 Double electrical sockets (pc)
    double_electrical_sockets_pc: number | undefined
    // double_switches_pc [decimal] 2.24 Double switches. (pc)
    double_switches_pc: number | undefined
    // circuit_breaker_box_pc [decimal] 2.25 Circuit breaker box (pc)
    circuit_breaker_box_pc: number | undefined
    // ppr_pipes_cold_and_hot_water_supply_lm [decimal] 2.26 PPr pipes cold and hot water supply (lm)
    ppr_pipes_cold_and_hot_water_supply_lm: number | undefined
    // ppr_heating_pipes_lm [decimal] 2.27 PPr heating pipes (lm)
    ppr_heating_pipes_lm: number | undefined
    // kitchen_sink_pc [decimal] 2.28 Kitchen sink (pc)
    kitchen_sink_pc: number | undefined
    // washing_basin_with_mixer_and_sifon_pc [decimal] 2.29 Washing basin with mixer and sifon (pc)
    washing_basin_with_mixer_and_sifon_pc: number | undefined
    // steel_bathtub_pc [decimal] 2.30 Steel bathtub (pc)
    steel_bathtub_pc: number | undefined
    // compact_toilet_bowl_including_seat_and_lid_pc [decimal] 2.31 Compact toilet bowl, including seat and lid (pc)
    compact_toilet_bowl_including_seat_and_lid_pc: number | undefined
    // water_heater_of_up_to__liters_dry_ten_pc [decimal] 2.32 Water heater of up to 50 liters dry ten (pc)
    water_heater_of_up_to__liters_dry_ten_pc: number | undefined
    // steel_radiator [note] #####2.33 Steel radiator
    steel_radiator: string
    // steel_radiator_600mm [decimal] 600 mm
    steel_radiator_600mm: number | undefined
    // steel_radiator_800mm [decimal] 800mm
    steel_radiator_800mm: number | undefined
    // steel_radiator2 [note] #####2.34 Steel radiator
    steel_radiator2: string
    // steel_radiator_1000 [decimal] 1000mm
    steel_radiator_1000: number | undefined
    // steel_radiator_2000 [decimal] 1200mm
    steel_radiator_2000: number | undefined
    // bimetallic_radiator_sections_length_mm_pc [decimal] 2.35 Bimetallic radiator sections, length 800mm (pc)
    bimetallic_radiator_sections_length_mm_pc: number | undefined
    // wall_mountes_cable_wiring_lm [decimal] 2.36 Wall mountes cable wiring (lm)
    wall_mountes_cable_wiring_lm: number | undefined
    // comments [text] Other Comments
    comments: string | undefined
  }
  export const options = {
    nta_form: {
      nta: `Shelter - Non-Technical Assessment`,
    },
    ben_det_oblast: {
      cherkaska: `Cherkaska`,
      chernihivska: `Chernihivska`,
      chernivetska: `Chernivetska`,
      dnipropetrovska: `Dnipropetrovska`,
      donetska: `Donetska`,
      'ivano-frankivska': `Ivano-Frankivska`,
      kharkivska: `Kharkivska`,
      khersonska: `Khersonska`,
      khmelnytska: `Khmelnytska`,
      kirovohradska: `Kirovohradska`,
      kyivska: `Kyivska`,
      luhanska: `Luhanska`,
      lvivska: `Lvivska`,
      mykolaivska: `Mykolaivska`,
      odeska: `Odeska`,
      poltavska: `Poltavska`,
      rivnenska: `Rivnenska`,
      sevastopilska: `Sevastopilska`,
      sumska: `Sumska`,
      ternopilska: `Ternopilska`,
      vinnytska: `Vinnytska`,
      volynska: `Volynska`,
      zakarpatska: `Zakarpatska`,
      zaporizka: `Zaporizka`,
      zhytomyrska: `Zhytomyrska`,
    },
    house_or_apartment: {
      house: `House`,
      apartment: `Apartment`,
    },
  }

  const extractQuestionName = (_: Record<string, any>) => {
    const output: any = {}
    Object.entries(_).forEach(([k, v]) => {
      const arr = k.split('/')
      const qName = arr[arr.length - 1]
      output[qName] = v
    })
    return output
  }

  export const map = (_: Record<keyof T, any>): T =>
    ({
      ..._,
    }) as T
}
