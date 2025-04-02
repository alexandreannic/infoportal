type StatusCode = 200 | 301 | 302 | 400 | 401 | 403 | 404 | 500 | 504

export class HttpError extends Error {
  constructor(
    public code: StatusCode,
    public message: string,
    public error?: Error,
  ) {
    super(message)
  }
}

export abstract class Controller {
  constructor(
    private readonly params: {
      errorKey: string
    },
  ) {}

  readonly error = (code: StatusCode, message: string) => (e?: Error) => {
    return Promise.reject(new HttpError(code, message, e))
  }

  readonly errorIf =
    <T>(condition: (t: T) => boolean, message: string, code: StatusCode = 500) =>
    (entity: T): Promise<T> => {
      return condition(entity) ? Promise.reject(new HttpError(code, message)) : Promise.resolve(entity)
    }

  readonly errorNotExists =
    (message: string) =>
    <T>(entity?: T): Promise<T> => {
      return entity === undefined ? Promise.reject(new HttpError(404, message)) : Promise.resolve(entity)
    }

  readonly errorKey = (key: string) => ({
    notFound: `error.$key.none`,
    badRequest: `error.$key.bad.request`,
    onUnexpected: `error.$key.unexpected`,
    duplicate: `error.$key.duplicate`,
    onCreate: `error.$key.create`,
    onUpdate: `error.$key.update`,
    onDelete: `error.$key.delete`,
    onSearch: `error.$key.search`,
  })
}
