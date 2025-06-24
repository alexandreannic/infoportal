import {initClient} from '@ts-rest/core'
import {ipContract} from '../contract/Contract'

const buildClient = (baseUrl: string) =>
  initClient(ipContract, {
    baseUrl,
  })

export type IpClient = ReturnType<typeof buildClient>

export const buildIpClient = (baseUrl: string) => {
  const client = buildClient(baseUrl)
  return {
    form: {
      // version: formVersionClient(client),
    },
  }
}

type TsRestResponse<T> =
  | {
      status: 200
      body: T
    }
  | {
      status: Exclude<HTTPStatusCode, 200>
      body?: unknown
    }

export const mapClientReponse = <T>(res: TsRestResponse<T>): T => {
  if (res.status !== 200) throw new Error('Unknown error')
  return res.body as T
}

export type HTTPStatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 419
  | 420
  | 421
  | 422
  | 423
  | 424
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 507
  | 511
