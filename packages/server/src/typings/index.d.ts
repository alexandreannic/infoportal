import {AppSession} from '../feature/session/AppSession.js'
import {Request} from 'express'
import {Session} from 'express-session'

declare module 'express-session' {
  interface SessionData {
    // Declare additional properties or methods for the session data
    app: AppSession
  }
}

export type AuthRequest<T extends Request = Request> = T & {
  session: Session & {
    app: AppSession
  }
}
