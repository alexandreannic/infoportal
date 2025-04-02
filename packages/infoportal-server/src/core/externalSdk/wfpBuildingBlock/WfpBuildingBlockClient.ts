import {TOTP, URI} from 'otpauth'
import {ApiClient} from 'kobo-sdk'
import fetch from 'node-fetch'

export class WfpBuildingBlockClient {
  constructor(
    private params: {
      otpUrl: string
      login: string
      password: string
      baseURL?: string
    },
  ) {
    this.params = {
      baseURL: 'https://buildingblocks.ukr.wfp.org/api',
      ...params,
    }
  }

  private readonly getOtpCode = () => {
    const otpUrl = this.params.otpUrl
    const otpUrlParts = URI.parse(otpUrl)
    const totp = new TOTP({
      issuer: otpUrlParts.issuer,
      label: otpUrlParts.label,
      secret: otpUrlParts.secret.base32,
    })
    return totp.generate()
  }

  private readonly getApiToken = (): Promise<string> => {
    return fetch(this.params.baseURL + '/manager/auth', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: this.params.login,
        password: this.params.password,
        resetOtp: false,
        otp: this.getOtpCode(),
      }),
    })
      .then((_) => _.json())
      .then((_: any) => _.apiToken)
  }

  generate = async () => {
    const token = await this.getApiToken()
    return new ApiClient({
      baseUrl: this.params.baseURL!,
      headers: {
        Authorization: token,
      },
    })
  }
}
