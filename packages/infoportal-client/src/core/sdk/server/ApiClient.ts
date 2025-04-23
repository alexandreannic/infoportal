import axios, {AxiosError, AxiosResponse, ResponseType} from 'axios'
import * as qs from 'qs'
import {objectToQueryString} from 'infoportal-common'

export interface RequestOption {
  readonly qs?: any
  readonly headers?: any
  readonly body?: any
  readonly timeout?: number
  readonly responseType?: ResponseType
  readonly mapData?: (_: any) => any
  readonly mapError?: (_: any) => never
}

export interface ApiClientParams {
  readonly baseUrl: string
  readonly headers?: any
  readonly requestInterceptor?: (options?: RequestOption) => Promise<RequestOption> | RequestOption
  readonly proxy?: string
  readonly mapData?: (_: any) => any
  readonly mapError?: (_: any) => never
}

export interface ApiClientApi {
  readonly baseUrl: string
  readonly get: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly post: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly postGetPdf: <T = any>(uri: string, options?: RequestOption) => Promise<Blob>
  readonly getPdf: <T = any>(uri: string, options?: RequestOption) => Promise<Blob>
  readonly delete: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly put: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly patch: <T = any>(uri: string, options?: RequestOption) => Promise<T>
}

export type StatusCode = 'front-side' | 200 | 301 | 302 | 400 | 401 | 403 | 404 | 423 | 500 | 504

export class ApiError extends Error {
  public name = 'ApiError'

  constructor(
    public params: {
      code: string
      message: string
      request?: {
        method: Method
        url: string
        qs?: any
        body?: any
      }
      error?: Error
    },
  ) {
    super(params.message)
  }
}

export interface Detail {
  type: string
  title: string
  details: string
}

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'

export class ApiClient {
  readonly postGetPdf: (url: string, options?: RequestOption) => Promise<Blob>
  readonly getPdf: (url: string, options?: RequestOption) => Promise<Blob>
  readonly baseUrl: string
  private readonly request: (method: Method, url: string, options?: RequestOption) => Promise<any>

  constructor({baseUrl, headers, requestInterceptor, mapData, mapError}: ApiClientParams) {
    const client = axios.create({
      baseURL: baseUrl,
      headers: headers,
      withCredentials: true,
    })
    // client.interceptors.request.use(request => {
    // console.log('Starting Request', JSON.stringify(request, null, 2))
    // return request
    // })

    this.baseUrl = baseUrl

    this.request = async (method: Method, url: string, options?: RequestOption) => {
      const builtOptions = await ApiClient.buildOptions(options, headers, requestInterceptor)
      return client
        .request({
          method,
          url: url + (options?.qs && Object.keys(options.qs).length > 0 ? '?' + objectToQueryString(options.qs) : ''),
          headers: builtOptions?.headers,
          // TODO(Alex) Check if it works
          // params: options?.qs,
          data: options?.body,
          paramsSerializer: {
            encode: (params) => qs.stringify(params, {arrayFormat: 'repeat'}),
          },
        })
        .then(options?.mapData ?? mapData ?? ((_: AxiosResponse) => _.data))
        .catch(
          mapError ??
            ((_: AxiosError) => {
              console.error(_)
              const request = {method, url, qs: options?.qs, body: options?.body}
              if (_.code) {
                throw new ApiError({
                  code: _.code,
                  message: _.message,
                  request,
                  error: _,
                })
              }
              throw new ApiError({
                message: `Something not caught went wrong`,
                code: 'front-side',
                error: _,
                request,
              })
            }),
        )
    }

    /**
     * TODO(Alex) Didn't find any way to download pdf with axios so I did it using fetch(), but it should exist.
     */
    const requestUsingFetchApi = async (method: Method, url: string, options?: RequestOption) => {
      const builtOptions = await ApiClient.buildOptions(options, headers, requestInterceptor)
      return fetch(baseUrl + url + (options?.qs ? `?${qs.stringify(options.qs, {arrayFormat: 'repeat'})}` : ''), {
        method,
        headers: builtOptions?.headers,
        body: builtOptions.body ? JSON.stringify(builtOptions?.body) : undefined,
      })
    }

    this.postGetPdf = async (url: string, options?: RequestOption) => {
      return requestUsingFetchApi('POST', url, options).then((_) => _.blob())
    }

    this.getPdf = async (url: string, options?: RequestOption) => {
      return requestUsingFetchApi('GET', url, options).then((_) => _.blob())
    }
  }

  private static readonly buildOptions = async (
    options?: RequestOption,
    headers?: any,
    requestInterceptor: (_?: RequestOption) => RequestOption | Promise<RequestOption> = (_) => _!,
  ): Promise<RequestOption> => {
    const interceptedOptions = await requestInterceptor(options)
    return {
      ...interceptedOptions,
      headers: {...headers, ...interceptedOptions?.headers},
    }
  }

  readonly postFile = <T = any>(uri: string, options: RequestOption & {file: File}): Promise<T> => {
    const form = new FormData()
    form.append('aa-file', options.file)
    return this.request('POST', uri, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    })
  }

  readonly get = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('GET', uri, options)
  }

  readonly post = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('POST', uri, options)
  }

  readonly delete = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('DELETE', uri, options)
  }

  readonly put = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('PUT', uri, options)
  }

  readonly patch = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('PATCH', uri, options)
  }
}
