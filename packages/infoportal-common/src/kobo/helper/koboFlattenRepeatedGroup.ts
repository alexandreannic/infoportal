import {KoboSubmissionMetaData} from '../mapper/index.js'

export namespace KoboFlattenRepeatedGroup {
  export type Data = Pick<KoboSubmissionMetaData, 'id' | 'submissionTime'> & Cursor & Record<string, any>

  type Row = Record<string, any> & Pick<KoboSubmissionMetaData, 'id' | 'submissionTime'>

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
      data: data.flatMap(
        (d, i: number) =>
          d[path[depth]]?.map((_: any, j: number) => ({
            ...(replicateParentData ? d : {}),
            ...(_ ?? {}),
            submissionTime: d.submissionTime,
            id: d.id,
            [KoboFlattenRepeatedGroup.INDEX_COL]: j,
            [KoboFlattenRepeatedGroup.PARENT_INDEX_COL]: d._index ?? i,
            [KoboFlattenRepeatedGroup.PARENT_TABLE_NAME]: path[depth - 1],
          })) ?? [],
      ),
      path,
      depth: depth + 1,
      replicateParentData,
    })
  }
}
