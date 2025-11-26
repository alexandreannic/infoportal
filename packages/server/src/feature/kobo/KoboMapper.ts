import {Kobo} from 'kobo-sdk'
import {Api} from '@infoportal/api-sdk'
import {fnSwitch} from '@axanc/ts-utils'

export class KoboMapper {
  static readonly _IP_VALIDATION_STATUS_EXTRA = '_IP_VALIDATION_STATUS_EXTRA'

  static readonly timestampToDate: {
    (_: number): Date
    (_: undefined): undefined
    (_?: number | undefined): Date | undefined
  } = koboTs => (koboTs ? new Date(koboTs * 1000) : undefined) as any

  static readonly findAttachmentId = (
    attachments?: Kobo.Submission.Attachment[],
    fileName?: string,
  ): string | undefined => {
    return fileName ? attachments?.find(x => x.filename.includes(fileName))?.uid : undefined
  }

  static readonly mapValidation = {
    fromKobo: (_: Kobo.Submission.Raw): undefined | Api.Submission.Validation => {
      if (_._validation_status?.uid)
        return fnSwitch(_._validation_status.uid, {
          validation_status_on_hold: Api.Submission.Validation.Pending,
          validation_status_approved: Api.Submission.Validation.Approved,
          validation_status_not_approved: Api.Submission.Validation.Rejected,
          no_status: undefined,
        })
      if (_[this._IP_VALIDATION_STATUS_EXTRA]) {
        return Api.Submission.Validation[_._IP_VALIDATION_STATUS_EXTRA as keyof typeof Api.Submission.Validation]
      }
    },
    toKobo: (
      _?: Api.Submission.Validation,
    ): {
      _IP_VALIDATION_STATUS_EXTRA?: Api.Submission.Validation
      _validation_status?: Kobo.Submission.Validation
    } => {
      if (_ === Api.Submission.Validation.Flagged || _ === Api.Submission.Validation.UnderReview) {
        return {[this._IP_VALIDATION_STATUS_EXTRA]: _}
      }
      return {
        _validation_status: fnSwitch(
          _!,
          {
            [Api.Submission.Validation.Pending]: Kobo.Submission.Validation.validation_status_on_hold,
            [Api.Submission.Validation.Approved]: Kobo.Submission.Validation.validation_status_approved,
            [Api.Submission.Validation.Rejected]: Kobo.Submission.Validation.validation_status_not_approved,
          },
          () => Kobo.Submission.Validation.no_status,
        ),
      }
    },
  }
}
