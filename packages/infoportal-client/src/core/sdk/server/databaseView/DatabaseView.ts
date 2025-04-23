export type DatabaseView = {
  id: string
  name: string
  databaseId: string
  createdAt: Date
  updatedAt?: Date
  createdBy: string
  updatedBy?: string
  visibility: DatabaseViewVisibility
  details: DatabaseViewCol[]
}

export class DatabaseViewHelper {
  static readonly map = (_: any): DatabaseView => {
    return {
      ..._,
      createdAt: new Date(_.createdAt),
      updatedAt: new Date(_.updatedAt),
    }
  }
}

export type DatabaseViewCol = {
  name: string
  width?: number
  visibility?: DatabaseViewColVisibility
}

export enum DatabaseViewVisibility {
  Public = 'Public',
  Sealed = 'Sealed',
  Private = 'Private',
}

export enum DatabaseViewColVisibility {
  Hidden = 'Hidden',
  Visible = 'Visible',
}
