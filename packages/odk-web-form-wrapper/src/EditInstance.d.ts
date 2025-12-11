export interface EditInstanceOptions {
  readonly resolveInstance: ResolvableFormInstance
  readonly attachmentFileNames: readonly string[]
  readonly resolveAttachment: ResolveInstanceAttachment
}

export type ResolvableFormInstance = Thunk<Awaitable<ResolvedFormInstance>>

export type ResolvedFormInstance = Blob | FetchResourceResponse | File | string

export type ResolveInstanceAttachment = (fileName: string) => Promise<FetchResourceResponse>

export interface FetchResourceResponse {
  readonly ok?: boolean
  readonly status?: number
  readonly body?: ReadableStream<Uint8Array> | null
  readonly bodyUsed?: boolean
  readonly headers?: FetchResourceResponseHeaders

  readonly blob: () => Promise<Blob>
  readonly text: () => Promise<string>
}
