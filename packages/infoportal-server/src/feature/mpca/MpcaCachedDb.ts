import {MpcaDbService} from './MpcaDbService.js'
import {PrismaClient} from '@prisma/client'
import {ApiPaginate, ApiPaginateHelper, KoboIndex, MpcaEntity, UUID} from 'infoportal-common'
import {GlobalEvent} from '../../core/GlobalEvent.js'
import {MemoryDatabase, MemoryDatabaseInterface} from '../../core/MemoryDatabase.js'
import Event = GlobalEvent.Event

export class MpcaCachedDb {
  private static instance: MpcaCachedDb

  static constructSingleton = (prisma: PrismaClient, service: MpcaDbService = new MpcaDbService(prisma)) => {
    if (!MpcaCachedDb.instance) {
      const mem = MemoryDatabase.getCache()
      const cache = mem.register({
        name: 'mpca',
        fetch: () => service.search({}).then((_) => _.data),
        getId: (_) => _.id,
      })
      this.instance = new MpcaCachedDb(cache)
    }
    return MpcaCachedDb.instance
  }

  private constructor(
    private meme: MemoryDatabaseInterface<MpcaEntity, UUID>,
    private event: GlobalEvent.Class = GlobalEvent.Class.getInstance(),
  ) {
    this.event.listen(Event.KOBO_TAG_EDITED, async (x) => {
      if (
        ![
          KoboIndex.byName('bn_re').id,
          KoboIndex.byName('bn_1_mpcaNfi').id,
          KoboIndex.byName('bn_rapidResponse').id,
          KoboIndex.byName('shelter_cashForRepair').id,
        ].includes(x.formId)
      ) {
        return
      }
      x.answerIds.forEach((id) => {
        this.meme.update(id, (prev) => {
          prev.tags = {
            ...prev.tags,
            ...x.tags,
          }
          return prev
        })
      })
    })
    this.refresh = this.meme.refresh
    this.warmUp = this.meme.warmUp
  }

  readonly refresh: typeof this.meme.refresh
  readonly warmUp: typeof this.meme.warmUp

  readonly search = async (): Promise<ApiPaginate<MpcaEntity>> => {
    // const definedFilters = Obj.entries(filters).filter(([k, v]) => v !== undefined && v.length > 0).map(_ => _[0])
    const data = await this.meme.get()
    // const filteredData = data?.filter(_ => {
    //   for (let i = 0; i < definedFilters.length; i++) {
    //     const key = definedFilters[i]
    //     if (!(filters[key]! as any).includes(_[key])) {
    //       return false
    //     }
    //   }
    //   return true
    // })
    return ApiPaginateHelper.make()(data ?? [])
  }
}
