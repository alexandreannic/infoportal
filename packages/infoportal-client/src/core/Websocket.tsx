import {useQueryClient} from '@tanstack/react-query'
import {useEffect} from 'react'
import {appConfig} from '@/conf/AppConfig'
import {IpEvent, IpEventParams} from 'infoportal-event'
import {queryKeys} from '@/core/query/query.index'
import {Ip} from 'infoportal-api-sdk'
import {KoboSchemaHelper} from 'infoportal-common'
import {KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'

type Events =
  // | IpEventParams.KoboAnswerEdited
  // | IpEventParams.KoboTagEdited
  | IpEventParams.KoboValidationEdited
  | IpEventParams.KoboFormSync
  | IpEventParams.NewSubmission

type Data<T extends IpEvent, TData extends Events> = {
  type: IpEvent
  params: TData
}

const is = {
  [IpEvent.SUBMISSION_NEW]: (
    data: Data<any, any>,
  ): data is Data<IpEvent.SUBMISSION_NEW, IpEventParams.NewSubmission> => {
    return data.type === IpEvent.SUBMISSION_NEW
  },
}

export const useWebsocket = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const socket = new WebSocket(appConfig.apiWsURL)
    socket.onmessage = e => {
      const msg: Data<any, any> = JSON.parse(e.data)
      if (is[IpEvent.SUBMISSION_NEW](msg)) {
        const {formId, workspaceId, submission} = msg.params
        const schema = queryClient.getQueryData<KoboSchemaHelper.Bundle | undefined>(
          queryKeys.schema(workspaceId, formId),
        )
        if (!schema) {
          console.error('Cannot get schema from store.')
          return
        }
        const mapped = KoboMapper.mapSubmissionBySchema(schema.helper.questionIndex, Ip.Submission.map(submission))
        queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(
          queryKeys.answers(formId),
          (old = {data: [], total: 0}) => {
            return {
              total: old.total + 1,
              data: [...old.data, mapped],
            }
          },
        )
      }
    }
    return () => {
      socket.close()
    }
  }, [])
}
