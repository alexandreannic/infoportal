// Orchestrates a single job: spawns worker, streams rows, collects result
import {fork} from 'node:child_process'
import path from 'node:path'
import {MapJob, MapJobResult} from './type'

export async function runUserMap(job: MapJob): Promise<MapJobResult> {
  const workerPath = path.resolve(__dirname, 'sandboxWorker.js') // transpile TS -> JS first
  return await new Promise<MapJobResult>(resolve => {
    const child = fork(workerPath, {
      stdio: ['ignore', 'ignore', 'inherit', 'ipc'],
      execArgv: [
        '--max-semi-space-size=2', // Limit heap
        `--max-old-space-size=${job.memoryMb ?? 64}`,
        '--no-expose-wasm',
        '--disallow-code-generation-from-strings', // mitigates eval/Function
      ],
      env: {
        // Strip env: worker never sees secrets
        NODE_OPTIONS: '--no-deprecation',
      },
    })

    const killTimer = setTimeout(() => {
      try {
        child.kill('SIGKILL')
      } catch {}
      resolve({jobId: job.jobId, ok: false, error: `Timeout: job exceeded ${job.cpuMs ?? 5000} ms`})
    }, job.cpuMs ?? 5000)

    child.on('message', (msg: any) => {
      if (!msg || msg.type !== 'JOB_RESULT') return
      clearTimeout(killTimer)
      try {
        child.kill('SIGKILL')
      } catch {}
      resolve(msg.payload as MapJobResult)
    })

    // Send the job payload. Rows should be plain JSON.
    child.send({type: 'RUN_JOB', payload: job})
  })
}
