import {objectToQueryString} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'

const base = (formId = ':formId') => `/form/${formId}`

export const databaseIndex = {
  basePath: '/database',
  siteMap: {
    index: '/',
    home: base,
    custom: (id = ':id') => `/custom/${id}`,
    entry: {
      relative: `:id`,
      absolute: (formId = ':formId') => base(formId) + `/:id`
    },
    database: {
      relative: `database`,
      absolute: (formId = ':formId') => base(formId) + '/database'
    },
    answer: {
      relative: (answerId: Kobo.SubmissionId = ':answerId') => `answer/${answerId}`,
      absolute: (formId = ':formId', answerId: Kobo.SubmissionId = ':answerId') => base(formId) + `/answer/${answerId}`
    },
    access: {
      relative: `access`,
      absolute: (formId = ':formId') => base(formId) + '/access'
    },
    history: {
      relative: `history`,
      absolute: (formId = ':formId') => base(formId) + '/history'
    },
    group: (() => {
      const qs = (id?: string, index?: number) => id ? '?' + objectToQueryString({id, index}) : ''
      return {
        relative: (group = ':group', id?: string, index?: number) => `group/${group}${qs(id, index)}`,
        absolute: (formId = ':formId', group = ':group', id?: string, index?: number) => `${base(formId)}/group/${group}${qs(id, index)}`,
      }
    })(),
  }
}
