import {ApiClient} from '@/core/sdk/server/ApiClient'

export enum EmailContext {
  Cfm = 'Cfm',
  Kobo = 'Kobo',
}

export type EmailSendParams = {
  context: EmailContext
  tag?: string
  to: string[]
  cc?: string[]
  subject: string
  html: string
}

export class EmailSendSdk {
  constructor(private client: ApiClient) {}

  readonly send = (body: EmailSendParams) => {
    return this.client.post(`/email-sender`, {body})
  }
}
