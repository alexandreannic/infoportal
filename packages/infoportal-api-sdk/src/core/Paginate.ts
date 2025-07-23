import {Ip} from './Types'

export class Paginate {
  static readonly map =
    <T, R>(fn: (_: T) => R) =>
    (paginated: Ip.Paginate<T>): Ip.Paginate<R> => {
      return {
        ...paginated,
        data: paginated.data.map(fn),
      }
    }

  static readonly wrap =
    (totalSize?: number) =>
    <T>(data: T[]): Ip.Paginate<T> => {
      return {
        data,
        total: totalSize ?? data.length,
      }
    }

  static readonly make =
    (limit?: number, offset: number = 0) =>
    <T>(data: T[]): Ip.Paginate<T> => {
      return {
        data: limit || offset ? data.slice(offset, offset + (limit ?? data.length)) : data,
        total: data.length,
      }
    }
}
