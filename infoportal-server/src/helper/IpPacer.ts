import {app, AppLogger} from '../index'

export class IpPacer {
  constructor(private log: AppLogger = app.logger('IpQueue')) {
  }

  readonly create = <T>({
    fn,
    frequency,
  }: {
    frequency: number,
    fn: (t: T[]) => Promise<void>,
  }) => {
    let queue: T[] = []
    setInterval(() => {
      this.log.info(`${queue.length} element(s) to insert.`)
      if (queue.length > 0) {
        const copy = [...queue]
        queue = []
        fn(copy).catch((e) => {
          this.log.error(`Failed to insert ${copy.length}`)
          return Promise.reject(e)
        })
      }
    }, frequency)
    return (t: T[]) => {
      queue.push(...t)
    }
  }
}