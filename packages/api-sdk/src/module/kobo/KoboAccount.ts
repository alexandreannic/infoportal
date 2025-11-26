import type * as Prisma from '@prisma/client'
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
