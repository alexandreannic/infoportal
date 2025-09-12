export type Row = Record<string, unknown>

export type MapJob<T extends Row = Row> = {
  jobId: string
  // Body of the function only. The signature is fixed: (row: Row) => any
  // Example body: "return { fullName: row.first + ' ' + row.last }";
  functionBody: string
  rows: Row[]
  // Optional resource limits
  cpuMs?: number // overall CPU time budget (approx via timeout)
  memoryMb?: number // V8 heap cap for the worker
  perItemTimeoutMs?: number // max time per row
}

export type MapJobResult = {
  jobId: string
  ok: boolean
  results?: unknown[]
  error?: string
}
