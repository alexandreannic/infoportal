import {fnSwitch, map, seq} from '@axanc/ts-utils'
import {
  add,
  Bn_rapidResponse,
  Bn_rapidResponse2,
  Bn_re,
  CashStatus,
  DrcOffice,
  DrcProgram,
  DrcProject,
  DrcProjectHelper,
  DrcSectorHelper,
  KoboHelper,
  KoboMetaHelper,
  KoboMetaTagNfi,
  KoboTagStatus,
  MpcaEntityTags,
  safeNumber,
} from 'infoportal-common'
import {KoboMetaOrigin} from './KoboMetaType.js'
import {KoboMetaMapper, MetaMapped, MetaMapperInsert} from './KoboMetaService.js'
import {KoboXmlMapper} from 'infoportal-common'

const nfisPrograms = [DrcProgram.NFI, DrcProgram.ESK, DrcProgram.InfantWinterClothing, DrcProgram.InfantWinterClothing]

export class KoboMetaBasicneeds {
  static readonly bn_re: MetaMapperInsert<KoboMetaOrigin<Bn_re.T, MpcaEntityTags>> = (row) => {
    const answer = Bn_re.map(row.answers)
    const persons = KoboXmlMapper.Persons.bn_re(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)

    const activities =
      seq(answer.back_prog_type)
        ?.map((prog) => {
          return fnSwitch(
            prog.split('_')[0],
            {
              mpca: {
                activity: DrcProgram.MPCA,
                project: DrcProjectHelper.search(answer.donor_mpca ?? answer.back_donor?.[0]),
              },
              nfi: {
                activity: DrcProgram.NFI,
                project: DrcProjectHelper.search(answer.donor_nfi ?? answer.back_donor?.[0]),
              },
              esk: {
                activity: DrcProgram.ESK,
                project: DrcProjectHelper.search(answer.donor_esk ?? answer.back_donor?.[0]),
              },
              cfr: {
                activity: DrcProgram.CashForRent,
                project: DrcProjectHelper.search(answer.donor_cfr ?? answer.back_donor?.[0]),
              },
              cfe: {
                activity: DrcProgram.CashForEducation,
                project: DrcProjectHelper.search(answer.donor_cfe ?? answer.back_donor?.[0]),
              },
              csf: {
                activity: DrcProgram.CashForFuel,
                project: DrcProjectHelper.search(answer.donor_cff ?? answer.back_donor?.[0]),
              },
              cfu: {
                activity: DrcProgram.CashForUtilities,
                project: DrcProjectHelper.search(answer.donor_cfu ?? answer.back_donor?.[0]),
              },
              ihk: {
                activity: DrcProgram.HygieneKit,
                project: DrcProjectHelper.search(answer.donor_ihk ?? answer.back_donor?.[0]),
              },
            },
            () => undefined,
          )
        })
        .compact()
        .distinct((_) => _.activity) ?? []

    const prepare = (activity: DrcProgram, project?: DrcProject): MetaMapped | undefined => {
      if (!project) {
        console.error(`[${row.id}] No project for ${JSON.stringify(answer.back_donor)}`)
        return
      }
      if (!DrcProjectHelper.donorByProject[project]) {
        console.error(`[${row.id}] No donor for ${project}`)
        return
      }
      const status = DrcSectorHelper.isAutoValidatedActivity(activity) ? CashStatus.Paid : row.tags?.status
      return {
        enumerator: Bn_re.options.back_enum[answer.back_enum!],
        office: KoboXmlMapper.office(answer.back_office),
        oblast: oblast.name,
        raion: Bn_re.options.ben_det_raion[answer.ben_det_raion!],
        hromada: Bn_re.options.ben_det_hromada[answer.ben_det_hromada!],
        settlement: answer.ben_det_settlement,
        sector: DrcSectorHelper.findFirstByProgram(activity),
        activity,
        personsCount: persons.length,
        persons,
        project: project ? [project] : [],
        donor: map(DrcProjectHelper.donorByProject[project!], (_) => [_]) ?? [],
        lastName: answer.ben_det_surname,
        firstName: answer.ben_det_first_name,
        patronymicName: answer.ben_det_pat_name,
        taxId: answer.pay_det_tax_id_num,
        phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : undefined,
        status: KoboMetaHelper.mapCashStatus(status),
        lastStatusUpdate:
          row.tags?.lastStatusUpdate ??
          (status === CashStatus.Paid || nfisPrograms.includes(activity) ? row.date : undefined),
        passportNum: map((answer.pay_det_pass_ser ?? '') + (answer.pay_det_pass_num ?? ''), (_) =>
          _ === '' ? undefined : _,
        ),
        taxIdFileName: answer.pay_det_tax_id_ph,
        taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
        idFileName: answer.pay_det_id_ph,
        idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
        tags: fnSwitch(
          activity,
          {
            ESK: () => {
              if (!answer.estimate_sqm_damage) return
              const x: KoboMetaTagNfi = {
                ESK: answer.estimate_sqm_damage >= 15 ? 2 : 1,
              }
              return x
            },
            NFI: () => {
              const x: KoboMetaTagNfi = {
                HKMV: answer.nfi_dist_hkmv,
                HKF: answer.nfi_dist_hkf,
                NFKF_KS: answer.nfi_dist_hkf_001,
                FoldingBed: answer.nfi_bed,
                FKS: 0,
                CollectiveCenterKits: answer.nfi_kit_cc,
                BK: safeNumber(answer.nfi_dist_bk),
                WKB: add(answer.nfi_dist_wkb1, answer.nfi_dist_wkb2, answer.nfi_dist_wkb3, answer.nfi_dist_wkb4),
              }
              return x
            },
          },
          () => undefined,
        ),
      }
    }
    return activities
      .map((_) => prepare(_.activity, _.project ?? DrcProjectHelper.search(answer.back_donor?.[0])))
      .compact()
  }

  static readonly bn_rrm: MetaMapperInsert<KoboMetaOrigin<Bn_rapidResponse.T, KoboTagStatus>> = (row) => {
    const answer = Bn_rapidResponse.map(row.answers)
    const persons = KoboXmlMapper.Persons.bn_rapidResponse(answer)
    if (answer.form_length === 'short') return
    const getBnreProject = (
      back_donor?:
        | Bn_re.Option<'nfi_dist_hkf_001_donor'>
        | Bn_rapidResponse.Option<'back_donor'>
        | Bn_rapidResponse.Option<'donor_nfi_fks'>[0],
    ) => {
      return fnSwitch(
        back_donor!,
        {
          uhf_chj: DrcProject['UKR-000314 UHF4'],
          uhf_dnk: DrcProject['UKR-000314 UHF4'],
          uhf_hrk: DrcProject['UKR-000314 UHF4'],
          uhf_lwo: DrcProject['UKR-000314 UHF4'],
          uhf_nlv: DrcProject['UKR-000314 UHF4'],
          bha_lwo: DrcProject['UKR-000284 BHA'],
          bha_chj: DrcProject['UKR-000284 BHA'],
          bha_dnk: DrcProject['UKR-000284 BHA'],
          bha_hrk: DrcProject['UKR-000284 BHA'],
          bha_nlv: DrcProject['UKR-000284 BHA'],
          lwo_360_novonordisk: DrcProject['UKR-000360 Novo-Nordisk'],
          hrk_360_novonordisk: DrcProject['UKR-000360 Novo-Nordisk'],
          danida347_lwo: DrcProject['UKR-000347 DANIDA'],
          danida347_hrk: DrcProject['UKR-000347 DANIDA'],
          danida347_chj: DrcProject['UKR-000347 DANIDA'],
          danida347_dnk: DrcProject['UKR-000347 DANIDA'],
          echo322_umy: DrcProject['UKR-000322 ECHO2'],
          echo322_chj: DrcProject['UKR-000322 ECHO2'],
          echo322_dnk: DrcProject['UKR-000322 ECHO2'],
          echo322_lwo: DrcProject['UKR-000322 ECHO2'],
          echo322_hrk: DrcProject['UKR-000322 ECHO2'],
          echo322_nlv: DrcProject['UKR-000322 ECHO2'],
          echo_chj: DrcProject['UKR-000269 ECHO1'],
          echo_dnk: DrcProject['UKR-000269 ECHO1'],
          echo_hrk: DrcProject['UKR-000269 ECHO1'],
          echo_lwo: DrcProject['UKR-000269 ECHO1'],
          echo_nlv: DrcProject['UKR-000269 ECHO1'],
          novo_nlv: DrcProject['UKR-000298 Novo-Nordisk'],
          okf_lwo: DrcProject['UKR-000309 OKF'],
          '341_hoffman_husmans_hrk': DrcProject['UKR-000341 Hoffmans & Husmans'],
          '340_02_augustinus_fonden_lwo': DrcProject['UKR-000340 Augustinus Fonden'],
          '340_augustinus_fonden_dnk': DrcProject['UKR-000340 Augustinus Fonden'],
          pool_chj: DrcProject['UKR-000270 Pooled Funds'],
          pool_dnk: DrcProject['UKR-000270 Pooled Funds'],
          pool_hrk: DrcProject['UKR-000270 Pooled Funds'],
          pool_lwo: DrcProject['UKR-000270 Pooled Funds'],
          pool_nlv: DrcProject['UKR-000270 Pooled Funds'],
          pool_umy: DrcProject['UKR-000270 Pooled Funds'],
          sdc_umy: DrcProject['UKR-000330 SDC2'],
          hrk_umy: DrcProject['UKR-000330 SDC2'],
          uhf6_chj: DrcProject['UKR-000336 UHF6'],
          uhf6_dnk: DrcProject['UKR-000336 UHF6'],
          uhf6_hrk: DrcProject['UKR-000336 UHF6'],
          uhf6_lwo: DrcProject['UKR-000336 UHF6'],
          uhf6_nlv: DrcProject['UKR-000336 UHF6'],
          uhf6_umy: DrcProject['UKR-000336 UHF6'],
          uhf7_chj: DrcProject['UKR-000352 UHF7'],
          uhf7_dnk: DrcProject['UKR-000352 UHF7'],
          uhf7_hrk: DrcProject['UKR-000352 UHF7'],
          uhf7_lwo: DrcProject['UKR-000352 UHF7'],
          uhf7_nlv: DrcProject['UKR-000352 UHF7'],
          uhf7_umy: DrcProject['UKR-000352 UHF7'],
          umy_danida: DrcProject['UKR-000267 DANIDA'],
          '330_sdc_dnk': DrcProject['UKR-000330 SDC2'],
          dnk_danida_347: DrcProject['UKR-000347 DANIDA'],
          echo2_dnk: DrcProject['UKR-000322 ECHO2'],
        },
        (_) => DrcProjectHelper.searchByCode(DrcProjectHelper.searchCode(_)),
      )
    }
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast_l!)
    const activities =
      seq(answer.back_prog_type_l)
        ?.map((prog) => {
          const defaultProject = answer.back_donor_l?.[0] ?? answer.back_donor
          return fnSwitch(
            prog.split('_')[0],
            {
              cfr: {activity: DrcProgram.CashForRent, project: getBnreProject(answer.donor_cfr ?? defaultProject)},
              cfe: {activity: DrcProgram.CashForEducation, project: getBnreProject(answer.donor_cfe ?? defaultProject)},
              mpca: {activity: DrcProgram.MPCA, project: getBnreProject(answer.donor_mpca ?? defaultProject)},
              csf: {activity: DrcProgram.CashForFuel, project: getBnreProject(answer.donor_cff ?? defaultProject)},
              cfu: {activity: DrcProgram.CashForUtilities, project: getBnreProject(answer.donor_cfu ?? defaultProject)},
              nfi: {activity: DrcProgram.NFI, project: getBnreProject(answer.donor_nfi ?? defaultProject)},
              esk: {activity: DrcProgram.ESK, project: getBnreProject(answer.donor_esk ?? defaultProject)},
              iwk: {activity: DrcProgram.ESK, project: getBnreProject(defaultProject)},
              ihk: {activity: DrcProgram.HygieneKit, project: getBnreProject(answer.donor_ihk ?? defaultProject)},
            },
            () => undefined,
          )
        })
        .compact()
        .distinct((_) => _.activity) ?? []

    const prepare = (activity: DrcProgram, project?: DrcProject): MetaMapped => {
      const status = DrcSectorHelper.isAutoValidatedActivity(activity) ? CashStatus.Paid : row.tags?.status
      return {
        enumerator: Bn_rapidResponse.options.back_enum_l[answer.back_enum_l!],
        office: KoboXmlMapper.office(answer.back_office ?? answer.back_office_l),
        oblast: oblast.name,
        raion: Bn_rapidResponse.options.ben_det_raion_l[answer.ben_det_raion_l!],
        hromada: Bn_rapidResponse.options.ben_det_hromada_l[answer.ben_det_hromada_l!],
        settlement: answer.ben_det_settlement_l,
        sector: DrcSectorHelper.findFirstByProgram(activity),
        activity: activity,
        personsCount: persons.length,
        persons,
        project: project ? [project] : [],
        donor: map(DrcProjectHelper.donorByProject[project!], (_) => [_]) ?? [],
        lastName: answer.ben_det_surname_l,
        firstName: answer.ben_det_first_name_l,
        patronymicName: answer.ben_det_pat_name_l,
        phone: answer.ben_det_ph_number_l ? '' + answer.ben_det_ph_number_l : undefined,
        status: KoboMetaHelper.mapCashStatus(status),
        passportNum: map(
          (answer.pay_det_pass_ser ?? answer.pay_det_pass_ser_l ?? '') +
            (answer.pay_det_pass_num ?? answer.pay_det_pass_num_l ?? ''),
          (_) => (_ === '' ? undefined : _),
        ),
        taxId: answer.pay_det_tax_id_num ?? answer.pay_det_tax_id_num_l,
        taxIdFileName: answer.pay_det_tax_id_ph ?? answer.pay_det_tax_id_ph_l,
        taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph ?? answer.pay_det_tax_id_ph_l),
        idFileName: answer.pay_det_id_ph ?? answer.pay_det_id_ph_l,
        idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph ?? answer.pay_det_id_ph_l),
        lastStatusUpdate: row.tags?.lastStatusUpdate ?? (status === CashStatus.Paid ? row.date : undefined),
        tags: fnSwitch(
          activity,
          {
            ESK: () => {
              if (!answer.estimate_sqm_damage_l) return
              const x: KoboMetaTagNfi = {
                ESK: answer.estimate_sqm_damage_l >= 15 ? 2 : 1,
              }
              return x
            },
            NFI: () => {
              const x: KoboMetaTagNfi = {
                FKS: answer.nfi_fks,
                HKF: answer.nfi_dist_hkf_l,
                NFKF_KS: answer.nfi_dist_hkf_001_l,
                FoldingBed: answer.nfi_bed,
                CollectiveCenterKits: answer.nfi_kit_cc,
                HKMV: answer.nfi_dist_hkmv_l,
              }
              return x
            },
          },
          () => undefined,
        ),
      }
    }
    return activities.map((_) => prepare(_.activity, _.project))
  }

  static readonly bn_rrm2: MetaMapperInsert<KoboMetaOrigin<Bn_rapidResponse2.T, KoboTagStatus>> = (row) => {
    const answer = Bn_rapidResponse2.map(row.answers)
    const persons = KoboXmlMapper.Persons.bn_rapidResponse2(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const office = KoboXmlMapper.office(answer.back_office)
    const oblastName = oblast.name
    const activities = (answer.back_prog_type ?? []).map((prog) => {
      return fnSwitch(prog, {
        mpca: {program: DrcProgram.MPCA, project: DrcProjectHelper.search(answer.mpca_donor)},
        nfi: {program: DrcProgram.NFI, project: DrcProjectHelper.search(answer.nfi_donor)},
        esk: {program: DrcProgram.ESK, project: DrcProjectHelper.search(answer.esk_donor)},
      })
    })
    return activities.map((activity) => {
      const status = DrcSectorHelper.isAutoValidatedActivity(activity.program) ? CashStatus.Paid : row.tags?.status
      return KoboMetaMapper.make({
        enumerator: Bn_rapidResponse2.options.back_enum[answer.back_enum!],
        office,
        oblast: oblastName,
        raion: Bn_re.options.ben_det_raion[answer.ben_det_raion as NonNullable<Bn_re.T['ben_det_raion']>],
        hromada: Bn_re.options.ben_det_hromada[answer.ben_det_hromada as NonNullable<Bn_re.T['ben_det_hromada']>],
        settlement: answer.ben_det_settlement,
        personsCount: persons.length,
        persons,
        sector: DrcSectorHelper.findFirstByProgram(activity.program)!,
        activity: activity.program,
        project: activity.project ? [activity.project] : [],
        donor: activity.project ? [DrcProjectHelper.donorByProject[activity.project!]] : [],
        firstName: answer.ben_det_first_name,
        lastName: answer.ben_det_surname,
        patronymicName: answer.ben_det_pat_name,
        taxId: answer.pay_det_tax_id_num,
        phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : undefined,
        status: KoboMetaHelper.mapCashStatus(status),
        lastStatusUpdate:
          row.tags?.lastStatusUpdate ??
          (status === CashStatus.Paid || nfisPrograms.includes(activity.program) ? row.date : undefined),
        passportNum: map((answer.pay_det_pass_ser ?? '') + (answer.pay_det_pass_num ?? ''), (_) =>
          _ === '' ? undefined : _,
        ),
        taxIdFileName: answer.pay_det_tax_id_ph,
        taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
        idFileName: answer.pay_det_id_ph,
        idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
        tags: fnSwitch(
          activity.program,
          {
            ESK: () => {
              if (!answer.esk_estimate_sqm_damage) return
              const x: KoboMetaTagNfi = {
                ESK: answer.esk_estimate_sqm_damage >= 15 ? 2 : 1,
              }
              return x
            },
            NFI: () => {
              const x: KoboMetaTagNfi = {
                FKS: answer.nfi_fks,
                HKF: answer.nfi_dist_hkf,
                NFKF_KS: answer.nfi_dist_nfkf_ks,
                FoldingBed: answer.nfi_bed,
                CollectiveCenterKits: answer.nfi_kit_cc,
              }
              return x
            },
          },
          () => undefined,
        ),
      }) as any
    })
  }
}
