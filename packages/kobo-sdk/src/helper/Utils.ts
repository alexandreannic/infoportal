import PromisePool from '@supercharge/promise-pool'

export const chunkify = <T, R>({
  size,
  data,
  fn,
  concurrency,
}: {
  size: number,
  data: T[]
  fn: (_: T[]) => Promise<R>
  concurrency?: number
}): Promise<R[]> => {
  const chunkedSubmissions = data.reduce((chunks, id, index) => {
    if (index % size === 0) chunks.push([])
    chunks[chunks.length - 1].push(id)
    return chunks
  }, [] as T[][])
  if (concurrency)
    return PromisePool.withConcurrency(concurrency).for(chunkedSubmissions).process(fn).then(_ => _.results)
  return Promise.all(chunkedSubmissions.map(fn))
}

export const queuify = <T, P extends any[], M>({
  run,
  getQueueIndex,
  extractDataFromParams,
  reconcileParams,
  batchSize = 20,
  concurrency = 12,
}: {
  getQueueIndex?: (...p: P) => string
  extractDataFromParams: (...p: P) => M[]
  reconcileParams: (t: M[], p: P) => P,
  run: (...p: P) => Promise<T>
  batchSize?: number
  concurrency?: number
}) => {
  const queues: Map<string, P[]> = new Map()
  const locks: Map<string, Promise<void>> = new Map()

  const processQueue = async (queue: string): Promise<void> => {
    if (locks.get(queue)) {
      return locks.get(queue)
    }
    const processing = (async () => {
      while (queues.get(queue)!.length > 0) {
        const params = queues.get(queue)!.shift()!
        const data = extractDataFromParams(...params)
        try {
          await chunkify({
            concurrency,
            size: batchSize,
            data: data,
            fn: data => {
              return run(...reconcileParams(data, params))
            },
          })
        } catch (e) {
          locks.delete(queue)
        }
      }
    })()
    locks.set(queue, processing)
    await processing
    locks.delete(queue)


  }

  return async (...p: P) => {
    const queueName = getQueueIndex ? getQueueIndex(...p) : '1'
    if (!queues.has(queueName)) {
      queues.set(queueName, [])
    }
    queues.get(queueName)!.push(p)
    await processQueue(queueName)
  }
}