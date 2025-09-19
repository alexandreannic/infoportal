import {NodeVM} from 'vm2'
import ts from 'typescript'

export interface WorkerResult<T = Record<string, any>> {
  success: boolean
  result?: T[] | T
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

  transpile(tsCode: string) {
    return ts.transpileModule(tsCode, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2019,
        strict: true,
        // module: ts.ModuleKind.CommonJS,
        module: ts.ModuleKind.None,
      },
    })
  }

  async run(fnString: string, submission: unknown): Promise<WorkerResult> {
    try {
      // Wrap the function string as a module export
      const wrappedFn = `${fnString}\nmodule.exports = transform`
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
