import {AIID, Database, Form, FormDescs} from './ActivityInfo'

interface ActicityInfoBody {
  [key: string]: any
}

interface ApiParams extends Omit<RequestInit, 'body'> {
  body?: object
}

class Api {

  constructor(private token: string) {
  }

  readonly request = (path: string, init?: ApiParams) => {
    return fetch('https://www.activityinfo.org' + path, {
      ...init,
      credentials: 'include',
      // body: init?.method === 'POST' ? body as any : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + this.token,
      },
    })
  }

  readonly get = <T = any>(path: string, init?: ApiParams): Promise<T> => {
    return this.request(path, {...init, method: 'GET'}).then(_ => _.json())
  }

  readonly post = (path: string, init?: ApiParams) => {
    return this.request(path, {...init, method: 'POST'}).then(_ => _.json())
  }

  readonly delete = (path: string, init?: ApiParams) => {
    return this.request(path, {...init, method: 'DELETE'})
  }

  readonly postNoJSON = (path: string, init?: ApiParams) => {
    return this.request(path, {...init, method: 'POST'}).then(_ => _.text())
  }
}

export class ActivityInfoSdk {

  constructor(private token: string, private api = new Api(token)) {
  }

  static readonly buildRequest = ({
    activityIdPrefix,
    activity,
    activityIndex,
    formId,
  }: {
    activityIdPrefix: string
    activity: any
    activityIndex: number
    formId: string
  }) => {
    return {
      'changes': [{
        'formId': formId,
        'recordId': activityIdPrefix + ('' + activityIndex).padStart(3, '0'),
        'parentRecordId': null,
        'fields': activity
      }]
    }
  }

  readonly restore = (formId: string, recordId: string) => {
    return this.api.postNoJSON(`/resources/update`, {
      body: {
        changes: [{
          formId,
          recordId,
          deleted: false,
        }]
      }
    })
  }

  readonly softDeleteRecord = (formId: string, recordId: string) => {
    return this.api.postNoJSON(`/resources/update`, {
      body: {
        changes: [{
          formId,
          recordId,
          deleted: true,
        }]
      }
    })
  }

  readonly fetchDatabases = () => {
    return this.api.get<Database[]>(`/resources/databases`)
  }

  readonly fetchForms = (dbId: string = 'cas3n26ldsu5aea5') => {
    return this.api.get<Form>(`/resources/databases/${dbId}`)//.then(_ => _.resources.map(_ => _.id === dbId))
  }

  readonly fetchForm = (formId: string = 'cas3n26ldsu5aea5'): Promise<FormDescs> => {
    return this.api.get(`/resources/form/${formId}/tree/translated`)
      .then(_ => {
        return _.forms
      })
  }

  readonly fetchColumns = async (formId: AIID, optionDefId: AIID, filter?: string): Promise<{id: AIID, label: string}[]> => {
    return this.api.post(`/resources/query/columns`, {
      body: {
        filter,
        // filter: filter ? `_id == \\"${filter}\\"` : undefined,
        rowSources: [{'rootFormId': formId}],
        columns: [{'id': 'id', 'expression': '_id'}, {'id': 'k1', 'expression': optionDefId}],
        truncateStrings: false
      }
    }).then(_ => _.columns)
      .then(res => {
        return res.id.values.map((col: any, i: number) => ({
          id: col,
          label: res.k1.values[i],
        }))
      })
  }

  readonly fetchColumnsFree = async (body: any): Promise<Record<AIID, {values: string[]}>> => {
    return this.api.post(`/resources/query/columns`, {body})//.then(_ => _.columns)
      .then(_ => {
        const {id, value} = _.columns
        const res = (id.values as string[]).reduce((acc, id, i) => {
          // @ts-ignore
          acc[value.values[i]] = id
          return acc
        }, {})
        return res
      })
  }

  readonly fetchColumnsDemoFslc = async () => {
    return this.fetchColumnsFree({
      'rowSources': [{'rootFormId': 'cvseljqlqb3ntvj7j'}],
      'columns': [{'id': '_id', 'expression': '_id'}, {
        'id': 'Activity',
        'expression': 'cdu30d0lqb3o3gm7u'
      }, {
        'id': 'Subactivity',
        'expression': 'cxgts7wls342mqv2'
      }, {'id': 'Indicator', 'expression': 'c8qwc6llqb3o3gm7v'}],
      'truncateStrings': false,
      'tags': ['data-entry-ref', 'key-matrix']
    }).then(_ => {
      return _._id.values.reduce((acc, id, i) => {
        if (!acc[_.Activity.values[i]]) acc[_.Activity.values[i]] = {}
        if (!acc[_.Activity.values[i]][_.Subactivity.values[i]]) acc[_.Activity.values[i]][_.Subactivity.values[i]] = {}
        if (!acc[_.Activity.values[i]][_.Subactivity.values[i]][_.Indicator.values[i]]) acc[_.Activity.values[i]][_.Subactivity.values[i]][_.Indicator.values[i]] = {}
        acc[_.Activity.values[i]][_.Subactivity.values[i]][_.Indicator.values[i]] = id
        return acc
      }, {} as Record<string, any>)
    }).then(console.log)
  }

  readonly publish = (params: any) => {
    // console.dir(params, {depth: null})
    return this.api.postNoJSON(`/resources/update`, {
      body: params
    })
  }

  // readonly publish2 = (params: AiProtectionHhs.FormParams) => {
  //   return this.api.post(`/resources/update`, {
  //     body: ActivityInfoSdk.makeForm(params)
  //   })
  // }

  /** @deprecated should generated related dummy-model.ts and use function mapping */
  // static readonly makeForm = (params: AiProtectionHhs.FormParams): any => {
  //   const getKeyId = (id: keyof typeof AiProtectionHhs.inputs) => AiProtectionHhs.inputs[id].id
  //   // const buildOption = <T extends keyof typeof AiProtectionHhs.inputsOptions>(t: T, defaultValue?: keyof (typeof AiProtectionHhs.inputsOptions)[T]) => {
  //   //   return {
  //   //     [inputs[t].id]: (inputs[t] as any).optionsId + ':' + ((AiProtectionHhs.inputsOptions as any)[t][(params as any)[t] ?? defaultValue])
  //   //   }
  //   // }
  //   // const buildValue = <T extends keyof AiProtectionHhs.FormParams>(t: T) => {
  //   //   return {[inputs[t].id]: params[t]}
  //   // }
  //
  //   // @ts-ignore
  //   const buildOption = <T extends Partial<Record<keyof typeof inputs, any>>, K extends keyof T>(obj: T, k: K, defaultValue?: keyof (typeof AiProtectionHhs.inputsOptions)[K]) => {
  //     const input = (AiProtectionHhs.inputs as any)[k]
  //     const value = (obj as any)[k] ?? defaultValue
  //     if (value !== undefined)
  //       return {[input.id]: input.optionsId + ':' + (AiProtectionHhs.inputsOptions as any)[k][value]}
  //   }
  //
  //   const buildValue = <T extends Partial<Record<keyof typeof AiProtectionHhs.inputs, any>>, K extends keyof T>(obj: T, k: K) => {
  //     const input = (AiProtectionHhs.inputs as any)[k]
  //     const value = obj[k]
  //     if (value !== undefined)
  //       return {[input.id]: value}
  //   }
  //   const recordId = 'drcaalex' + makeid(9)
  //   return {
  //     'changes': [
  //       {
  //         formId: 'cas3n26ldsu5aea5',
  //         recordId,
  //         parentRecordId: null,
  //         fields: {
  //           ...buildOption(params, 'Partner Organization', 'DRC - Danish Demining Group (DRC-DDG)'),
  //           ...buildOption(params, 'Plan Code'),
  //           ...buildOption(params, 'Oblast'),
  //           ...buildOption(params, 'Raion'),
  //           ...buildOption(params, 'Hromada'),
  //           ...buildValue(params, 'Settlement'),
  //           ...buildValue(params, 'Collective Centre'),
  //           // 'Response Theme': '',
  //         },
  //       },
  //       ...params.subActivities.map(x => {
  //         return {
  //           formId: 'cy3vehlldsu5aeb6',
  //           recordId: 'alexdrc' + makeid(9),
  //           parentRecordId: recordId,
  //           fields: {
  //             ...buildValue(x, 'Reporting Month'),
  //             ...buildOption(x, 'Population Group'),
  //             ...buildOption(x, 'Protection Indicators', '# of persons reached through protection monitoring'),
  //             // ...buildOption(x, 'Protection Sub-Indicators', '# of persons reached through protection monitoring'),
  //             ...buildValue(x, 'Total Individuals Reached'),
  //             ...buildValue(x, 'Girls'),
  //             ...buildValue(x, 'Boys'),
  //             ...buildValue(x, 'Adult Women'),
  //             ...buildValue(x, 'Adult Men'),
  //             ...buildValue(x, 'Elderly Women'),
  //             ...buildValue(x, 'Elderly Men'),
  //             ...buildValue(x, 'People with disability'),
  //           }
  //         }
  //       }),
  //     ]
  //   }
  // }
}
