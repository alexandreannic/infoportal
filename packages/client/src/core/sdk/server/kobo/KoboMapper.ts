import {Obj} from '@axanc/ts-utils'
import {Api} from '@infoportal/api-sdk'

/** @deprecated use from sdk*/
export type KoboServer = {
  id: string
  name: string
  url: string
  urlV1: string
  token: string
  workspaceId: Api.WorkspaceId
}

export type SubmissionMappedType = string | string[] | Date | number | undefined

export type SubmissionMapped = {
  [key: string]: SubmissionMappedType | SubmissionMapped[]
}

export type Submission = Api.Submission<SubmissionMapped>

export class KoboMapper {
  static readonly mapSubmissionBySchema = (
    indexedSchema: Record<string, Api.Form.Question | undefined>,
    submissions: Api.Submission,
  ): Submission => {
    const {answers, ...meta} = submissions
    return {...meta, answers: KoboMapper.mapAnswerBySchema(indexedSchema, answers)}
  }

  static readonly unmapSubmissionBySchema = (
    indexedSchema: Record<string, Api.Form.Question | undefined>,
    mapped: Submission,
  ): Api.Submission => {
    const {answers, ...meta} = mapped
    return {...meta, answers: KoboMapper.unmapAnswersBySchema(indexedSchema, answers)}
  }

  private static readonly mapAnswerBySchema = (
    indexedSchema: Record<string, Api.Form.Question | undefined>,
    answers: Api.Submission['answers'],
  ): SubmissionMapped => {
    const res: SubmissionMapped = {...answers}
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
    indexedSchema: Record<string, Api.Form.Question | undefined>,
    answers: SubmissionMapped,
  ): Api.Submission['answers'] => {
    const res: Api.Submission['answers'] = {}
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
            res[question] = (answer as SubmissionMapped[]).map(item =>
              KoboMapper.unmapAnswersBySchema(indexedSchema, item),
            )
          }
          break
        }
        default:
          break
      }
    })
    return res
  }
}
