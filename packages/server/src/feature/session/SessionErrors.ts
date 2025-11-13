import {HttpError} from '@infoportal/api-sdk'

export namespace SessionError {
  export class UserNotConnected extends HttpError.Forbidden {
    constructor() {
      super('user_not_connected')
    }
  }
  export class UserNotFound extends HttpError.NotFound {
    constructor() {
      super('session_user_not_found')
    }
  }
  export class UserNoAccess extends HttpError.NotFound {
    constructor() {
      super('session_user_not_found')
    }
  }
}
