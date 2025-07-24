import {useQueryClient} from '@tanstack/react-query'
import {useEffect} from 'react'
import {appConfig} from '@/conf/AppConfig'
import {IpEvent, IpEventParams} from 'infoportal-event'
import {queryKeys} from '@/core/query/query.index'
import {Ip} from 'infoportal-api-sdk'

type Events =
  | IpEventParams.KoboAnswerEdited
  | IpEventParams.KoboTagEdited
  | IpEventParams.KoboValidationEdited
  | IpEventParams.KoboFormSync
  | IpEventParams.NewSubmission

type Data<T extends IpEvent, TData extends Events> = {
  type: IpEvent
  params: TData
}

const is = {
  [IpEvent.NEW_SUBMISSION]: (
    data: Data<any, any>,
  ): data is Data<IpEvent.NEW_SUBMISSION, IpEventParams.NewSubmission> => {
    return data.type === IpEvent.NEW_SUBMISSION
  },
}

export const useWebsocket = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const socket = new WebSocket(appConfig.apiWsURL)
    socket.onmessage = e => {
      const msg: Data<any, any> = JSON.parse(e.data)
      console.log(msg)
      if (is[IpEvent.NEW_SUBMISSION](msg)) {
        queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(
          queryKeys.answers(msg.params.formId),
          (old = {data: [], total: 0}) => {
            return {
              total: old.total + 1,
              data: [...old.data, msg.params.submission],
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
