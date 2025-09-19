// Run in a *separate node process*. Do NOT import server DB or env here.
// We'll support both execution models; use process IPC when forked.
// Use vm2 with no require, no wasm, frozen intrinsics.
// pnpm add vm2
import {VM, VMScript} from 'vm2'

type Row = any

// Some light hardening of globals in this process
// (still deploy in container without network for real hardening)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function freezeGlobals(anyGlobal: any) {
  const deny = [
    'process',
    'require',
    'module',
    'global',
    'globalThis',
    'Deno',
    'WebSocket',
    'fetch',
    'XMLHttpRequest',
    'Worker',
    'SharedArrayBuffer',
    'Atomics',
    'eval',
    'Function',
  ]
  for (const k of deny) {
    try {
      Object.defineProperty(anyGlobal, k, {value: undefined})
    } catch {}
  }
}
freezeGlobals(globalThis)

/**
 * Build the full JS wrapper from a user-provided *function body*.
 * The user cannot change the signature or capture host references.
 * We expose a single function: mapSubmission(row)
 */
function buildWrappedFunction(functionBody: string) {
  return `
    'use strict';
    // No access to require/process; only plain JS.
    function mapSubmission(row) {
      ${functionBody}
    }
    module.exports = { mapSubmission };
  `
}

// Validate size/keywords to reduce attack surface (defense-in-depth)
function validateFunctionBody(body: string): string | null {
  if (body.length > 50_000) return 'Function body too large (>50kB).'
  const blacklist = [
    'require',
    'process',
    'global',
    'globalThis',
    'import(',
    'eval',
    'Function(',
    'while(true)',
    'for(;;)',
  ]
  for (const token of blacklist) {
    if (body.includes(token)) return `Forbidden token detected: ${token}`
  }
  return null
}

// IPC for child_process.fork
process.on('message', async (msg: any) => {
  if (!msg || msg.type !== 'RUN_JOB') return
  const {jobId, functionBody, rows, cpuMs = 5_000, memoryMb = 64, perItemTimeoutMs = 200} = msg.payload

  try {
    const invalid = validateFunctionBody(functionBody)
    if (invalid) {
      process.send?.({type: 'JOB_RESULT', payload: {jobId, ok: false, error: invalid}})
      return
    }

    // Limit V8 heap for this process via execArgv in parent. (memoryMb is enforced by parent)
    const vm = new VM({
      timeout: perItemTimeoutMs, // per script run
      eval: false,
      wasm: false,
      sandbox: {},
    })

    const wrapped = buildWrappedFunction(functionBody)
    const script = new VMScript(wrapped, {filename: `user-mapper-${jobId}.js`})
    const exportsObj = vm.run(script) as {mapSubmission: (row: Row) => unknown}

    if (typeof exportsObj?.mapSubmission !== 'function') {
      process.send?.({type: 'JOB_RESULT', payload: {jobId, ok: false, error: 'mapSubmission is not a function'}})
      return
    }

    const start = Date.now()
    const out: unknown[] = []
    for (let i = 0; i < rows.length; i++) {
      // Enforce overall cpu/time budget
      if (Date.now() - start > cpuMs) {
        throw new Error(`CPU budget exceeded (${cpuMs} ms)`)
      }
      // Deep-clone row to avoid reference leakage across VM boundary
      const row = JSON.parse(JSON.stringify(rows[i]))
      // Build a tiny script per call so we get per-call timeout enforcement
      const callSrc = new VMScript(`
        const { mapSubmission } = module.exports;
        mapSubmission(__row__)
      `)
      // Provide input via sandbox each call to guarantee isolation
      vm.setGlobals?.({__row__: row})
      const result = vm.run(callSrc)
      out.push(result)
    }

    process.send?.({type: 'JOB_RESULT', payload: {jobId, ok: true, results: out}})
  } catch (err: any) {
    process.send?.({type: 'JOB_RESULT', payload: {jobId, ok: false, error: String(err?.message || err)}})
  } finally {
    // Ensure the worker exits; parent should not reuse workers between tenants/jobs
    process.exit(0)
  }
})
