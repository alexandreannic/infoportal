export namespace AppError {
  export class Base extends Error {
    constructor(message: string) {
      super(message)
    }
  }

  export const throwNotFoundIfUndefined =
    (message: string) =>
    <T>(t: T | undefined): T => {
      if (t) return t
      throw new NotFound(message)
    }

  export const throwError = (error: {new (): Base}) => (e?: Error) => {
    return Promise.reject(new error())
  }

  export class Forbidden extends Base {
    constructor(message: string) {
      super(message)
    }
  }

  export class NotFound extends Base {
    constructor(message: string) {
      super(message)
    }
  }

  export class NoFileUploaded extends Base {
    constructor(message: string) {
      super(message)
    }
  }

  export class BadRequest extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class OnUnexpected extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class Duplicate extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class OnCreate extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class OnUpdate extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class OnDelete extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class OnSearch extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class AlreadyExist extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class UserNotFound extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class WrongFormat extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }

  export class InternalServerError extends Base {
    constructor(message: string) {
      super(message)
      // this.name = this.constructor.name
    }
  }
}
