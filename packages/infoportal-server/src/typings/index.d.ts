import {AppSession} from '../feature/session/AppSession.js'

// export = session;
//
// declare module 'express' {
//   interface SessionData {
//     user: UserSession
//   }
// }

declare module 'express-session' {
  interface SessionData {
    // Declare additional properties or methods for the session data
    session: AppSession
  }
}
