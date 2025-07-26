import {Server as HttpServer} from 'http'
import {WebSocket, WebSocketServer} from 'ws'
import {app} from '../index.js'
import {IpEvent} from 'infoportal-event'

export class AppWebsocket {
  constructor(
    private httpServer: HttpServer,
    private event = app.event,
    private log = app.logger('WS'),
  ) {}

  readonly init = () => {
    const wss = new WebSocketServer({noServer: true, path: '/ws'})
    this.httpServer.on('upgrade', (req, socket, head) => {
      if (req.url === '/ws') {
        wss.handleUpgrade(req, socket, head, ws => {
          wss.emit('connection', ws, req)
        })
      } else {
        socket.destroy()
      }
    })
    wss.on('connection', (ws, req) => {
      this.log.info('[WS] Client connected')
      this.event.listen(IpEvent.SUBMISSION_NEW, params => {
        ws.send(JSON.stringify({type: IpEvent.SUBMISSION_NEW, params}))
      })
    })
    // ==
    // wss.on('upgrade', (req, socket, head) => {
    //   if (req.url === '/ws') {
    //     wss.handleUpgrade(req, socket, head, ws => {
    //       this.log.info('[WS] Client connected')
    //       this.listen(ws)
    //     })
    //   } else {
    //     socket.destroy()
    //   }
    // })
  }

  private readonly listen = (ws: WebSocket) => {
    this.event.listen(IpEvent.SUBMISSION_NEW, params => {
      ws.send(JSON.stringify({type: IpEvent.SUBMISSION_NEW, params}))
    })
  }
}
