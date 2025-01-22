import type {PrismaClient} from '@prisma/client'

import type {IKoboMeta, UUID} from 'infoportal-common'

import {GlobalEvent} from '../../core/GlobalEvent'
import {MemoryDatabase, type MemoryDatabaseInterface} from '../../core/MemoryDatabase'

import {EcrecDbService} from './EcrecDbService'

export class EcrecCachedDb {
  private static instance: EcrecCachedDb
  readonly refresh: typeof this.meme.refresh
  readonly warmUp: typeof this.meme.warmUp

  private constructor(
    private meme: MemoryDatabaseInterface<IKoboMeta, UUID>,
    private event: GlobalEvent.Class = GlobalEvent.Class.getInstance(),
  ) {
    this.refresh = this.meme.refresh
    this.warmUp = this.meme.warmUp
  }

  static constructSingleton = (prisma: PrismaClient, service: EcrecDbService = new EcrecDbService(prisma)) => {
    if (!EcrecCachedDb.instance) {
      const memoryDatabase = MemoryDatabase.getCache()
      const cache = memoryDatabase.register({
        name: 'ecrec',
        fetch: () => service.search().then((response) => response.data),
        getId: (_) => _.id,
      })
      this.instance = new EcrecCachedDb(cache)
    }
    return EcrecCachedDb.instance
  }
}
