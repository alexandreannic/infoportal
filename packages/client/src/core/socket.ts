import {io, Socket} from 'socket.io-client'
import {ClientToServerEvents, ServerToClientEvents} from '@infoportal/common'
import {AppConfig} from '@/conf/AppConfig'

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

export function getAppSocket(conf: AppConfig) {
  if (!socket) {
    socket = io(conf.apiWsURL, {
      transports: ['websocket'],
    })
  }
  return socket
}
