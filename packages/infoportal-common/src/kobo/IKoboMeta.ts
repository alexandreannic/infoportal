import {StateStatus, UUID} from '../type/Generic'
import {OblastName} from '../location'
import {DrcDonor, DrcOffice, DrcProgram, DrcProject, DrcSector} from '../type/Drc'
import {CashStatus, DisplacementStatus, KoboValidation, PersonDetails, ShelterTaPriceLevel} from './mapper'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {Kobo} from 'kobo-sdk'

export type IKoboMeta<TTag = any> = {
  id: UUID
  uuid: UUID
  koboId: Kobo.SubmissionId
  formId: Kobo.FormId
  referencedFormId?: Kobo.FormId
  updatedAt?: Date
  date: Date

  oblast: OblastName
  enumerator?: string
  raion?: string
  hromada?: string
  settlement?: string
  firstName?: string
  lastName?: string
  patronymicName?: string
  phone?: string
  displacement?: DisplacementStatus
  sector: DrcSector
  activity?: DrcProgram
  office?: DrcOffice
  project: DrcProject[]
  donor: DrcDonor[]

  persons?: PersonDetails[]
  personsCount?: number

  status?: KoboMetaStatus
  lastStatusUpdate?: Date

  taxId?: string
  taxIdFileName?: string
  taxIdFileUrl?: string
  idFileName?: string
  idFileUrl?: string
  passportNum?: string

  tags?: TTag
}

export enum KoboMetaStatus {
  Committed = 'Committed',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export const koboMetaStatusLabel: Record<KoboMetaStatus, StateStatus> = {
  Committed: 'success',
  Pending: 'warning',
  Rejected: 'error',
}

export type KoboMetaTag = KoboMetaShelterRepairTags & KoboMetaTagNfi & KoboMetaEcrecTags

export type KoboMetaEcrecTags = {
  amount?: number
  employeesCount?: number
}
export type KoboMetaShelterRepairTags = {
  damageLevel?: ShelterTaPriceLevel
}

export type KoboMetaTagNfi = {
  HKF?: number
  NFKF_KS?: number
  FoldingBed?: number
  FKS?: number
  CollectiveCenterKits?: number
  BK?: number
  WKB?: number
  HKMV?: number
  ESK?: number
}

export namespace KoboMetaHelper {

  const cashStatus: Partial<Record<CashStatus, KoboMetaStatus>> = {
    Selected: KoboMetaStatus.Pending,
    Pending: KoboMetaStatus.Pending,
    Paid: KoboMetaStatus.Committed,
    Rejected: KoboMetaStatus.Rejected,
  }

  const validationStatus: Partial<Record<KoboValidation, KoboMetaStatus>> = {
    [KoboValidation.Approved]: KoboMetaStatus.Committed,
    [KoboValidation.Rejected]: KoboMetaStatus.Rejected,
    [KoboValidation.Pending]: KoboMetaStatus.Pending,
    [KoboValidation.UnderReview]: KoboMetaStatus.Pending,
    [KoboValidation.Flagged]: KoboMetaStatus.Pending,
  }

  export const mapCashStatus = (_?: CashStatus): KoboMetaStatus | undefined => {
    return fnSwitch(_!, cashStatus, () => undefined)
  }

  export const mapValidationStatus = (_?: KoboValidation): KoboMetaStatus | undefined => {
    return fnSwitch(_!, validationStatus, () => undefined)
  }
}
