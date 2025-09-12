import {ExecutionResult, FunctionBodyExecutor} from './FunctionBodyExecutor'

export class FunctionExecutorPool {
  private pool: FunctionBodyExecutor[] = []
  private readonly poolSize = 10

  async initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const executor = new FunctionBodyExecutor()
      await executor.initialize()
      this.pool.push(executor)
    }
  }

  async executeFunction<TInput = any, TOutput = any>(
    functionBody: string,
    input: TInput,
  ): Promise<ExecutionResult<TOutput>> {
    let executor = this.pool.pop()

    if (!executor) {
      executor = new FunctionBodyExecutor()
      await executor.initialize()
    }

    try {
      const result = await executor.executeFunction<TInput, TOutput>(functionBody, input)

      // Return to pool only if no error
      if (!result.error) {
        this.pool.push(executor)
      } else {
        executor.dispose()
      }

      return result
    } catch (error) {
      executor.dispose()
      throw error
    }
  }

  async dispose() {
    await Promise.all(this.pool.map(executor => executor.dispose()))
    this.pool = []
  }
}
