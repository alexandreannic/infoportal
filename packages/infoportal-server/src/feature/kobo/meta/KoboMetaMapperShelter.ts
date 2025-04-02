import {fnSwitch, map} from '@axanc/ts-utils'
import {
  Bn_cashForRentRegistration,
  CashForRentStatus,
  DrcDonor,
  DrcOffice,
  DrcProgram,
  DrcProject,
  DrcProjectHelper,
  DrcSector,
  DrcSectorHelper,
  KoboHelper,
  KoboIndex,
  KoboMetaHelper,
  KoboMetaShelterRepairTags,
  KoboMetaStatus,
  KoboTagStatus,
  safeArray,
  Shelter_cashForShelter,
  Shelter_nta,
  Shelter_ta,
  ShelterNtaTags,
  ShelterTaTags,
} from 'infoportal-common'
import {KoboMetaOrigin} from './KoboMetaType.js'
import {KoboMetaMapper, MetaMapperInsert, MetaMapperMerge} from './KoboMetaService.js'
import {KoboXmlMapper} from 'infoportal-common'

export namespace KoboMetaMapperShelter {
  export const createCfRent: MetaMapperInsert<
    KoboMetaOrigin<Bn_cashForRentRegistration.T, KoboTagStatus<CashForRentStatus>>
  > = (row) => {
    const answer = Bn_cashForRentRegistration.map(row.answers)
    const persons = KoboXmlMapper.Persons.bn_cashForRentApplication(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const status = fnSwitch(
      row.tags?.status!,
      {
        FirstPending: KoboMetaStatus.Pending,
        FirstPaid: KoboMetaStatus.Pending,
        FirstRejected: KoboMetaStatus.Pending,
        SecondPending: KoboMetaStatus.Pending,
        SecondPaid: KoboMetaStatus.Committed,
        SecondRejected: KoboMetaStatus.Pending,
        Selected: KoboMetaStatus.Rejected,
        Referred: undefined,
      },
      () => undefined,
    )
    return KoboMetaMapper.make({
      enumerator: Bn_cashForRentRegistration.options.back_enum[answer.back_enum!],
      office: KoboXmlMapper.office(answer.back_office),
      oblast: oblast.name,
      displacement: persons[0]?.displacement,
      raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
      sector: DrcSectorHelper.findFirstByProgram(DrcProgram.CashForRent),
      activity: DrcProgram.CashForRent,
      personsCount: persons.length,
      persons: persons,
      lastName: answer.ben_det_surname,
      firstName: answer.ben_det_first_name,
      patronymicName: answer.ben_det_pat_name,
      taxId: answer.pay_det_tax_id_num,
      phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : undefined,
      status,
      donor: [DrcDonor['ECHO']],
      project: [DrcProject['UKR-000322 ECHO2']],
      lastStatusUpdate: row.tags?.lastStatusUpdate,
      passportNum: answer.pay_det_pass_num,
      taxIdFileName: answer.pay_det_tax_id_ph,
      taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
      idFileName: answer.pay_det_id_ph,
      idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
    })
  }

  export const createCfShelter: MetaMapperInsert<KoboMetaOrigin<Shelter_cashForShelter.T, KoboTagStatus>> = (row) => {
    const answer = Shelter_cashForShelter.map(row.answers)
    const persons = KoboXmlMapper.Persons.shelter_cashForShelter(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const project = DrcProjectHelper.search(Shelter_cashForShelter.options.donor[answer.donor!])
    return KoboMetaMapper.make({
      enumerator: Shelter_cashForShelter.options.name_enum[answer.name_enum!],
      office: KoboXmlMapper.office(answer.back_office),
      project: project ? [project] : [],
      donor: map(project, (_) => [DrcProjectHelper.donorByProject[_]]),
      oblast: oblast.name,
      raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
      settlement: answer.ben_det_settlement,
      sector: DrcSectorHelper.findFirstByProgram(DrcProgram.CashForRepair),
      activity: DrcProgram.CashForRepair,
      personsCount: persons.length,
      persons: persons,
      lastName: answer.bis,
      firstName: answer.bif,
      patronymicName: answer.bip,
      taxId: answer.pay_det_tax_id_num,
      phone: answer.bin ? '' + answer.bin : undefined,
      status: KoboMetaHelper.mapCashStatus(row.tags?.status),
      lastStatusUpdate: row.tags?.lastStatusUpdate,
      passportNum: answer.pay_det_pass_num,
      taxIdFileName: answer.pay_det_tax_id_ph,
      taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
      idFileName: answer.pay_det_id_ph,
      idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
    })
  }

  export const createNta: MetaMapperInsert<KoboMetaOrigin<Shelter_nta.T, ShelterNtaTags>> = (row) => {
    const answer = Shelter_nta.map(row.answers)
    const persons = KoboXmlMapper.Persons.shelter_nta(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const project = safeArray(row.tags?.project)
    const isCfRepair = answer.modality === 'cash_for_repair'
    return KoboMetaMapper.make({
      enumerator: Shelter_nta.options.enum_name[answer.enum_name!],
      office: KoboXmlMapper.office(answer.back_office),
      oblast: oblast?.name!,
      displacement: persons[0]?.displacement,
      raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
      settlement: answer.settlement,
      sector: DrcSector.Shelter,
      activity: isCfRepair ? DrcProgram.CashForRepair : DrcProgram.ShelterRepair,
      personsCount: persons.length,
      persons: persons,
      lastName: answer.ben_det_surname_l,
      project: project,
      donor: project.map((_) => DrcProjectHelper.donorByProject[_]),
      firstName: answer.ben_det_first_name_l,
      patronymicName: answer.ben_det_pat_name_l,
      taxId: answer.pay_det_tax_id_num,
      phone: answer.ben_det_ph_number_l ? '' + answer.ben_det_ph_number_l : undefined,
      status: KoboMetaHelper.mapCashStatus(row.tags?.status),
      lastStatusUpdate: row.tags?.lastStatusUpdate,
      passportNum: answer.pay_det_pass_num,
      taxIdFileName: answer.pay_det_tax_id_ph,
      taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
      idFileName: answer.pay_det_id_ph,
      idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
    })
  }

  export const updateTa: MetaMapperMerge<KoboMetaOrigin<Shelter_ta.T, ShelterTaTags>, KoboMetaShelterRepairTags> = (
    row,
  ) => {
    const answers = Shelter_ta.map(row.answers)
    if (!row.tags || !answers.nta_id) return
    return {
      value: answers.nta_id,
      originMetaKey: 'koboId',
      changes: {
        referencedFormId: KoboIndex.byName('shelter_ta').id,
        status: row.tags.workDoneAt ? KoboMetaStatus.Committed : KoboMetaStatus.Pending,
        lastStatusUpdate: row.tags.workDoneAt,
        tags: row.tags?.damageLevel ? {damageLevel: row.tags?.damageLevel} : {},
      },
    }
  }
}
