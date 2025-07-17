import {KoboSubmission, KoboSubmissionFlat, KoboSubmissionMetaData, UUID} from 'infoportal-common'
import {Obj} from '@axanc/ts-utils'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'

/** @deprecated use from sdk*/
export type KoboServer = {
  id: string
  name: string
  url: string
  urlV1: string
  token: string
  workspaceId: UUID
}

export type KoboMappedAnswerType = string | string[] | Date | number | undefined

export type MappedAnswer = {
  [key: string]: KoboMappedAnswerType | MappedAnswer[]
}

export type KoboMappedAnswer = Ip.Submission<MappedAnswer>

export class KoboMapper {
  static readonly mapSubmissionBySchema = (
    indexedSchema: Record<string, Kobo.Form.Question>,
    submissions: Ip.Submission,
  ): KoboMappedAnswer => {
    const {answers, ...meta} = submissions
    return {...meta, answers: KoboMapper.mapAnswerBySchema(indexedSchema, answers)}
  }

  static readonly unmapSubmissionBySchema = (
    indexedSchema: Record<string, Kobo.Form.Question>,
    mapped: KoboMappedAnswer,
  ): Ip.Submission => {
    const {answers, ...meta} = mapped
    return {...meta, answers: KoboMapper.unmapAnswersBySchema(indexedSchema, answers)}
  }

  private static readonly mapAnswerBySchema = (
    indexedSchema: Record<string, Kobo.Form.Question>,
    answers: Ip.Submission['answers'],
  ): MappedAnswer => {
    const res: MappedAnswer = {}
    Obj.entries(answers).forEach(([question, answer]) => {
      const type = indexedSchema[question]?.type
      if (!type || !answer) return
      switch (type) {
        case 'today':
        case 'date': {
          res[question] = new Date(answer as Date)
          break
        }
        case 'select_multiple': {
          res[question] = (answer as string).split(' ')
          break
        }
        case 'begin_repeat': {
          if (res[question]) {
            res[question] = (res[question] as any).map((_: any) => KoboMapper.mapAnswerBySchema(indexedSchema, _))
          }
          break
        }
        default:
          break
      }
    })
    return res
  }

  private static readonly unmapAnswersBySchema = (
    indexedSchema: Record<string, Kobo.Form.Question>,
    answers: MappedAnswer,
  ): Ip.Submission['answers'] => {
    const res: Ip.Submission['answers'] = {}
    Obj.entries(answers).forEach(([question, answer]) => {
      const type = indexedSchema[question]?.type
      if (!type || !answer) return
      switch (type) {
        case 'today':
        case 'date': {
          if (answer instanceof Date) {
            res[question] = answer.toISOString().split('T')[0]
          }
          break
        }
        case 'select_multiple': {
          if (Array.isArray(answer)) {
            res[question] = answer.join(' ')
          }
          break
        }
        case 'begin_repeat': {
          if (Array.isArray(answer)) {
            res[question] = (answer as MappedAnswer[]).map(item => KoboMapper.unmapAnswersBySchema(indexedSchema, item))
          }
          break
        }
        default:
          break
      }
    })
    return res
  }

  static readonly mapAnswerMetaData = (k: Partial<Record<keyof KoboSubmissionMetaData, any>>): KoboSubmissionFlat => {
    delete (k as any)['deviceid']
    return {
      ...k,
      start: new Date(k.start),
      end: new Date(k.end),
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
