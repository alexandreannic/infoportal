import type * as Prisma from '@prisma/client'
import {Brand} from './Common.js'
import {WorkspaceId} from './Workspace.js'

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
