import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect, useRef} from 'react'
import {io, Socket} from 'socket.io-client'
import {AppConfig} from '@/conf/AppConfig'
import {useQueryClient} from '@tanstack/react-query'
import {ClientToServerEvents, IpEvent, ServerToClientEvents} from 'infoportal-common'
import {getSchema} from '@/core/query/useQuerySchema'
import {Ip} from 'infoportal-api-sdk'
import {KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {queryKeys} from '@/core/query/query.index'
import {produce} from 'immer'
import {useQuerySubmission} from '@/core/query/useQuerySubmission'

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

function getSocket(conf: AppConfig) {
  if (!socket) {
    socket = io(conf.apiWsURL, {
      transports: ['websocket'],
    })
  }
  return socket
}

export const useFormSocket = ({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {conf} = useAppSettings()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = getSocket(conf)
    socket.emit('subscribe', formId)
    socketRef.current = socket
    socket.on('connect', () => {
      console.log('✅ Connected to socket.io server', formId)
    })
    socket.on('connect_error', err => {
      console.error('❌ Socket connection error:', err)
    })
    socket.on(IpEvent.SUBMISSION_EDITED, data => {
      useQuerySubmission.localUpdate({
        queryClient,
        formId,
        submissionIds: data.submissionIds,
        question: data.question,
        answer: data.answer,
      })
    })
    socket.on(IpEvent.SUBMISSION_NEW, data => {
      const schema = getSchema({formId, workspaceId, queryClient})
      if (!schema) {
        console.error('Cannot get schema from store.')
        return
      }
      const mapped = KoboMapper.mapSubmissionBySchema(schema.helper.questionIndex, Ip.Submission.map(data.submission))
      queryClient.setQueryData<Ip.Paginate<Ip.Submission>>(queryKeys.answers(formId), (old = {data: [], total: 0}) => {
        return {
          total: old.total + 1,
          data: [...old.data, mapped],
        }
      })
    })

    return () => {
      if (socket.connected) {
        socket.emit('unsubscribe', formId)
        socket.disconnect()
      }
    }
  }, [formId])

  return socketRef
}
