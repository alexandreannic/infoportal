import {Kobo} from 'kobo-sdk'
import {fnSwitch} from '@axanc/ts-utils'
import {KoboCustomDirective} from '../KoboCustomDirective.js'

export enum KoboValidation {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected',
  Flagged = 'Flagged',
  UnderReview = 'UnderReview',
}

export type KoboSubmissionMetaData<TTag extends Record<string, any> | undefined = undefined> = {
  start: Date
  /** Refresh whenever submission is updated */
  end: Date
  /** Set by Kobo Server, not editable */
  submissionTime: Kobo.Submission['_submission_time']
  /** Extracted from question `date` when exists. */
  date: Date
  version?: Kobo.Submission['__version__']
  attachments: Kobo.Submission.Attachment[]
  geolocation: Kobo.Submission['_geolocation']
  id: Kobo.SubmissionId
  uuid: Kobo.Submission['_uuid']
  validationStatus?: KoboValidation
  validatedBy?: string
  submittedBy?: string
  lastValidatedTimestamp?: number
  source?: string
  updatedAt?: Date
  tags?: TTag
}

export type KoboSubmission<
  T extends Record<string, any> = Record<string, any>,
  TTag extends Record<string, any> | undefined = undefined,
> = KoboSubmissionMetaData<TTag> & {
  answers: T
}

export type KoboSubmissionFlat<
  T extends Record<string, any> = Record<string, string | undefined>,
  TTag extends Record<string, any> | undefined = KoboBaseTags,
> = KoboSubmissionMetaData<TTag> & T

export interface KoboBaseTags {
  _validation?: KoboValidation
}

export interface KoboTagStatus<T = CashStatus> {
  status?: T
  lastStatusUpdate?: Date
}

export enum CashStatus {
  Selected = 'Selected',
  Pending = 'Pending',
  Paid = 'Paid',
  Rejected = 'Rejected',
  Referred = 'Referred',
  PaymentRejected = 'PaymentRejected',
}

export enum CashForRentStatus {
  FirstPending = 'FirstPending',
  FirstPaid = 'FirstPaid',
  FirstRejected = 'FirstRejected',
  SecondPending = 'SecondPending',
  SecondPaid = 'SecondPaid',
  SecondRejected = 'SecondRejected',
  Selected = 'Selected',
  Referred = 'Referred',
}

export enum VetApplicationStatus {
  Approved = 'Approved',
  FirstPending = 'FirstPending',
  FirstPaid = 'FirstPaid',
  SecondPending = 'SecondPending',
  SecondPaid = 'SecondPaid',
  CertificateSubmitted = 'CertificateSubmitted',
}

export class KoboHelper {
  static readonly timestampToDate: {
    (_: number): Date
    (_: undefined): undefined
    (_?: number | undefined): Date | undefined
  } = (koboTs) => (koboTs ? new Date(koboTs * 1000) : undefined) as any

  static readonly findAttachmentId = (
    attachments?: Kobo.Submission.Attachment[],
    fileName?: string,
  ): number | undefined => {
    return fileName ? attachments?.find((x) => x.filename.includes(fileName))?.id : undefined
  }

  static readonly mapValidation = {
    fromKobo: (_: Kobo.Submission.Raw): undefined | KoboValidation => {
      if (_._validation_status?.uid)
        return fnSwitch(_._validation_status.uid, {
          validation_status_on_hold: KoboValidation.Pending,
          validation_status_approved: KoboValidation.Approved,
          validation_status_not_approved: KoboValidation.Rejected,
          no_status: undefined,
        })
      if (_[KoboCustomDirective.Name._IP_VALIDATION_STATUS_EXTRA]) {
        return KoboValidation[_._IP_VALIDATION_STATUS_EXTRA as keyof typeof KoboValidation]
      }
    },
    toKobo: (
      _?: KoboValidation,
    ): {
      _IP_VALIDATION_STATUS_EXTRA?: KoboValidation
      _validation_status?: Kobo.Submission.Validation
    } => {
      if (_ === KoboValidation.Flagged || _ === KoboValidation.UnderReview) {
        return {[KoboCustomDirective.Name._IP_VALIDATION_STATUS_EXTRA]: _}
      }
      return {
        _validation_status: fnSwitch(
          _!,
          {
            [KoboValidation.Pending]: Kobo.Submission.Validation.validation_status_on_hold,
            [KoboValidation.Approved]: Kobo.Submission.Validation.validation_status_approved,
            [KoboValidation.Rejected]: Kobo.Submission.Validation.validation_status_not_approved,
          },
          () => Kobo.Submission.Validation.no_status,
        ),
      }
    },
  }
}
