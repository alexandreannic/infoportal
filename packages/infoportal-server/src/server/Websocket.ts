import {Server} from 'http'
import {WebSocketServer} from 'ws'
import console from 'console'

export const initWebsocket = (httpServer: Server) => {
  const wss = new WebSocketServer({server: httpServer, path: '/ws'})
  wss.on('connection', (ws, req) => {
    console.log('[WS] Client connected')

    ws.on('message', msg => {
      console.log('[WS] Received:', msg.toString())
    })

    setInterval(() => {
      console.log('[WS] Send:')
      ws.send(JSON.stringify({type: 'connected', message: 'Hello client'}))
    }, 2000)
  })
}
