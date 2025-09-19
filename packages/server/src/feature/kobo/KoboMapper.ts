import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {fnSwitch} from '@axanc/ts-utils'
import {KoboCustomDirective} from 'infoportal-common'

export class KoboMapper {
  static readonly timestampToDate: {
    (_: number): Date
    (_: undefined): undefined
    (_?: number | undefined): Date | undefined
  } = koboTs => (koboTs ? new Date(koboTs * 1000) : undefined) as any

  static readonly findAttachmentId = (
    attachments?: Kobo.Submission.Attachment[],
    fileName?: string,
  ): number | undefined => {
    return fileName ? attachments?.find(x => x.filename.includes(fileName))?.id : undefined
  }

  static readonly mapValidation = {
    fromKobo: (_: Kobo.Submission.Raw): undefined | Ip.Submission.Validation => {
      if (_._validation_status?.uid)
        return fnSwitch(_._validation_status.uid, {
          validation_status_on_hold: Ip.Submission.Validation.Pending,
          validation_status_approved: Ip.Submission.Validation.Approved,
          validation_status_not_approved: Ip.Submission.Validation.Rejected,
          no_status: undefined,
        })
      if (_[KoboCustomDirective.Name._IP_VALIDATION_STATUS_EXTRA]) {
        return Ip.Submission.Validation[_._IP_VALIDATION_STATUS_EXTRA as keyof typeof Ip.Submission.Validation]
      }
    },
    toKobo: (
      _?: Ip.Submission.Validation,
    ): {
      _IP_VALIDATION_STATUS_EXTRA?: Ip.Submission.Validation
      _validation_status?: Kobo.Submission.Validation
    } => {
      if (_ === Ip.Submission.Validation.Flagged || _ === Ip.Submission.Validation.UnderReview) {
        return {[KoboCustomDirective.Name._IP_VALIDATION_STATUS_EXTRA]: _}
      }
      return {
        _validation_status: fnSwitch(
          _!,
          {
            [Ip.Submission.Validation.Pending]: Kobo.Submission.Validation.validation_status_on_hold,
            [Ip.Submission.Validation.Approved]: Kobo.Submission.Validation.validation_status_approved,
            [Ip.Submission.Validation.Rejected]: Kobo.Submission.Validation.validation_status_not_approved,
          },
          () => Kobo.Submission.Validation.no_status,
        ),
      }
    },
  }
}
