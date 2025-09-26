import {Kobo} from 'kobo-sdk'

export namespace KoboMetaHelper {
  export const metaKeys = [
    'start',
    'end',
    'submissionTime',
    'version',
    'attachments',
    'geolocation',
    'isoCode',
    'id',
    'uuid',
    'validationStatus',
    // 'validatedBy',
    'submittedBy',
    // 'lastValidatedTimestamp',
    // 'updatedAt',
  ] as const

  export type Key = (typeof metaKeys)[number]

  export const isMeta = (_: string) => metaKeys.includes(_ as any)

  export const metaType: Record<Key, Kobo.Form.QuestionType> = {
    attachments: 'file',
    uuid: 'text',
    version: 'text',
    start: 'datetime',
    end: 'datetime',
    submissionTime: 'datetime',
    geolocation: 'geopoint',
    isoCode: 'text',
    id: 'text',
    validationStatus: 'select_one',
    submittedBy: 'text',
  }

  export type Labels = {
    start: string
    end: string
    submissionTime: string
    version: string
    attachments: string
    geolocation: string
    isoCode: string
    id: string
    uuid: string
    validationStatus: string
    validatedBy: string
    submittedBy: string
    lastValidatedTimestamp: string
    updatedAt: string
    choices: {
      validationStatus: {
        Approved: string
        Pending: string
        Rejected: string
        Flagged: string
        UnderReview: string
      }
    }
  }

  export const getMetaAsQuestion = (labels: Labels): Kobo.Form.Question[] => {
    return KoboMetaHelper.metaKeys.map(_ => {
      const type = KoboMetaHelper.metaType[_]
      const q: Kobo.Form.Question = {
        type,
        name: _,
        label: [labels[_] ?? _],
        select_from_list_name: type === 'select_one' || type === 'select_multiple' ? _ : undefined,
        $xpath: _,
        $qpath: _,
        $kuid: _,
        $autoname: _,
        // TODO Fix kobo-sdk where calculation is required
        calculation: undefined as any,
      }
      return q
    })
  }
}
