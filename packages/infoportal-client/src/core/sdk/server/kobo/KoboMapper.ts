import {KoboBaseTags, KoboSubmission, KoboSubmissionFlat, KoboSubmissionMetaData} from 'infoportal-common'
import {Obj} from '@alexandreannic/ts-utils'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Kobo} from 'kobo-sdk'

export type KoboServer = {
  id: string
  url: string
  token: string
}

export interface KoboForm {
  server: KoboServer
  createdAt: Date
  updatedAt: Date
  id: Kobo.FormId
  name: string
  serverId: string
  uploadedBy?: string
  deploymentStatus?: Kobo.Form.DeploymentStatus
}

export class KoboFormHelper {
  static readonly map = (_: Record<keyof KoboForm, any>): KoboForm => {
    _.updatedAt = new Date(_.updatedAt)
    _.createdAt = new Date(_.createdAt)
    return _
  }
}

export type KoboMappedAnswerType = string | string[] | Date | number | undefined | KoboSubmissionFlat<any>[]

export type KoboMappedAnswer<
  T extends Record<string, any> = Record<string, KoboMappedAnswerType>
> = (KoboSubmissionMetaData<KoboBaseTags> & T)

export class KoboMapper {

  static readonly mapAnswer = <
    TKoboAnswer extends Record<string, any>,
    TTags extends KoboBaseTags,
    TCustomAnswer extends KoboSubmissionFlat<TKoboAnswer, TTags>
  >(
    fnMap: (x: any) => TKoboAnswer,
    fnMapTags: (x: any) => TTags,
    fnMapCustom?: (x: KoboSubmissionFlat<TKoboAnswer, TTags>) => TCustomAnswer
  ) => ({answers, ...meta}: KoboSubmission): TCustomAnswer => {
    const r = {
      ...fnMap(answers),
      ...KoboMapper.mapAnswerMetaData(meta, fnMapTags),
    }
    return fnMapCustom ? fnMapCustom(r) : r
  }

  static readonly mapPaginateAnswer = <
    TKoboAnswer extends Record<string, any>,
    TTags extends KoboBaseTags,
    TCustomAnswer extends KoboSubmissionFlat<TKoboAnswer, TTags> = KoboSubmissionFlat<TKoboAnswer, TTags>
  >(
    fnMap: (x: any) => TKoboAnswer,
    fnMapTags: (x: any) => TTags,
    fnMapCustom?: (x: KoboSubmissionFlat<TKoboAnswer, TTags>) => TCustomAnswer
  ) => (_: ApiPaginate<KoboSubmission>): ApiPaginate<TCustomAnswer> => {
    return ({
      ..._,
      data: _.data.map(KoboMapper.mapAnswer(fnMap, fnMapTags, fnMapCustom))
    })
  }

  static readonly mapAnswerBySchema = (indexedSchema: Record<string, Kobo.Form.Question>, answers: KoboSubmissionFlat): KoboMappedAnswer => {
    const mapped: KoboMappedAnswer = {...answers}
    Obj.entries(mapped).forEach(([question, answer]) => {
      const type = indexedSchema[question]?.type
      if (!type || !answer) return
      switch (type) {
        case 'today':
        case 'date': {
          (mapped as any)[question] = new Date(answer as Date)
          break
        }
        case 'select_multiple': {
          mapped[question] = (answer as string).split(' ')
          break
        }
        case 'begin_repeat': {
          if (mapped[question]) {
            mapped[question] = (mapped[question] as any).map((_: any) => KoboMapper.mapAnswerBySchema(indexedSchema, _))
          }
          break
        }
        default:
          break
      }
    })
    return mapped
  }

  static readonly mapAnswerMetaData = (
    k: Partial<Record<keyof KoboSubmissionMetaData, any>>,
    fnMapTags: (x: any) => any = _ => _
  ): KoboSubmissionFlat<any, KoboBaseTags> => {
    delete (k as any)['deviceid']
    return {
      ...k,
      start: new Date(k.start),
      end: new Date(k.end),
      date: new Date(k.date),
      submissionTime: new Date(k.submissionTime),
      version: k.version,
      id: k.id,
      validationStatus: k.validationStatus,
      validatedBy: k.validatedBy,
      lastValidatedTimestamp: k.lastValidatedTimestamp,
      geolocation: k.geolocation,
      tags: fnMapTags(k.tags) ?? {},
    }
  }
}
