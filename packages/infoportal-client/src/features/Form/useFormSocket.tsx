import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect, useRef, useState} from 'react'
import {Socket} from 'socket.io-client'
import {useQueryClient} from '@tanstack/react-query'
import {IpEvent} from 'infoportal-common'
import {getSchema} from '@/core/query/useQuerySchema'
import {Ip} from 'infoportal-api-sdk'
import {KoboMapper} from '@/core/sdk/server/kobo/KoboMapper'
import {queryKeys} from '@/core/query/query.index'
import {useQuerySubmission} from '@/core/query/useQuerySubmission'
import {getAppSocket} from '@/core/socket'

export const useFormSocket = ({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
  const {conf} = useAppSettings()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [connectedEmail, setConnectedEmails] = useState<Ip.User.Email[]>([])

  useEffect(() => {
    const socket = getAppSocket(conf)
    socket.emit('subscribe', formId)
    socketRef.current = socket
    socket.on('connect', () => {
      console.log('✅ Connected to socket.io server', formId)
    })
    socket.on('connect_error', err => {
      console.error('❌ Socket connection error:', err)
    })
    socket.on('USERS', data => {
      setConnectedEmails(data)
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
  }, [workspaceId, formId])

  return connectedEmail
}
