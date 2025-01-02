import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'

export class MealVerificationHelper {

  static readonly mapEntity = (_: MealVerification): MealVerification => {
    _.createdAt = new Date(_.createdAt)
    return _
  }
}

export enum MealVerificationStatus {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Pending = 'Pending',
}

export enum MealVerificationAnswersStatus {
  Selected = 'Selected'
}

export interface MealVerificationAnsers {
  id: UUID
  koboAnswerId: Kobo.SubmissionId
  status?: MealVerificationAnswersStatus
}


export interface MealVerification {
  id: UUID
  activity: Kobo.FormId
  name: string
  desc?: string
  createdAt: Date
  createdBy: string
  filters: any
  status: MealVerificationStatus
}