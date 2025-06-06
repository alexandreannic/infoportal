import {AppSession} from '../feature/session/AppSession.js'
import {Request} from 'express'
import {Session} from 'express-session'

declare module 'express-session' {
  interface SessionData extends Partial<AppSession> {
    // Declare additional properties or methods for the session data
    // session: AppSession
  }
}

export interface AuthRequest extends Request {
  session: Session & Required<AppSession>
}
