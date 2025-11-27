import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect, useRef, useState} from 'react'
import {Socket} from 'socket.io-client'
import {useQueryClient} from '@tanstack/react-query'
import {IpEvent} from '@infoportal/common'
import {Api} from '@infoportal/api-sdk'
import {UseQuerySubmission} from '@/core/query/submission/useQuerySubmission.js'
import {getAppSocket} from '@/core/socket'

export const useFormSocket = ({formId, workspaceId}: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) => {
  const {conf} = useAppSettings()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [connectedEmail, setConnectedEmails] = useState<Api.User.Email[]>([])

  useEffect(() => {
    const socket = getAppSocket(conf)
    socket.emit('subscribe', formId)
    socketRef.current = socket
    // socket.on('connect', () => {
    //   console.log('✅ Connected to socket.io server', formId)
    // })
    socket.on('connect_error', err => {
      console.error('❌ Socket connection error:', err)
    })
    socket.on('USERS', data => {
      setConnectedEmails(data)
    })
    socket.on(IpEvent.SUBMISSION_EDITED, data => {
      UseQuerySubmission.cacheUpdate({
        queryClient,
        formId,
        submissionIds: data.submissionIds,
        question: data.question,
        answer: data.answer,
      })
    })
    socket.on(IpEvent.SUBMISSION_NEW, data => {
      UseQuerySubmission.cacheInsert({formId, workspaceId, queryClient, submission: data.submission})
    })
    socket.on(IpEvent.SUBMISSION_REMOVED, data => {
      UseQuerySubmission.cacheRemove({formId, workspaceId, queryClient, submissionIds: data.submissionIds})
    })
    socket.on(IpEvent.SUBMISSION_EDITED_VALIDATION, data => {
      UseQuerySubmission.cacheUpdateValidation({
        formId,
        queryClient,
        submissionIds: data.submissionIds,
        status: data.status,
      })
    })

    return () => {
      if (socket.connected) {
        socket.emit('unsubscribe', formId)
        socket.off('USERS')
        socket.off(IpEvent.SUBMISSION_NEW)
        socket.off(IpEvent.SUBMISSION_REMOVED)
        socket.off(IpEvent.SUBMISSION_EDITED)
        socket.off(IpEvent.SUBMISSION_EDITED_VALIDATION)
      }
    }
  }, [workspaceId, formId])

  return connectedEmail
}
