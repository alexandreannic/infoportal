import makeFetchCookie from 'fetch-cookie'
import {CookieJar} from 'tough-cookie'

interface EcrecAppTokens {
  readonly csrf: string
  readonly cookie: string
}

type EcrecAppClientRequestInit = Omit<RequestInit, 'body'> & {body?: any}

export class EcrecClient {
  constructor(
    private params: {
      login: string
      password: string
      baseURL?: string
    },
  ) {
    this.params = {
      baseURL: 'https://lap.drc.ngo',
      ...params,
    }
  }

  private readonly fetchCookie = makeFetchCookie(fetch, new CookieJar())

  private static readonly extractCookie = (cookies: string) => {
    return cookies?.split(';')[0]
  }

  private static readonly extractTokens = (r: any): EcrecAppTokens => {
    const csrf = r.headers.get('x-csrf-token')!
    const cookie = EcrecClient.extractCookie(r.headers.get('set-cookie')!)
    return {csrf, cookie}
  }

  private readonly getTokenAndSession = async (): Promise<EcrecAppTokens> => {
    const init = await this.fetchCookie(`${this.params.baseURL}/login/root`, {
      keepalive: true,
      credentials: 'same-origin',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json, text/javascript, */*; q=0.01',
      },
    })
    return EcrecClient.extractTokens(init)
  }

  private readonly login = async ({csrf}: EcrecAppTokens) => {
    return await this.fetchCookie(`${this.params.baseURL}/j_spring_security_check`, {
      mode: 'cors',
      keepalive: true,
      credentials: 'include',
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${this.params.login}:${this.params.password}`),
      },
      body: new URLSearchParams({
        _csrf: csrf,
      }),
    })
  }

  private request = async <T>(input: string | URL, init?: EcrecAppClientRequestInit): Promise<T> => {
    const tokens = await this.getTokenAndSession()
    const logins = await this.login(tokens)
    const token = EcrecClient.extractTokens(logins).csrf
    return this.fetchCookie(`${this.params.baseURL}/${input}`, {
      ...init,
      body: JSON.stringify(init?.body),
      keepalive: true,
      credentials: 'same-origin',
      headers: {
        ...init?.headers,
        'X-CSRF-TOKEN': token,
      },
    }).then((_) => _.json() as T)
  }

  readonly post = async <T>(input: string | URL, init?: Omit<EcrecAppClientRequestInit, 'method'>): Promise<T> => {
    return this.request(input, {
      ...init,
      method: 'POST',
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
  }

  readonly get = async <T>(input: string | URL, init?: Omit<EcrecAppClientRequestInit, 'method'>): Promise<T> => {
    return this.request(input, {
      ...init,
      method: 'GET',
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
  }

  readonly put = async <T>(input: string | URL, init?: Omit<EcrecAppClientRequestInit, 'method'>): Promise<T> => {
    return this.request(input, {
      ...init,
      method: 'PUT',
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
  }

  readonly delete = async <T>(input: string | URL, init?: Omit<EcrecAppClientRequestInit, 'method'>): Promise<T> => {
    return this.request(input, {
      ...init,
      method: 'DELETE',
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
  }
}
