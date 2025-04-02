import {UserSession} from '../feature/session/UserSession.js'

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
    user: UserSession
  }
}
