import {KoboSubmission, KoboSubmissionFlat, KoboSubmissionMetaData, UUID} from 'infoportal-common'
import {Obj} from '@axanc/ts-utils'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Kobo} from 'kobo-sdk'

export type KoboServerCreate = Omit<KoboServer, 'id'>

/** @deprecated use from sdk*/
export type KoboServer = {
  id: string
  name: string
  url: string
  urlV1: string
  token: string
  workspaceId: UUID
}

export type KoboMappedAnswerType = string | string[] | Date | number | undefined | KoboSubmissionFlat[]

export type KoboMappedAnswer = KoboSubmissionMetaData & Record<string, KoboMappedAnswerType>

export class KoboMapper {
  static readonly mapAnswer = ({answers, ...meta}: KoboSubmission): KoboSubmissionFlat => {
    return {
      ...answers,
      ...KoboMapper.mapAnswerMetaData(meta),
    }
  }

  static readonly mapPaginateAnswer = (_: ApiPaginate<KoboSubmission>): ApiPaginate<KoboSubmissionFlat> => {
    return {
      ..._,
      data: _.data.map(KoboMapper.mapAnswer),
    }
  }

  static readonly mapAnswerBySchema = (
    indexedSchema: Record<string, Kobo.Form.Question>,
    answers: KoboSubmissionFlat,
  ): KoboMappedAnswer => {
    const mapped: KoboMappedAnswer = {...answers}
    Obj.entries(mapped).forEach(([question, answer]) => {
      const type = indexedSchema[question]?.type
      if (!type || !answer) return
      switch (type) {
        case 'today':
        case 'date': {
          ;(mapped as any)[question] = new Date(answer as Date)
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

  static readonly unmapAnswerBySchema = (
    schemaQuestionIndex: Record<string, Kobo.Form.Question>,
    mapped: KoboMappedAnswer,
  ): KoboSubmissionFlat => {
    const flat: KoboSubmissionFlat = {...mapped}

    Obj.entries(flat).forEach(([question, answer]) => {
      const type = schemaQuestionIndex[question]?.type
      if (!type || !answer) return
      switch (type) {
        case 'today':
        case 'date': {
          if (answer instanceof Date) {
            flat[question] = answer.toISOString().split('T')[0]
          }
          break
        }
        case 'select_multiple': {
          if (Array.isArray(answer)) {
            flat[question] = answer.join(' ')
          }
          break
        }
        case 'begin_repeat': {
          if (Array.isArray(answer)) {
            flat[question] = answer.map(item => KoboMapper.unmapAnswerBySchema(schemaQuestionIndex, item))
          }
          break
        }
        default:
          break
      }
    })

    return flat
  }

  static readonly mapAnswerMetaData = (k: Partial<Record<keyof KoboSubmissionMetaData, any>>): KoboSubmissionFlat => {
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
    } as any
  }
}
