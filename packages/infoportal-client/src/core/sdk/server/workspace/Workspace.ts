import {UUID} from 'infoportal-common'

export type Workspace = {
  id: UUID
  createdAt: Date
  createdBy: string
  name: string
}

export type WorkspaceCreate = Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>

export type WorkspaceUpdate = WorkspaceCreate

export class WorkspaceHelper {
  static readonly map = (u: Record<keyof Workspace, any>): Workspace => {
    return {
      ...u,
      createdAt: new Date(u.createdAt),
    }
  }
}
