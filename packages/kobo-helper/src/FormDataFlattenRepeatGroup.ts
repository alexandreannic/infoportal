import {Ip} from '@infoportal/api-sdk'

export namespace FormDataFlattenRepeatGroup {
  export type Data = Pick<Ip.Submission, 'originId' | 'id' | 'submissionTime'> & Cursor & Record<string, any>

  type Row = Record<string, any> &
    Pick<Ip.Submission, 'id' | 'submissionTime'> & {
      _index?: number
    }

  export type Cursor = {
    _index?: number
    _parent_index?: number
    _parent_table_name?: string
  }

  export const INDEX_COL = '_index'
  export const PARENT_INDEX_COL = '_parent_index'
  export const PARENT_TABLE_NAME = '_parent_table_name'

  export const run = ({
    data = [],
    path,
    depth = 0,
    replicateParentData,
  }: {
    data?: Row[]
    path: string[]
    depth?: number
    replicateParentData?: boolean
  }): Data[] => {
    if (path.length === depth) return data as any
    return run({
      data: data.flatMap((d, i: number) => {
        return (
          d[path[depth]]?.map((_: any, j: number) => ({
            ...(replicateParentData ? d : {}),
            ...(_ ?? {}),
            submissionTime: d.submissionTime,
            id: d.id,
            [FormDataFlattenRepeatGroup.INDEX_COL]: j,
            [FormDataFlattenRepeatGroup.PARENT_INDEX_COL]: d._index ?? i,
            [FormDataFlattenRepeatGroup.PARENT_TABLE_NAME]: path[depth - 1],
          })) ?? []
        )
      }),
      path,
      depth: depth + 1,
      replicateParentData,
    })
  }
}
