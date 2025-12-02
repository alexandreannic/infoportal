import type * as Prisma from '@infoportal/prisma'
import {Brand} from '../common/Common.js'
import {WorkspaceId} from '../workspace/Workspace.js'

  export type ServerId = Brand<string, 'serverId'>
  export type Server = Prisma.KoboServer & {
    id: ServerId
    workspaceId: WorkspaceId
  }
  export namespace Server {
    export namespace Payload {
      export type Create = Omit<Server, 'id'>
    }
  }
