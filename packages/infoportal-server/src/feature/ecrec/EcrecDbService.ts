import {PrismaClient} from '@prisma/client'

import {type ApiPaginate, ApiPaginateHelper, DrcProgram} from 'infoportal-common'
import type {IKoboMeta} from 'infoportal-common/kobo/IKoboMeta'

import {KoboMetaService} from '../kobo/meta/KoboMetaService'
import {WfpDeduplicationService} from '../wfpDeduplication/WfpDeduplicationService'

export class EcrecDbService {
  constructor(
    private prisma: PrismaClient,
    private meta = new KoboMetaService(prisma),
    private wfp: WfpDeduplicationService = new WfpDeduplicationService(prisma),
  ) {}

  readonly search = async (): Promise<ApiPaginate<IKoboMeta>> => {
    const meta = await this.meta.search({
      activities: [DrcProgram.MSME, DrcProgram.VET],
    })

    return ApiPaginateHelper.make()(meta)
  }
}
