import {FunctionExecutorPool} from './FunctionExecutorPool'
import {ExecutionResult} from './FunctionBodyExecutor'

export class UserFunctionExecutor {
  private pool: FunctionExecutorPool

  constructor() {
    this.pool = new FunctionExecutorPool()
  }

  async initialize() {
    await this.pool.initialize()
  }

  /**
   * Execute user's function body with input
   * @example
   * const userCode = `
   *   const doubled = input.numbers.map(n => n * 2);
   *   return { doubled, sum: doubled.reduce((a, b) => a + b, 0) };
   * `;
   * const result = await executor.execute(userCode, { numbers: [1, 2, 3, 4] });
   */
  async execute<TInput = any, TOutput = any>(functionBody: string, input: TInput): Promise<ExecutionResult<TOutput>> {
    return this.pool.executeFunction<TInput, TOutput>(functionBody, input)
  }

  async dispose() {
    await this.pool.dispose()
  }
}
