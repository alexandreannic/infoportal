import {HttpClient} from '@/core/sdk/server/HttpClient'

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
  constructor(private client: HttpClient) {}

  readonly send = (body: EmailSendParams) => {
    return this.client.post(`/email-sender`, {body})
  }
}
