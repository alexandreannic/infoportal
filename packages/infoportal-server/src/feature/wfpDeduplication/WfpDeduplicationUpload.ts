import {WFPBuildingBlockSdk} from '../../core/externalSdk/wfpBuildingBlock/WfpBuildingBlockSdk'
import {AssistancePrevented, AssistanceProvided, WfpFilters} from '../../core/externalSdk/wfpBuildingBlock/WfpBuildingBlockType'
import {Prisma, PrismaClient} from '@prisma/client'
import {ApiPaginate, DrcOffice, WfpDeduplicationStatus} from 'infoportal-common'
import {addMinutes, parse, subMinutes} from 'date-fns'
import {appConf, AppConf} from '../../core/conf/AppConf'
import {WfpBuildingBlockClient} from '../../core/externalSdk/wfpBuildingBlock/WfpBuildingBlockClient'
import {app, AppLogger} from '../../index'
import promiseRetry from 'promise-retry'
import {Obj} from '@alexandreannic/ts-utils'
import {ApiError} from 'kobo-sdk'

export class WfpDeduplicationUpload {

  private constructor(
    private prisma: PrismaClient,
    private wfpSdk: WFPBuildingBlockSdk,
    private conf: AppConf,
    private log: AppLogger = app.logger('WfpDeduplicationUpload'),
  ) {

  }

  static readonly construct = async (conf: AppConf, prisma: PrismaClient) => {
    const wfpSdk = new WFPBuildingBlockSdk(await new WfpBuildingBlockClient({
      login: appConf.buildingBlockWfp.login,
      password: appConf.buildingBlockWfp.password,
      otpUrl: appConf.buildingBlockWfp.otpURL,
    }).generate())
    return new WfpDeduplicationUpload(prisma, wfpSdk, conf)
  }

  readonly saveAll = async () => {
    this.log.info('Clear database...')
    await this.prisma.mpcaWfpDeduplication.deleteMany()
    this.log.info('AssistanceProvided...')
    // await Promise.all([
    await this.throttledFetchAndRun({
      fetch: _ => promiseRetry((retry, number) => {
        return this.wfpSdk.getAssistanceProvided(_).catch((e: ApiError) => {
          if (e.details.code === 401) {
            return Promise.reject(e)
          }
          this.log.info('Retry request ' + number)
          return retry(number)
        })
      }),
      runOnBatchedResult: async (res: AssistanceProvided[]) => {
        this.log.debug('Run...')
        await this.upsertMappingId(res.map(_ => _.beneficiaryId))
        await this.prisma.mpcaWfpDeduplication.createMany({
          data: res.map(_ => {
            return ({
              amount: +_.amount,
              wfpId: _.id,
              createdAt: _.createdAt,
              expiry: _.expiry,
              beneficiaryId: _.beneficiaryId,
              status: WfpDeduplicationStatus.NotDeduplicated,
              validFrom: _.validFrom,
              category: _.category,
            })
          })
        })
      }
    })
    this.log.info('AssistancePrevented...')
    await this.throttledFetchAndRun({
      fetch: _ => this.wfpSdk.getAssistancePrevented(_),
      runOnBatchedResult: async (res: AssistancePrevented[]) => {
        this.log.debug('Run...')
        await this.upsertMappingId(res.map(_ => _.beneficiaryId))
        await this.prisma.mpcaWfpDeduplication.createMany({
          data: res.map(_ => {
            const status = (() => {
              if (_.message.includes('Partially deduplicated')) {
                return WfpDeduplicationStatus.PartiallyDeduplicated
              } else if (_.message.includes('Deduplicated')) {
                return WfpDeduplicationStatus.Deduplicated
              }
              return WfpDeduplicationStatus.Error
            })()
            const existing = (() => {
              const match = _.message.match(/-\s+Already\s+assisted\s+by\s+(.*?)\s+from\s+(\d{8})\s+to\s+(\d{8})\s+for\s+UAH\s+([\d,.\s]+)\s+for\s+(CASH-\w+)/)
              if (!match) {
                console.warn(_)
                return {}
              }
              return {
                existingOrga: match![1],
                existingStart: parse(match![2], 'yyyyMMdd', new Date()),
                existingEnd: parse(match![3], 'yyyyMMdd', new Date()),
                existingAmount: parseFloat(match![4].replace(/[.,]00\s*$/g, '').replaceAll(/[,.\s]/g, '')),
              }
            })()
            return ({
              amount: +_.amount,
              wfpId: _.id,
              createdAt: _.createdAt,
              expiry: _.expiry,
              beneficiaryId: _.beneficiaryId,
              message: _.message,
              status,
              validFrom: _.validFrom,
              category: _.category,
              ...existing,
            })
          })
        })
      }
    })
    // ])
    this.log.info('mergePartiallyDuplicated')
    // await this.mergePartiallyDuplicated()
    this.log.info('setoblast')
    await this.setOblast()
    this.log.info('clearHumanMistakes')
    await this.clearHumanMistakes()
    this.log.info('Done')
  }

  private readonly upsertMappingId = async (ids: string[]) => {
    await Promise.all(ids.map(_ => this.prisma.mpcaWfpDeduplicationIdMapping.upsert({
      create: {beneficiaryId: _},
      where: {beneficiaryId: _, taxId: undefined},
      update: {beneficiaryId: _},
    })))
  }

  private readonly mergePartiallyDuplicated = async () => {
    const partiallyDuplicated = await this.prisma.mpcaWfpDeduplication.findMany({
      where: {
        status: WfpDeduplicationStatus.PartiallyDeduplicated
      }
    })
    await Promise.all(partiallyDuplicated.map(_ => {
      return this.prisma.mpcaWfpDeduplication.findMany({
        where: {
          status: WfpDeduplicationStatus.NotDeduplicated,
          beneficiaryId: _.beneficiaryId,
          createdAt: {gt: subMinutes(_.createdAt, 20), lt: addMinutes(_.createdAt, 20)}
        }
      }).then(res => {
        if (res.length !== 1)
          console.error(`Problem when searching matching entry ${_.beneficiaryId} at ${_.createdAt}, found ${res.length} entries.`)
        if (res.length > 0)
          return this.prisma.mpcaWfpDeduplication.update({
            data: {amount: res[0].amount},
            where: {id: _.id}
          }).then(() => res[0].id)
        else
          return Promise.resolve(undefined)
      }).then(deprecatedId => {
        if (deprecatedId)
          return this.prisma.mpcaWfpDeduplication.delete({where: {id: deprecatedId}}).catch(() => Promise.resolve(undefined))
        return Promise.resolve(undefined)
      })
    }))
  }

  private readonly throttledFetchAndRun = async <T, R>({
    fetch,
    batchSize = 500,
    runOnBatchedResult
  }: {
    batchSize?: number
    fetch: (_: WfpFilters) => Promise<ApiPaginate<T>>,
    runOnBatchedResult: (batch: T[]) => Promise<R>
  }): Promise<R[]> => {
    let offset = 0
    const r: R[] = []
    for (; ;) {
      const res = await fetch({limit: batchSize, offset})
      if (res.data.length > 0) {
        r.push(await runOnBatchedResult(res.data))
        offset += res.data.length
      } else {
        break
      }
    }
    return r
  }

  private clearHumanMistakes = async () => {
    return this.prisma.mpcaWfpDeduplication.deleteMany({
      where: {fileName: 'DRC Ukraine_BB_Data submission_CEJ_20230731.xlsx.gpg'}
    })
  }

  private setOblast = async () => {
    const officeMapping: Record<string, DrcOffice> = {
      'HRK': DrcOffice.Kharkiv,
      'NLV': DrcOffice.Mykolaiv,
      'CEJ': DrcOffice.Chernihiv,
      'DNK': DrcOffice.Dnipro,
      'CWC': DrcOffice.Lviv,
      'NLK': DrcOffice.Mykolaiv,
      'LWO': DrcOffice.Lviv,
      'CHJ': DrcOffice.Chernihiv,
      'UMY': DrcOffice.Sumy,
      'SLO': DrcOffice.Sloviansk,
    }
    const possibleOffices = Obj.keys(officeMapping)
    const files = await this.throttledFetchAndRun({
      fetch: this.wfpSdk.getImportFiles,
      runOnBatchedResult: async (_) => _,
    }).then(_ => _.flatMap(_ => _))

    let offset = 0
    for (const file of files) {
      this.log.debug(`Update ${file.finishedAt} ${file.fileName}`)
      const office = possibleOffices.find(oblastCode => file.fileName.includes(oblastCode))
      if (!office) console.warn(`Oblast not found for filename ${file.fileName}`)
      const rows = await this.prisma.mpcaWfpDeduplication.findMany({
        select: {id: true, beneficiaryId: true},
        orderBy: {createdAt: 'desc'},
        skip: offset,
        take: file.additionalInfo.rowCount * 2,
      }).then(function handleMultipleSupport(res) {
        // If a benef is already supported by 2 NGOs, his record will be duplicated, one row per NGO
        // So we should get file.additionalInfo.rowCount DISTINCT rows.
        const unique = new Set()
        return res.filter(_ => {
          if (unique.size < file.additionalInfo.rowCount) unique.add(_.beneficiaryId)
          return unique.has(_.beneficiaryId)
        })
      })
      const officeValue = office ? officeMapping[office] : null
      if (rows.length > 0) {
        await this.prisma.$executeRaw`
            UPDATE "MpcaWfpDeduplication"
            SET "office"     = ${officeValue},
                "fileName"   = ${file.fileName},
                "fileUpload" = ${new Date(file.finishedAt)}
            WHERE "id" IN (${Prisma.join(rows.map(_ => _.id))})
        `
      }
      // await this.prisma.mpcaWfpDeduplication.updateMany({
      //   where: {id: {in: rows.map(_ => _.id)}},
      //   data: {
      //     office: office ? officeMapping[office] : undefined,
      //     fileName: file.fileName,
      //     fileUpload: new Date(file.finishedAt)
      //   }
      // })
      offset += rows.length
    }
  }
}
