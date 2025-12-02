import type * as Prisma from '@infoportal/prisma'
import {Brand} from '../../common/Common.js'
import {WorkspaceId} from '../../workspace/Workspace.js'
import {FormId} from '../Form.js'
import {GroupId} from '../../group/Group.js'

export type AccessId = Brand<string, 'accessId'>
export type Access = Omit<Prisma.FormAccess, 'id' | 'filters'> & {
  id: AccessId
  groupName?: string
  filters?: Access.Filters
}

export namespace Access {
  export type Filters = Record<string, string[]>

  export namespace Payload {
    export type PathParams = {
      workspaceId: WorkspaceId
      formId: FormId
    }
    export type Create = PathParams & {
      level: Prisma.FormAccess['level']
      email?: Prisma.FormAccess['email']
      job?: Prisma.FormAccess['job'][]
      groupId?: GroupId
      filters?: Filters
    }
    export type Update = PathParams & {
      id: AccessId
      email?: Prisma.FormAccess['email']
      job?: Prisma.FormAccess['job']
      level?: Prisma.FormAccess['level']
      groupId?: GroupId
    }
  }
}
