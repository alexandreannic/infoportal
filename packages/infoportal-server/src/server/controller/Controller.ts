import {yup} from '../../helper/Utils'

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

export const controllerSchema = {
  id: yup.object({
    id: yup.string().required(),
  }),
}
