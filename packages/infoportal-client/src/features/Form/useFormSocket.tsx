import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffect, useRef, useState} from 'react'
import {Socket} from 'socket.io-client'
import {useQueryClient} from '@tanstack/react-query'
import {IpEvent} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'
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
      useQuerySubmission.cacheUpdate({
        queryClient,
        formId,
        submissionIds: data.submissionIds,
        question: data.question,
        answer: data.answer,
      })
    })
    socket.on(IpEvent.SUBMISSION_NEW, data => {
      useQuerySubmission.cacheInsert({formId, workspaceId, queryClient, submission: data.submission})
    })
    socket.on(IpEvent.SUBMISSION_REMOVED, data => {
      useQuerySubmission.cacheRemove({formId, workspaceId, queryClient, submissionIds: data.submissionIds})
    })
    socket.on(IpEvent.SUBMISSION_EDITED_VALIDATION, data => {
      useQuerySubmission.cacheUpdateValidation({
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
