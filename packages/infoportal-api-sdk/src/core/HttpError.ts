export class HttpError extends Error {
  constructor(
    public code: HttpError.StatusCode,
    public message: string,
    public data?: any,
  ) {
    super(message)
  }
}

export namespace HttpError {
  export type StatusCode = 200 | 301 | 302 | 400 | 401 | 403 | 404 | 409 | 500 | 504

  export const throwNotFoundIfUndefined =
    (message: string) =>
    <T>(t: T | undefined): T => {
      if (t) return t
      throw new NotFound(message)
    }

  export const throwError = (error: {new (): HttpError}) => (e?: Error) => {
    return Promise.reject(new error())
  }

  export class Forbidden extends HttpError {
    constructor(
      public message: string = 'No access',
      public data?: any,
    ) {
      super(401, message)
    }
  }

  export class NotFound extends HttpError {
    constructor(
      public message: string = 'Resource not found',
      public data?: any,
    ) {
      super(404, message)
    }
  }

  export class NoFileUploaded extends HttpError {
    constructor(message: string) {
      super(400, message)
    }
  }

  export class BadRequest extends HttpError {
    constructor(message: string) {
      super(400, message)
      // this.name = this.constructor.name
    }
  }

  export class Conflict extends HttpError {
    constructor(message: string) {
      super(409, message)
      // this.name = this.constructor.name
    }
  }

  export class WrongFormat extends HttpError {
    constructor(message: string) {
      super(400, message)
      // this.name = this.constructor.name
    }
  }

  export class InternalServerError extends HttpError {
    constructor(message: string) {
      super(500, message)
      // this.name = this.constructor.name
    }
  }
}
