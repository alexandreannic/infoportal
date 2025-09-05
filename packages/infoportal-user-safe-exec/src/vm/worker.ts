import {NodeVM} from 'vm2'

export interface WorkerResult {
  success: boolean
  result?: unknown
  error?: string
  stack?: string
}

export class Worker {
  private vm: NodeVM

  constructor() {
    this.vm = new NodeVM({
      console: 'inherit', // allow console.log inside user code
      sandbox: {}, // isolated global scope
      timeout: 5000, // 5s per function
      require: {
        external: false, // disallow importing any npm modules
        builtin: [], // disallow Node built-in modules (like 'http', 'fs', etc.)
      },
    })
  }

  /**
   * Run a user function provided as a string
   */
  async run(fnString: string, submission: unknown): Promise<WorkerResult> {
    try {
      // Wrap the function string as a module export
      const wrappedFn = `module.exports = ${fnString}`
      const userFn = this.vm.run(wrappedFn) as (...args: any[]) => Promise<any>
      const result = await userFn(submission)
      return {success: true, result}
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {success: false, error: err.message, stack: err.stack}
      }
      return {success: false, error: String(err)}
    }
  }
}
