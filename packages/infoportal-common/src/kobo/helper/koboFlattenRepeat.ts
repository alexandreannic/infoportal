import {KoboSubmissionMetaData} from '../mapper'

export type KoboRepeatRef = {
  _index?: number
  _parent_index?: number
  _parent_table_name?: string
}

export type KoboFlattenRepeatData = Pick<KoboSubmissionMetaData, 'id' | 'submissionTime'> & KoboRepeatRef & {
  [key: string]: any
}

type Row = Record<string, any> & Pick<KoboSubmissionMetaData, 'id' | 'submissionTime'>

export class KoboFlattenRepeat {

  static readonly INDEX_COL = '_index'
  static readonly PARENT_INDEX_COL = '_parent_index'
  static readonly PARENT_TABLE_NAME = '_parent_table_name'

  static readonly run = (data: Row[] = [], path: string[], depth = 0): KoboFlattenRepeatData[] => {
    if (path.length === depth) return data as any
    return this.run(data.flatMap((d, i: number) =>
      d[path[depth]]?.map((_: any, j: number) => ({
        ...d,
        ..._ ?? {},
        submissionTime: d.submissionTime,
        id: d.id,
        [KoboFlattenRepeat.INDEX_COL]: j,
        [KoboFlattenRepeat.PARENT_INDEX_COL]: d._index ?? i,
        [KoboFlattenRepeat.PARENT_TABLE_NAME]: path[depth - 1]
      })) ?? []
    ), path, depth + 1)
  }
}
