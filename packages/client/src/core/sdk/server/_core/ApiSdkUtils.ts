export interface ApiPaginate<T> {
  total: number
  data: T[]
}

export interface ApiPagination {
  offset: number
  limit: number
}

export class ApiSdkUtils {
  static readonly mapPaginate =
    <T, R>(fn: (_: T) => R) =>
    (paginated: ApiPaginate<T>): ApiPaginate<T> => {
      paginated.data = paginated.data.map(fn) as any
      return paginated
    }
}
