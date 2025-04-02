export interface ApiPaginate<T> {
  total: number
  data: T[]
}

export interface ApiPagination {
  offset: number
  limit: number
}

export class ApiPaginateHelper {
  static readonly map =
    <T, R>(fn: (_: T) => R) =>
    (paginated: ApiPaginate<T>): ApiPaginate<T> => {
      paginated.data = paginated.data.map(fn) as any
      return paginated
    }

  static readonly wrap =
    (totalSize?: number) =>
    <T>(data: T[]): ApiPaginate<T> => {
      return {
        data,
        total: totalSize ?? data.length,
      }
    }

  static readonly make =
    (limit?: number, offset: number = 0) =>
    <T>(data: T[]): ApiPaginate<T> => {
      return {
        data: limit || offset ? data.slice(offset, offset + (limit ?? data.length)) : data,
        total: data.length,
      }
    }
}
