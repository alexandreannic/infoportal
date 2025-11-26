import {Server} from 'socket.io'
import {app} from '../index.js'
import {AuthRequest} from '../typings'
import {Api} from '@infoportal/api-sdk'
import {ClientToServerEvents, IpEvent, ServerToClientEvents} from '@infoportal/common'

export class Socket {
  private static readonly connectedFormUsers = new Map<Api.FormId, Set<Api.User.Email>>()

  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents>,
    private event = app.event,
    private log = app.logger('Socket'),
  ) {
    io.on('connection', socket => {
      log.debug('🔌 Client connected')
      const req = socket.request as AuthRequest
      const user = req.session.app.user

      socket.on('subscribe', async (formId: Api.FormId) => {
        await socket.join(formId)
        Socket.addUser(formId, user.email)
        io.to(formId).emit('USERS', Socket.getUsers(formId))
        log.debug(`✅ ${user.email} joined channel: ${formId}`)
      })

      socket.on('unsubscribe', async (formId: Api.FormId) => {
        await socket.leave(formId)
        const {hasChanged} = Socket.removeUser(formId, user.email)
        if (hasChanged) {
          io.to(formId).emit('USERS', Socket.getUsers(formId))
        }
        log.debug(`🚪 ${user.email} left channel: ${formId}`)
      })

      socket.on('disconnect', () => {
        for (const [formId, users] of Socket.connectedFormUsers.entries()) {
          if (users.delete(user.email)) {
            io.to(formId).emit('USERS', Array.from(users))
          }
          if (users.size === 0) {
            Socket.connectedFormUsers.delete(formId)
          }
        }
        log.debug(`❌ ${user.email} disconnected`)
      })
    })
    event.listen(IpEvent.SUBMISSION_EDITED, _ => {
      io.to(_.formId).emit(IpEvent.SUBMISSION_EDITED, _)
    })
    event.listen(IpEvent.SUBMISSION_REMOVED, _ => {
      io.to(_.formId).emit(IpEvent.SUBMISSION_REMOVED, _)
    })
    event.listen(IpEvent.SUBMISSION_EDITED_VALIDATION, _ => {
      io.to(_.formId).emit(IpEvent.SUBMISSION_EDITED_VALIDATION, _)
    })
    event.listen(IpEvent.SUBMISSION_NEW, _ => {
      io.to(_.formId).emit(IpEvent.SUBMISSION_NEW, _)
    })
  }

  private static addUser = (formId: Api.FormId, email: Api.User.Email) => {
    if (!Socket.connectedFormUsers.has(formId)) {
      Socket.connectedFormUsers.set(formId, new Set())
    }
    Socket.connectedFormUsers.get(formId)!.add(email)
  }

  private static removeUser = (formId: Api.FormId, email: Api.User.Email): {hasChanged: boolean} => {
    const users = Socket.connectedFormUsers.get(formId)
    if (!users) return {hasChanged: false}
    users?.delete(email)
    if (users?.size === 0) {
      Socket.connectedFormUsers.delete(formId)
    }
    if (users.size === 0) {
      Socket.connectedFormUsers.delete(formId)
      return {hasChanged: false}
    } else {
      return {hasChanged: true}
    }
  }

  private static getUsers = (formId: Api.FormId) => {
    return Array.from(Socket.connectedFormUsers.get(formId) ?? [])
  }
}
