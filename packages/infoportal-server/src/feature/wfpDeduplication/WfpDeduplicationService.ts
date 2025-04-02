import {PrismaClient} from '@prisma/client'
import XlsxPopulate from 'xlsx-populate'
import {UserSession} from '../session/UserSession.js'
import {AccessService} from '../access/AccessService.js'
import {AppFeatureId} from '../access/AccessType.js'
import {seq} from '@axanc/ts-utils'
import {PromisePool} from '@supercharge/promise-pool'
import {appConf} from '../../core/conf/AppConf.js'
import {ApiPaginateHelper, getDrcSuggestion, WfpDeduplication} from 'infoportal-common'
import {GlobalEvent} from '../../core/GlobalEvent.js'
import Event = GlobalEvent.Event

export interface WfpDbSearch {
  limit?: number
  offset?: number
  taxId?: string[]
  offices?: string[]
  createdAtStart?: Date
  createdAtEnd?: Date
}

export class WfpDeduplicationService {
  constructor(
    private prisma: PrismaClient,
    private access: AccessService = new AccessService(prisma),
    private conf = appConf,
    private event = GlobalEvent.Class.getInstance(),
  ) {}

  readonly searchByUserAccess = async (search: WfpDbSearch, user: UserSession) => {
    const accesses = await this.access.searchForUser({featureId: AppFeatureId.wfp_deduplication, user})
    const authorizedOffices = [
      ...new Set(
        seq(accesses)
          .flatMap((_) => _.params?.filters?.office!)
          .compact(),
      ),
    ]
    const filteredOffices =
      user.admin || authorizedOffices.length === 0
        ? search.offices
        : authorizedOffices.filter((_) => !search.offices || search.offices.includes(_))
    return this.search({...search, offices: filteredOffices})
  }

  readonly search = async (search: WfpDbSearch = {}) => {
    const where = {
      createdAt: {
        gte: search.createdAtStart,
        lte: search.createdAtEnd,
      },
      office: {in: search.offices},
      beneficiary: {
        taxId: {in: search.taxId},
      },
    }
    const [totalSize, data] = await Promise.all([
      this.prisma.mpcaWfpDeduplication.count({where}),
      this.prisma.mpcaWfpDeduplication.findMany({
        include: {
          beneficiary: {
            select: {
              taxId: true,
            },
          },
        },
        where,
        take: search.limit,
        skip: search.offset,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])
    return ApiPaginateHelper.wrap(totalSize)(
      data.map((_: any): WfpDeduplication => {
        _.suggestion = getDrcSuggestion(_)
        _.taxId = _.beneficiary.taxId
        return _
      }),
    )
  }

  readonly uploadTaxId = async (filePath: string) => {
    const xls = await XlsxPopulate.fromFileAsync(filePath)
    const data = xls
      .activeSheet()
      ._rows.splice(1)
      .map((_) => ({beneficiaryId: _.cell(1).value() as string, taxId: ('' + _.cell(2).value()) as string}))
    await PromisePool.for(data)
      .withConcurrency(this.conf.db.maxConcurrency)
      .process((_: any) =>
        this.prisma.mpcaWfpDeduplicationIdMapping.upsert({
          update: _,
          where: {beneficiaryId: _.beneficiaryId},
          create: _,
        }),
      )
    this.event.emit(Event.WFP_DEDUPLICATION_SYNCHRONIZED)
  }
}
