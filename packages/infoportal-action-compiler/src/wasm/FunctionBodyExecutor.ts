import {getQuickJS} from 'quickjs-emscripten'

export interface ExecutionResult<T = any> {
  result: T
  logs: string[]
  executionTimeMs: number
  error?: string
}

export class FunctionBodyExecutor {
  private quickJS: any

  async initialize() {
    this.quickJS = await getQuickJS()
  }

  /**
   * Execute user function body with predefined signature
   * @param functionBody - User's function body code
   * @param input - Input object to pass to function
   * @param timeoutMs - Execution timeout in milliseconds
   */
  async executeFunction<TInput = any, TOutput = any>(
    functionBody: string,
    input: TInput,
    timeoutMs = 5000,
  ): Promise<ExecutionResult<TOutput>> {
    const context = this.quickJS.newContext()
    const startTime = Date.now()

    try {
      // Set up safe console for user code
      const logs: string[] = []
      const console = context.newObject()
      console.set(
        'log',
        context.newFunction('log', (...args: any[]) => {
          const logMessage = args.map(arg => context.dump(arg)).join(' ')
          logs.push(logMessage)
        }),
      )
      context.setProp(context.global, 'console', console)

      // Create the complete function with user's body
      const completeFunction = `
        (function(input) {
          ${functionBody}
        })
      `

      // Add timeout protection
      let timeoutHandle: NodeJS.Timeout
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
          context.dispose()
          reject(new Error(`Function execution timeout after ${timeoutMs}ms`))
        }, timeoutMs)
      })

      // Execute the function
      const executionPromise = (async () => {
        // Evaluate the function
        const fnResult = context.evalCode(completeFunction)
        if (fnResult.error) {
          const error = context.dump(fnResult.error)
          fnResult.error.dispose()
          throw new Error(`[[1]] Function compilation error: ${error}`)
        }

        // Call the function with input
        const inputHandle = context.dump(input)
        const result = context.callFunction(fnResult.value, context.undefined, inputHandle)

        if (result.error) {
          const error = context.dump(result.error)
          result.error.dispose()
          throw new Error(`[[2]] Function execution error: ${error}`)
        }

        const output = context.dump(result.value)

        // Cleanup
        fnResult.value.dispose()
        result.value.dispose()

        return output
      })()

      const result = await Promise.race([executionPromise, timeoutPromise])
      clearTimeout(timeoutHandle!)

      return {
        result,
        logs,
        executionTimeMs: Date.now() - startTime,
      }
    } catch (error) {
      return {
        result: null as TOutput,
        logs: [],
        executionTimeMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      }
    } finally {
      context.dispose()
    }
  }

  /**
   * Execute multiple function bodies in parallel
   */
  async executeBatch<TInput = any, TOutput = any>(
    executions: Array<{functionBody: string; input: TInput}>,
  ): Promise<ExecutionResult<TOutput>[]> {
    return Promise.all(
      executions.map(({functionBody, input}) => this.executeFunction<TInput, TOutput>(functionBody, input)),
    )
  }

  dispose() {
    this.quickJS?.dispose()
  }
}
