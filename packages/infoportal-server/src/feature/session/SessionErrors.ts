import {AppError} from '../../helper/Errors.js'

export namespace SessionError {
  export class UserNotConnected extends AppError.Forbidden {
    constructor() {
      super('user_not_connected')
    }
  }
  export class UserNotFound extends AppError.NotFound {
    constructor() {
      super('session_user_not_found')
    }
  }
  export class UserNoAccess extends AppError.NotFound {
    constructor() {
      super('session_user_not_found')
    }
  }
}
