import {fnSwitch} from '@alexandreannic/ts-utils'
import {Meal_cfmInternal} from '../generated/Meal_cfmInternal'
import {KoboBaseTags} from './Kobo'
import {DrcOffice, DrcProject} from '../../type/Drc'

export enum CfmDataSource {
  Internal = 'Internal',
  External = 'External',
}

export enum CfmDataProgram {
  'Basic Needs (MCPA/ NFI)' = 'Basic Needs (MCPA/ NFI)',
  'Shelter' = 'Shelter',
  'Protection' = 'Protection',
  'Legal Aid' = 'Legal Aid',
  'Partnership/ Capacity Building' = 'Partnership/ Capacity Building',
  'Humanitarian Disarmament and Peacebuilding' = 'Humanitarian Disarmament and Peacebuilding',
  'Economic Recovery' = 'Economic Recovery',
  'GBV' = 'GBV',
  'Victim Assistance' = 'Victim Assistance',
  'EORE' = 'EORE',
  'Other' = 'Other',
}

export enum CfmDataPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum KoboMealCfmStatus {
  Open = 'Open',
  Close = 'Close',
  Processing = 'Processing',
  Archived = 'Archived',
}

export enum KoboMealCfmArea {
  GCA = 'GCA',
  NGCA = 'NGCA',
}

export interface KoboMealCfmTag extends KoboBaseTags {
  /* @deprecated FIXME bug cannot update deletedAt deletedBy in the same time */
  deletedAt?: Date
  deletedBy?: string
  gca?: KoboMealCfmArea
  office?: DrcOffice
  program?: CfmDataProgram
  notes?: string
  focalPointEmail?: string
  status?: KoboMealCfmStatus
  feedbackTypeOverride?: Meal_cfmInternal.T['feedback_type']
  project?: DrcProject
}

export class KoboMealCfmHelper {

  static readonly feedbackType2priority = (_?: Meal_cfmInternal.T['feedback_type']) => {
    return fnSwitch(_!, {
      apprec_com: CfmDataPriority.Low,
      request_info: CfmDataPriority.Medium,
      request_assistance: CfmDataPriority.Medium,
      non_s_feedback: CfmDataPriority.Medium,
      sen_feedback: CfmDataPriority.High,
      coc: CfmDataPriority.High,
      violation_other: CfmDataPriority.High,
      sen_safety: CfmDataPriority.High,
    }, () => undefined)
  }

  static readonly map = (_?: any): KoboMealCfmTag => {
    const tag = (_ ?? {}) as KoboMealCfmTag
    if (!tag.status) tag.status = KoboMealCfmStatus.Open
    return tag
  }
}