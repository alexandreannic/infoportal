import {fnSwitch, map, Obj} from '@axanc/ts-utils'
import {
  DrcDonor,
  DrcOffice,
  DrcProgram,
  DrcProject,
  DrcProjectHelper,
  DrcSector,
  Ecrec_cashRegistration,
  Ecrec_cashRegistrationBha,
  Ecrec_msmeGrantEoi,
  Ecrec_msmeGrantReg,
  Ecrec_msmeGrantSelection,
  Ecrec_vet_bha388,
  Ecrec_vetApplication,
  Ecrec_vetEvaluation,
  KoboBaseTags,
  KoboEcrec_cashRegistration,
  KoboHelper,
  KoboMetaEcrecTags,
  KoboMetaHelper,
  KoboMetaStatus,
  KoboTagStatus,
  KoboValidation,
  KoboXmlMapper,
  oblastByDrcOffice,
  VetApplicationStatus,
} from 'infoportal-common'
import {KoboMetaOrigin} from './KoboMetaType.js'
import {KoboMetaMapper, MetaMapperInsert, MetaMapperMerge} from './KoboMetaService.js'
import {appConf} from '../../../core/conf/AppConf.js'
import {Ecrec_vet2_dmfa} from 'infoportal-common'

export class KoboMetaMapperEcrec {
  static readonly cashRegistration: MetaMapperInsert<
    KoboMetaOrigin<Ecrec_cashRegistration.T, KoboBaseTags & KoboTagStatus>
  > = (row) => {
    const answer = Ecrec_cashRegistration.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_cashRegistration(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const project = DrcProjectHelper.search(Ecrec_cashRegistration.options.back_donor[answer.back_donor!])
    const activities = KoboEcrec_cashRegistration.getProgram(answer)

    return activities.map((activity) => {
      return KoboMetaMapper.make({
        enumerator: Ecrec_cashRegistration.options.back_enum[answer.back_enum!],
        office: KoboXmlMapper.office(answer.back_office),
        oblast: oblast.name,
        raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
        hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
        settlement: answer.ben_det_settlement,
        sector: DrcSector.Livelihoods,
        activity,
        personsCount: persons.length,
        persons: persons,
        project: project ? [project] : [],
        donor: map(project, (_) => [DrcProjectHelper.donorByProject[_]]),
        lastName: answer.ben_det_surname,
        firstName: answer.ben_det_first_name,
        patronymicName: answer.ben_det_pat_name,
        taxId: answer.pay_det_tax_id_num,
        phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : undefined,
        status: KoboMetaHelper.mapCashStatus(row.tags?.status),
        lastStatusUpdate: row.tags?.lastStatusUpdate ? new Date(row.tags?.lastStatusUpdate) : undefined,
        passportNum: answer.pay_det_pass_num,
        taxIdFileName: answer.pay_det_tax_id_ph,
        taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
        idFileName: answer.pay_det_id_ph,
        idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
      })
    })
  }

  static readonly vetApplication: MetaMapperInsert<
    KoboMetaOrigin<Ecrec_vetApplication.T, KoboBaseTags & KoboTagStatus<VetApplicationStatus>>
  > = (row) => {
    if (!appConf.db.url.includes('localhost') && row.tags?._validation !== KoboValidation.Approved) return
    const answer = Ecrec_vetApplication.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_vetApplication(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const status = row.tags
      ? row.tags.status === VetApplicationStatus.CertificateSubmitted ||
        row.tags?.status === VetApplicationStatus.SecondPaid ||
        row.tags?.status === VetApplicationStatus.FirstPaid
        ? KoboMetaStatus.Committed
        : row.tags._validation === KoboValidation.Rejected
          ? KoboMetaStatus.Rejected
          : KoboMetaStatus.Pending
      : undefined

    return KoboMetaMapper.make({
      date: row.submissionTime,
      oblast: oblast.name,
      raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
      personsCount: persons.length,
      persons: persons,
      sector: DrcSector.Livelihoods,
      activity: DrcProgram.VET,
      project: [DrcProject['UKR-000348 BHA3']],
      donor: [DrcDonor.BHA],
      lastName: answer.ben_det_surname,
      firstName: answer.ben_det_first_name,
      patronymicName: answer.ben_det_pat_name,
      phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : undefined,
      status: status,
      lastStatusUpdate: row.tags?.lastStatusUpdate ? new Date(row.tags?.lastStatusUpdate) : undefined,
    })
  }

  static readonly vetEvaluation: MetaMapperMerge<KoboMetaOrigin<Ecrec_vetEvaluation.T, KoboBaseTags>> = (row) => {
    if (!row.answers.id_form_vet) return
    const answer = Ecrec_vetEvaluation.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_vetEvaluation(answer)
    return {
      originMetaKey: 'koboId',
      value: row.answers.id_form_vet,
      changes: {
        office: KoboXmlMapper.office(answer.back_office),
        personsCount: persons.length,
        persons: persons,
        sector: DrcSector.Livelihoods,
        activity: DrcProgram.VET,
        taxId: answer.tax_id ? '' + answer.tax_id : undefined,
        // status: KoboMetaHelper.mapValidationStatus(row.tags?._validation) ?? KoboMetaStatus.Pending,
        // lastStatusUpdate: row.date,
      },
    }
  }

  static readonly msmeSelection: MetaMapperMerge<
    KoboMetaOrigin<Ecrec_msmeGrantSelection.T, KoboBaseTags>,
    KoboMetaEcrecTags
  > = (row) => {
    const answer = Ecrec_msmeGrantSelection.map(row.answers)
    const taxId = answer.tax_id_num ?? answer.ben_enterprise_tax_id
    if (!taxId) return
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    return {
      originMetaKey: 'taxId',
      value: taxId,
      changes: {
        oblast: oblast.name,
        raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
        hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
        office: fnSwitch(
          answer.ben_det_oblast!,
          {
            dnipropetrovska: DrcOffice.Dnipro,
            khersonska: DrcOffice.Kherson,
            mykolaivska: DrcOffice.Mykolaiv,
            zaporizka: DrcOffice.Dnipro,
            lvivska: DrcOffice.Lviv,
          },
          () => undefined,
        ),
        taxId: map(answer.ben_enterprise_tax_id ?? answer.tax_id_num, (_) => '' + _),
        firstName: answer.ben_first_name,
        lastName: answer.ben_last_name,
        patronymicName: answer.ben_first_patr,
        status: KoboMetaHelper.mapValidationStatus(row.tags?._validation),
        lastStatusUpdate: answer.date_payment,
        tags: {
          amount: answer.much_need_grant,
          employeesCount:
            1 +
            fnSwitch(
              answer.there_paid_employees_quantity!,
              {
                '0_5_people': 3,
                '5_10_people': 8,
                '10_15_people': 13,
                '15_20_people': 18,
                '20_more_people': 23,
              },
              () => 0,
            ),
        },
      },
    }
  }

  static readonly msmeEoi: MetaMapperInsert<KoboMetaOrigin<Ecrec_msmeGrantEoi.T, KoboBaseTags>, KoboMetaEcrecTags> = (
    row,
  ) => {
    const answer = Ecrec_msmeGrantEoi.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_msmeGrantEoi(answer)
    if (answer.back_consent !== 'yes' && answer.back_consent_lviv !== 'yes') return
    const office = fnSwitch(
      answer.ben_det_oblast!,
      {
        dnipropetrovska: DrcOffice.Dnipro,
        zaporizka: DrcOffice.Dnipro,
        mykolaivska: DrcOffice.Dnipro,
        khersonska: DrcOffice.Dnipro,
        lvivska: DrcOffice.Dnipro,
      },
      () => undefined,
    )
    if (!office) return
    return KoboMetaMapper.make<KoboMetaEcrecTags>({
      date: row.submissionTime,
      sector: DrcSector.Livelihoods,
      activity: DrcProgram.MSME,
      office,
      donor: [DrcDonor.BHA],
      project: [DrcProject['UKR-000348 BHA3']],
      oblast: oblastByDrcOffice[office],
      raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
      personsCount: persons.length,
      persons,
      phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : '',
      taxId: answer.ben_enterprise_tax_id ?? answer.ben_det_tax_id_num,
      firstName: answer.ben_det_first_name,
      lastName: answer.ben_det_surname,
      patronymicName: answer.ben_det_pat_name,
      status: row.tags?._validation === KoboValidation.Rejected ? KoboMetaStatus.Rejected : KoboMetaStatus.Pending,
      tags: {
        employeesCount: fnSwitch(
          answer.many_people_employ!,
          {
            '0_5_people': 3,
            '5_10_people': 8,
            '10_15_people': 13,
            '15_20_people': 18,
            '20_more_people': 23,
          },
          () => 0,
        ),
      },
    })
  }

  static readonly cashRegistrationBha: MetaMapperInsert<
    KoboMetaOrigin<Ecrec_cashRegistrationBha.T, KoboBaseTags & KoboTagStatus>
  > = (row) => {
    const answer = Ecrec_cashRegistrationBha.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_cashRegistrationBha(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.ben_det_oblast!)
    const project = DrcProjectHelper.search(Ecrec_cashRegistrationBha.options.back_donor[answer.back_donor!])

    return KoboMetaMapper.make({
      enumerator: Ecrec_cashRegistrationBha.options.back_enum[answer.back_enum!],
      office: KoboXmlMapper.office(answer.back_office),
      oblast: oblast.name,
      raion: KoboXmlMapper.Location.searchRaion(answer.ben_det_raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.ben_det_hromada),
      settlement: answer.ben_det_settlement,
      sector: DrcSector.Livelihoods,
      activity: DrcProgram.SectoralCashForAgriculture,
      personsCount: persons.length,
      persons,
      project: project ? [project] : [],
      donor: map(project, (_) => [DrcProjectHelper.donorByProject[_]]),
      lastName: answer.ben_det_surname,
      firstName: answer.ben_det_first_name,
      patronymicName: answer.ben_det_pat_name,
      taxId: answer.pay_det_tax_id_num,
      phone: answer.ben_det_ph_number ? '' + answer.ben_det_ph_number : undefined,
      status: KoboMetaHelper.mapCashStatus(row.tags?.status),
      lastStatusUpdate: row.tags?.lastStatusUpdate ? new Date(row.tags?.lastStatusUpdate) : undefined,
      passportNum: answer.pay_det_pass_num,
      taxIdFileName: answer.pay_det_tax_id_ph,
      taxIdFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_tax_id_ph),
      idFileName: answer.pay_det_id_ph,
      idFileId: KoboHelper.findAttachmentId(row.attachments, answer.pay_det_id_ph),
    })
  }

  static readonly ecrec_vet_bha388: MetaMapperInsert<KoboMetaOrigin<Ecrec_vet_bha388.T, KoboBaseTags>> = (row) => {
    const answer = Ecrec_vet_bha388.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_vet_bha388(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.oblast!)
    const project =
      row.answers.alter_donor === 'ukr000386_pooled_funds'
        ? DrcProject['UKR-000386 Pooled Funds']
        : DrcProject['UKR-000388 BHA']

    return KoboMetaMapper.make({
      enumerator: Ecrec_vet_bha388.options.back_enum_extra[answer.back_enum!],
      office: KoboXmlMapper.office(answer.office),
      oblast: oblast?.name!,
      raion: KoboXmlMapper.Location.searchRaion(answer.raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.hromada),
      settlement: answer.settlement,
      sector: DrcSector.Livelihoods,
      activity: DrcProgram.VET,
      personsCount: persons.length,
      persons,
      project: project ? [project] : [],
      donor: map(project, (_) => [DrcProjectHelper.donorByProject[_]]),
      lastName: answer.surname,
      firstName: answer.first_name,
      patronymicName: answer.pat_name,
      taxId: answer.tax_id_num,
      phone: answer.ph_number ? '' + answer.ph_number : '',
      status: KoboMetaHelper.mapValidationStatus(row.validationStatus),
      lastStatusUpdate: KoboHelper.timestampToDate(row.lastValidatedTimestamp),
    })
  }

  static readonly ecrec_vet2_dmfa: MetaMapperInsert<KoboMetaOrigin<Ecrec_vet2_dmfa.T, KoboBaseTags>> = (row) => {
    const answer = Ecrec_vet2_dmfa.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_vet2_dmfa(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.oblast!)
    const project = DrcProject['UKR-000355 Danish MFA']

    return KoboMetaMapper.make({
      // enumerator: Ecrec_vet2_dmfa.options.[answer.back_enum!],
      office: DrcOffice.Mykolaiv,
      oblast: oblast?.name,
      raion: KoboXmlMapper.Location.searchRaion(answer.raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.hromada),
      settlement: answer.settlement,
      sector: DrcSector.Livelihoods,
      activity: DrcProgram.VET,
      personsCount: persons.length,
      persons,
      project: project ? [project] : [],
      donor: map(project, (_) => [DrcProjectHelper.donorByProject[_]]),
      lastName: answer.surname,
      firstName: answer.first_name,
      patronymicName: answer.pat_name,
      taxId: answer.tax_id_num,
      phone: answer.ph_number ? '' + answer.ph_number : '',
      status: KoboMetaHelper.mapValidationStatus(row.validationStatus),
      lastStatusUpdate: KoboHelper.timestampToDate(row.lastValidatedTimestamp),
    })
  }

  static readonly ecrec_msmeGrantReg: MetaMapperInsert<KoboMetaOrigin<Ecrec_msmeGrantReg.T, KoboBaseTags>> = (row) => {
    const answer = Ecrec_msmeGrantReg.map(row.answers)
    const persons = KoboXmlMapper.Persons.ecrec_msmeGrantReg(answer)
    const oblast = KoboXmlMapper.Location.mapOblast(answer.oblast!)
    const project = DrcProject['UKR-000388 BHA']
    return KoboMetaMapper.make({
      // enumerator: Ecrec_msmeGrantReg.options.[answer.back_enum!],
      office: DrcOffice.Mykolaiv,
      oblast: oblast?.name,
      raion: KoboXmlMapper.Location.searchRaion(answer.raion),
      hromada: KoboXmlMapper.Location.searchHromada(answer.hromada),
      settlement: answer.settlement,
      sector: DrcSector.Livelihoods,
      activity: DrcProgram.MSME,
      personsCount: persons.length,
      persons,
      project: project ? [project] : [],
      donor: map(project, (_) => [DrcProjectHelper.donorByProject[_]]),
      lastName: answer.surname,
      firstName: answer.first_name,
      patronymicName: answer.pat_name,
      taxId: answer.tax_id_num,
      phone: answer.ph_number ? '' + answer.ph_number : '',
      status: KoboMetaHelper.mapValidationStatus(row.validationStatus),
      lastStatusUpdate: KoboHelper.timestampToDate(row.lastValidatedTimestamp),
    })
  }
}
