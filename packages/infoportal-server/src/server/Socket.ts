import {Server} from 'socket.io'
import {app} from '../index.js'
import {AuthRequest} from '../typings'
import {Ip} from 'infoportal-api-sdk'
import {ClientToServerEvents, IpEvent, ServerToClientEvents} from 'infoportal-common'

export class Socket {
  private static readonly connectedFormUsers = new Map<Ip.FormId, Set<Ip.User.Email>>()

  constructor(
    private io: Server<ClientToServerEvents, ServerToClientEvents>,
    private event = app.event,
    private log = app.logger('Socket'),
  ) {
    io.on('connection', socket => {
      log.debug('🔌 Client connected')
      const req = socket.request as AuthRequest
      const user = req.session.app.user
      socket.on('subscribe', (formId: Ip.FormId) => {
        log.debug(`✅ Joined channel: ${formId}`)

        if (!Socket.connectedFormUsers.has(formId)) Socket.connectedFormUsers.set(formId, new Set())
        Socket.connectedFormUsers.get(formId)!.add(user.email)

        socket.join(formId)
      })

      socket.on('unsubscribe', (channel: string) => {
        log.debug(`🚪 Left channel: ${channel}`)
        socket.leave(channel)
      })
    })
    event.listen(IpEvent.SUBMISSION_EDITED, _ => {
      io.to(_.formId).emit(IpEvent.SUBMISSION_EDITED, _)
    })
    event.listen(IpEvent.SUBMISSION_NEW, _ => {
      io.to(_.formId).emit(IpEvent.SUBMISSION_NEW, _)
    })
  }
}
