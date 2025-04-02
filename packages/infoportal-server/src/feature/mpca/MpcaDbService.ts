import {PrismaClient} from '@prisma/client'
import {KoboMappedAnswersService} from '../kobo/KoboMappedAnswersService.js'
import {Seq, seq} from '@axanc/ts-utils'
import {
  ApiPaginate,
  ApiPaginateHelper,
  DrcProgram,
  DrcSupportSuggestion,
  IKoboMeta,
  KoboIndex,
  MpcaEntity,
  WfpCategory,
  WfpDeduplication,
  WfpDeduplicationStatus,
} from 'infoportal-common'
import {KoboAnswerFilter} from '../kobo/KoboService.js'
import {WfpDeduplicationService} from '../wfpDeduplication/WfpDeduplicationService.js'
import {appConf} from '../../core/conf/AppConf.js'
import {KoboSyncServer} from '../kobo/sync/KoboSyncServer.js'
import {KoboMetaService} from '../kobo/meta/KoboMetaService.js'
import {addMonths} from 'date-fns'

export class MpcaDbService {
  constructor(
    private prisma: PrismaClient,
    private meta = new KoboMetaService(prisma),
    private kobo: KoboMappedAnswersService = new KoboMappedAnswersService(prisma),
    private wfp: WfpDeduplicationService = new WfpDeduplicationService(prisma),
    private koboSync: KoboSyncServer = new KoboSyncServer(prisma),
    private conf = appConf,
  ) {}

  readonly refreshNonArchivedForms = async () => {
    const forms = [
      KoboIndex.byName('bn_re').id,
      KoboIndex.byName('bn_rapidResponse').id,
      KoboIndex.byName('shelter_cashForRepair').id,
    ]
    await Promise.all(forms.map((formId) => this.koboSync.syncApiAnswersToDbByForm({formId})))
  }

  readonly search = async (filters: KoboAnswerFilter): Promise<ApiPaginate<MpcaEntity>> => {
    const [wfpIndex, meta] = await Promise.all([
      this.wfp.search().then((_) => seq(_.data).groupBy((_) => _.taxId!)),
      this.meta.search({
        activities: [
          DrcProgram.MPCA,
          DrcProgram.SectoralCashForAgriculture,
          DrcProgram.SectoralCashForAnimalShelterRepair,
          DrcProgram.SectoralCashForAnimalFeed,
          DrcProgram.CashForRepair,
          DrcProgram.CashForRent,
          DrcProgram.CashForEducation,
          DrcProgram.CashForFuel,
          DrcProgram.CashForUtilities,
        ],
      }),
    ])
    return ApiPaginateHelper.make()(
      meta.map(this.getDeduplication(wfpIndex)),
      // .map(this.redirectDonor)
      // .map(this.mergeTagDonor)
    )
  }

  private readonly getDeduplication =
    (wfpIndex: Record<string, Seq<WfpDeduplication>>) =>
    (row: IKoboMeta): MpcaEntity => {
      if (row.activity !== DrcProgram.MPCA) return row
      const res: MpcaEntity = {...row}
      res.amountUahSupposed = row.personsCount
        ? row.personsCount * 3 * this.conf.params.assistanceAmountUAH(row.date)
        : undefined
      res.amountUahFinal = res.amountUahSupposed
      if (!row.taxId) return res
      const dedup = wfpIndex[row.taxId]
      if (!dedup || dedup.length === 0) return res
      const defaultResultIfNotFound = {
        suggestion: DrcSupportSuggestion.FullNoDuplication,
        suggestionDurationInMonths: -1,
        amount: res.amountUahSupposed!,
        beneficiaryId: '',
        createdAt: row.date,
        expiry: row.date,
        validFrom: row.date,
        wfpId: -1,
        id: '',
        category: WfpCategory['CASH-MPA'], // TODO Depends!
        status: WfpDeduplicationStatus.NotDeduplicated,
      }
      res.deduplication =
        wfpIndex[row.taxId].find(
          (_) =>
            _.existingStart &&
            _.existingEnd &&
            addMonths(row.date, 3).getTime() > _.existingStart.getTime() &&
            row.date.getTime() < _.existingEnd.getTime(),
        ) ?? defaultResultIfNotFound
      if (res.deduplication) {
        res.amountUahDedup = res.deduplication.amount
        res.amountUahFinal = res.amountUahDedup
      }
      // if (row.hhSize)
      //   row.amountUahAfterDedup = fnSwitch(row.deduplication?.suggestion!, {
      //     [DrcSupportSuggestion.OneMonth]: row.hhSize * 2220,
      //     [DrcSupportSuggestion.TwoMonths]: row.hhSize * 2220 * 2,
      //     [DrcSupportSuggestion.NoAssistanceDrcDuplication]: 0,
      //     [DrcSupportSuggestion.NoAssistanceFullDuplication]: 0,
      //   }, () => row.hhSize! * 3 * 2220)
      return res
    }

  // private readonly searchBn_1_mpcaNfi = (filters: KoboAnswerFilter): Promise<MpcaEntity[]> => {
  //   return this.kobo.searchBn_1_mpcaNfi({
  //     filters: {
  //       ...filters,
  //       filterBy: [{
  //         column: 'Programme',
  //         value: ['cash_for_rent', 'mpca'],
  //         type: 'array',
  //       }]
  //     }
  //   }).then(_ => {
  //     return _.data.map(_ => {
  //       const group = [..._.group_in3fh72 ?? [], {GenderHH: _.gender_respondent, AgeHH: _.agex}]
  //       const oblast = OblastIndex.byKoboName(_.oblast)
  //       return ({
  //         source: 'bn_1_mpcaNfi',
  //         id: _.id,
  //         enumerator: Bn_OldMpcaNfi.options.staff_names[_.staff_names!],
  //         date: _.submissionTime,
  //         prog: fnSwitch(_.Programme!, {
  //           'mpca': [MpcaProgram.MPCA],
  //           'mpca___nfi': [MpcaProgram.MPCA],
  //           'nfi': undefined,
  //           'cash_for_rent': [MpcaProgram.CashForRent],
  //           'mpca___cash_for_rent': [MpcaProgram.MPCA, MpcaProgram.CashForRent],
  //         }, () => undefined),
  //         office: fnSwitch(_.drc_base!, {
  //           chj: DrcOffice.Chernihiv,
  //           hrk: DrcOffice.Kharkiv,
  //           dnk: DrcOffice.Dnipro,
  //           lwo: DrcOffice.Lviv,
  //           cwc: DrcOffice.Chernivtsi,
  //           iev: DrcOffice.Kyiv,
  //           plv: DrcOffice.Poltava,
  //         }, () => undefined),
  //         // office: fnSwitch(oblast!, {
  //         //   Lvivska: DrcOffice.Lviv,
  //         //   Chernivetska: DrcOffice.Lviv,
  //         //   Zaporizka: DrcOffice.Dnipro,
  //         //   Dnipropetrovska: DrcOffice.Dnipro,
  //         //   Chernihivska: DrcOffice.Chernihiv,
  //         //   Kharkivska: DrcOffice.Kharkiv,
  //         // }, () => undefined),
  //         oblast: oblast?.name,
  //         oblastIso: oblast?.iso,
  //         donor: DrcDonor.BHA,
  //         project: DrcProject['UKR-000284 BHA'],
  //         benefStatus: fnSwitch(_.status!, {
  //           status_idp: 'idp',
  //           status_conflict: 'long_res',
  //           status_returnee: 'ret',
  //           status_refugee: 'ref_asy',
  //         }),
  //         persons: group.map(p => ({
  //           age: safeNumber(p.AgeHH),
  //           gender: fnSwitch(p.GenderHH!, {female: Person.Gender.Female, male: Person.Gender.Male, nogender: Person.Gender.Other}, () => void 0)
  //         })),
  //         // elderlyMen: group.filter(p => p.AgeHH && p.AgeHH >= 50 && p.GenderHH === 'male').length,
  //         // elderlyWomen: group.filter(p => p.AgeHH && p.AgeHH >= 50 && p.GenderHH === 'female').length,
  //         // men: group.filter(p => p.AgeHH && p.AgeHH >= 18 && p.AgeHH < 50 && p.GenderHH === 'male').length,
  //         // women: group.filter(p => p.AgeHH && p.AgeHH >= 18 && p.AgeHH < 50 && p.GenderHH === 'female').length,
  //         // boys: group.filter(p => p.AgeHH && p.AgeHH < 18 && p.GenderHH === 'male').length,
  //         // girls: group.filter(p => p.AgeHH && p.AgeHH < 18 && p.GenderHH === 'female').length,
  //         lastName: _.patron,
  //         firstName: _.name_resp,
  //         patronyme: _.last_resp,
  //         hhSize: (() => {
  //           const isWierdCasesWhereGroupIsAboveTotalAndHhhIsRepeated = _.Total_Family && _.group_in3fh72 && _.Total_Family < _.group_in3fh72.length
  //           if (isWierdCasesWhereGroupIsAboveTotalAndHhhIsRepeated) {
  //             return _.group_in3fh72!.length
  //           }
  //           return _.Total_Family
  //         })(),
  //         passportSerie: _.passport_serial,
  //         passportNum: _.passport_number,
  //         taxId: _.ITN,
  //         taxIdFileName: _.photo_reg_passport,
  //         taxIdFileId: _.attachments?.find(x => x.filename.includes(_.Photo_of_IDP_Certificate_001)),
  //         idFileName: _.photo_reg_passport_001,
  //         idFileId: _.attachments?.find(x => x.filename.includes(_.photo_reg_passport_001) || x.filename.includes(_.photo_reg_passport)),
  //         phone: _.phone ? '' + _.phone : undefined,
  //         tags: _.tags as MpcaDataTag,
  //       })
  //     })
  //   })
  // }
  //
  // private readonly searchBn_0_mpcaRegNewShort = (filters: KoboAnswerFilter): Promise<MpcaEntity[]> => {
  //   return this.kobo.searchBn_0_mpcaRegNewShort(filters)
  //     .then(_ => {
  //       return _.data.map(_ => {
  //         const oblast = OblastIndex.byKoboName(_.oblast)
  //         return {
  //           source: 'bn_0_mpcaRegNewShort',
  //           prog: [MpcaProgram.MPCA],
  //           enumerator: Bn_OldMpcaNfi.options.staff_names[_.staff_names!],
  //           oblast: oblast?.name,
  //           oblastIso: oblast?.iso,
  //           office: fnSwitch(_.drc_base!, {
  //             chj: DrcOffice.Chernihiv,
  //           }, () => {
  //             throw new Error(`Unhandled oblast ${_.oblast}`)
  //           }),
  //           id: _.id,
  //           date: _.submissionTime,
  //           ...fnSwitch(_.DRC_project!, {
  //             bha_project: {project: DrcProject['UKR-000284 BHA'], donor: DrcDonor.BHA},
  //           }, () => {
  //             throw new Error(`Unhandled project ${_.DRC_project}`)
  //           }),
  //           lastName: _.last_resp,
  //           firstName: _.name_resp,
  //           patronyme: _.patron,
  //           hhSize: _.household_size,
  //           passportNum: undefined,
  //           taxId: _.your_id,
  //           taxIdFileName: undefined,
  //           taxIdFileId: undefined,
  //           idFileName: undefined,
  //           idFileId: undefined,
  //           phone: '' + _.phone,
  //           tags: _.tags as MpcaDataTag,
  //         }
  //       })
  //     })
  // }
  //
  // private readonly searchBn_0_mpcaReg = (filters: KoboAnswerFilter): Promise<MpcaEntity[]> => {
  //   return this.kobo.searchBn_0_mpcaReg(filters)
  //     .then(_ => {
  //       return _.data.map(_ => {
  //         const oblast = fnSwitch(_.oblast!, {
  //           dnipropetrovska: OblastIndex.byName('Dnipropetrovska'),
  //           lvivska: OblastIndex.byName('Lvivska'),
  //           chernihivska: OblastIndex.byName('Chernihivska'),
  //           chernivetska: OblastIndex.byName('Chernivetska'),
  //           mykolaivska: OblastIndex.byName('Mykolaivska'),
  //           khersonska: OblastIndex.byName('Khersonska'),
  //           donetska: OblastIndex.byName('Donetska'),
  //         }, d => {
  //           return OblastIndex.byKoboName(d)
  //         })
  //         return {
  //           source: 'bn_0_mpcaReg',
  //           prog: [MpcaProgram.MPCA],
  //           enumerator: Bn_OldMpcaNfi.options.staff_names[_.staff_names!],
  //           oblast: oblast?.name,
  //           oblastIso: oblast?.iso,
  //           office: fnSwitch(_.drc_base!, {
  //             dnk: DrcOffice.Dnipro,
  //             lwo: DrcOffice.Lviv,
  //             chj: DrcOffice.Chernihiv,
  //             cwc: DrcOffice.Chernivtsi,
  //           }, () => {
  //             throw new Error(`Unhandled office ${_.drc_base}`)
  //           }),
  //           id: _.id,
  //           date: _.submissionTime,
  //           ...fnSwitch(_.DRC_project!, {
  //             bha_project: {project: DrcProject['UKR-000284 BHA'], donor: DrcDonor.BHA},
  //           }, () => {
  //             throw new Error(`Unhandled project ${_.DRC_project}`)
  //           }),
  //           lastName: _.last_resp,
  //           firstName: _.name_resp,
  //           patronyme: _.patron,
  //           hhSize: _.household_size,
  //           passportSerie: _.passport_serial,
  //           passportNum: _.passport_number,
  //           taxId: _.your_id,
  //           taxIdFileName: _.id,
  //           taxIdFileId: undefined,
  //           idFileName: undefined,
  //           idFileId: undefined,
  //           phone: '' + _.phone,
  //           tags: _.tags as MpcaDataTag,
  //         }
  //       })
  //     })
  // }
  // private readonly searchBn_0_mpcaRegNoSig = (filters: KoboAnswerFilter): Promise<MpcaEntity[]> => {
  //   return this.kobo.searchBn_0_mpcaRegNoSig(filters)
  //     .then(_ => {
  //       return _.data.map(_ => {
  //         const oblast = fnSwitch(_.oblast!, {
  //           dnipropetrovska: OblastIndex.byName('Dnipropetrovska'),
  //           lvivska: OblastIndex.byName('Lvivska'),
  //           chernihivska: OblastIndex.byName('Chernihivska'),
  //           chernivetska: OblastIndex.byName('Chernivetska'),
  //           mykolaivska: OblastIndex.byName('Mykolaivska'),
  //           khersonska: OblastIndex.byName('Khersonska'),
  //           donetska: OblastIndex.byName('Donetska'),
  //         }, d => {
  //           return OblastIndex.byKoboName(d)
  //         })
  //         return {
  //           source: 'bn_0_mpcaRegNoSig',
  //           prog: [MpcaProgram.MPCA],
  //           oblast: oblast.name,
  //           oblastIso: oblast.iso,
  //           office: fnSwitch(_.drc_base!, {
  //             dnk: DrcOffice.Dnipro,
  //             lwo: DrcOffice.Lviv,
  //             chj: DrcOffice.Chernihiv,
  //             cwc: DrcOffice.Chernivtsi,
  //           }, () => {
  //             throw new Error(`Unhandled office ${_.drc_base}`)
  //           }),
  //           id: _.id,
  //           date: _.submissionTime,
  //           ...fnSwitch(_.DRC_project!, {
  //             bha: {project: DrcProject['UKR-000284 BHA'], donor: DrcDonor.BHA},
  //           }, () => {
  //             throw new Error(`Unhandled project ${_.DRC_project}`)
  //           }),
  //           lastName: _.last_resp,
  //           firstName: _.name_resp,
  //           patronyme: _.patron,
  //           hhSize: _.household_size,
  //           taxId: _.adult_1,
  //           phone: '' + _.phone,
  //           tags: _.tags as MpcaDataTag,
  //         }
  //       })
  //     })
  // }
  // private readonly searchBn_0_mpcaRegESign = (filters: KoboAnswerFilter): Promise<MpcaEntity[]> => {
  //   return this.kobo.searchBn_0_mpcaRegESign(filters)
  //     .then(_ => {
  //       return _.data.map(_ => {
  //         const oblast = fnSwitch(_.oblast!, {
  //           dnipropetrovska: OblastIndex.byName('Dnipropetrovska'),
  //           lvivska: OblastIndex.byName('Lvivska'),
  //           chernihivska: OblastIndex.byName('Chernihivska'),
  //           chernivetska: OblastIndex.byName('Chernivetska'),
  //           mykolaivska: OblastIndex.byName('Mykolaivska'),
  //           khersonska: OblastIndex.byName('Khersonska'),
  //           donetska: OblastIndex.byName('Donetska'),
  //           kharkivska: OblastIndex.byName('Kharkivska'),
  //           kyivska: OblastIndex.byName('Kyivska'),
  //           luhanska: OblastIndex.byName('Luhanska'),
  //           zaporizka: OblastIndex.byName('Zaporizka'),
  //           odeska: OblastIndex.byName('Odeska'),
  //         }, d => {
  //           return OblastIndex.byKoboName(_.oblast)
  //         })
  //         return {
  //           source: 'bn_0_mpcaRegESign',
  //           prog: [MpcaProgram.MPCA],
  //           oblast: oblast?.name,
  //           oblastIso: oblast?.iso,
  //           office: fnSwitch(_.drc_base!, {
  //             dnk: DrcOffice.Dnipro,
  //             lwo: DrcOffice.Lviv,
  //             chj: DrcOffice.Chernihiv,
  //             cwc: DrcOffice.Chernivtsi,
  //           }, () => {
  //             throw new Error(`Unhandled office ${_.drc_base}`)
  //           }),
  //           id: _.id,
  //           date: _.submissionTime,
  //           ...fnSwitch(_.DRC_project!, {
  //             bha: {project: DrcProject['UKR-000284 BHA'], donor: DrcDonor.BHA},
  //           }, () => {
  //             throw new Error(`Unhandled project ${_.DRC_project}`)
  //           }),
  //           lastName: _.last_resp,
  //           firstName: _.name_resp,
  //           patronyme: _.patron,
  //           hhSize: _.household_size,
  //           taxId: _.adult_1,
  //           taxIdFileName: _.Photo_of_Individual_Tax_Code,
  //           taxIdFileId: _.attachments?.find(x => x.filename.includes(_.Photo_of_Individual_Tax_Code)),
  //           idFileName: _.Passport_page_1 ?? _.Photo_of_ID_card,
  //           idFileId: _.attachments?.find(x => x.filename.includes(_.Passport_page_1) || x.filename.includes(_.Photo_of_ID_card)),
  //           phone: '' + _.phone,
  //           tags: _.tags as MpcaDataTag,
  //         }
  //       })
  //     })
  // }
}
