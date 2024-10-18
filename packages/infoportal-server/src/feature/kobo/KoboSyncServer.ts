import {KoboAnswer, KoboId, koboIndex, KoboIndex, logPerformance, UUID} from 'infoportal-common'
import {Prisma, PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from './KoboSdkGenerator'
import {app, AppCacheKey, AppLogger} from '../../index'
import {createdBySystem} from '../../db/DbInit'
import {seq} from '@alexandreannic/ts-utils'
import {GlobalEvent} from '../../core/GlobalEvent'
import {KoboService} from './KoboService'
import {AppError} from '../../helper/Errors'
import {appConf} from '../../core/conf/AppConf'
import {Util} from '../../helper/Utils'

export type KoboSyncServerResult = {
  answersIdsDeleted: KoboId[]
  answersCreated: KoboAnswer[]
  answersUpdated: KoboAnswer[]
}

export class KoboSyncServer {

  constructor(
    private prisma: PrismaClient,
    private service = new KoboService(prisma),
    private koboSdkGenerator: KoboSdkGenerator = new KoboSdkGenerator(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private appCache = app.cache,
    private conf = appConf,
    private log: AppLogger = app.logger('KoboSyncServer'),
  ) {
  }

  readonly handleWebhook = async ({formId, answer}: {formId?: KoboId, answer: KoboAnswer}) => {
    this.log.info(`Handle webhook for form ${formId}, ${answer.id}`)
    if (!formId)
      throw new AppError.WrongFormat('missing_form_id')
    const connectedForm = this.prisma.koboForm.findFirst({where: {id: formId}})
    if (!connectedForm) {
      throw new AppError.NotFound('form_not_found')
    }
    return this.service.create(formId, answer)
  }

  readonly syncAllApiAnswersToDb = async (updatedBy: string = createdBySystem) => {
    const allForms = await this.prisma.koboForm.findMany()
    this.log.info(`Synchronize kobo forms:`)
    for (const form of allForms) {
      try {
        await this.syncApiForm({serverId: form.serverId, formId: form.id, updatedBy})
      } catch (e) {
        console.error(e)
      }
    }
    this.log.info(`Synchronize kobo forms finished!`)
  }

  private info = (formId: string, message: string) => this.log.info(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)
  private debug = (formId: string, message: string) => this.log.debug(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)

  readonly syncApiForm = async ({serverId = koboIndex.drcUa.server.prod, formId, updatedBy}: {serverId?: UUID, formId: KoboId, updatedBy?: string}) => {
    try {
      this.debug(formId, `Synchronizing by ${updatedBy}...`)
      await this.syncApiFormInfo(serverId, formId)
      const res = await this.syncApiFormAnswers(serverId, formId)
      await this.prisma.koboForm.update({
        where: {id: formId},
        data: {
          updatedAt: new Date(),
          updatedBy: updatedBy,
        }
      })
      this.log.info(formId, `Synchronizing by ${updatedBy}... COMPLETED.`)
      if (!this.conf.production || res.answersIdsDeleted.length + res.answersUpdated.length + res.answersIdsDeleted.length > 0) {
        this.event.emit(GlobalEvent.Event.KOBO_FORM_SYNCHRONIZED, {formId})
      }
      this.appCache.clear(AppCacheKey.KoboAnswers, formId)
      this.appCache.clear(AppCacheKey.KoboSchema, formId)
    } catch (e) {
      this.log.info(formId, `Synchronizing by ${updatedBy}... FAILED.`)
      throw e
    }
  }

  private readonly syncApiFormInfo = async (serverId: UUID, formId: KoboId) => {
    const sdk = await this.koboSdkGenerator.get(serverId)
    const schema = await sdk.v2.getForm(formId)
    return this.prisma.koboForm.update({
      where: {id: formId},
      data: {
        name: schema.name,
        deploymentStatus: schema.deployment_status
      }
    })
  }

  private readonly _syncApiFormAnswers = async (serverId: UUID, formId: KoboId): Promise<KoboSyncServerResult> => {
    const sdk = await this.koboSdkGenerator.get(serverId)
    this.debug(formId, `Fetch remote answers...`)
    const remoteAnswers = await sdk.v2.getAnswers(formId).then(_ => _.data)
    const remoteIdsIndex: Map<KoboId, KoboAnswer> = remoteAnswers.reduce((map, curr) => map.set(curr.id, curr), new Map<KoboId, KoboAnswer>)//new Map(remoteAnswers.map(_ => _.id))
    this.debug(formId, `Fetch remote answers... ${remoteAnswers.length} fetched.`)

    this.debug(formId, `Fetch local answers...`)
    const localAnswersIndex = await this.prisma.koboAnswers.findMany({where: {formId, deletedAt: null}, select: {id: true, uuid: true}}).then(_ => {
      return _.reduce((map, curr) => map.set(curr.id, curr.uuid), new Map<KoboId, UUID>())
    })
    this.debug(formId, `Fetch local answers... ${localAnswersIndex.size} fetched.`)

    const handleDelete = async () => {
      const idsToDelete = [...localAnswersIndex.keys()].filter(_ => !remoteIdsIndex.has(_))
      this.debug(formId, `Handle delete (${idsToDelete.length})...`)
      await this.prisma.koboAnswers.updateMany({
        data: {
          deletedAt: new Date(),
          deletedBy: 'system',
        },
        where: {source: null, formId, id: {in: idsToDelete}}
      })
      return idsToDelete
    }

    const handleCreate = async () => {
      const notInsertedAnswers = remoteAnswers.filter(_ => !localAnswersIndex.has(_.id))
      this.debug(formId, `Handle create (${notInsertedAnswers.length})...`)
      await this.service.createMany(formId, notInsertedAnswers)
      const inserts = notInsertedAnswers.map(_ => {
        const res: Prisma.KoboAnswersUncheckedCreateInput = {
          formId,
          answers: _.answers,
          id: _.id,
          uuid: _.uuid,
          date: _.date,
          start: _.start,
          end: _.end,
          submissionTime: _.submissionTime,
          validationStatus: _.validationStatus,
          lastValidatedTimestamp: _.lastValidatedTimestamp,
          validatedBy: _.validatedBy,
          version: _.version,
          // source: serverId,
          attachments: _.attachments,
        }
        return res
      })
      await this.prisma.koboAnswers.createMany({
        data: inserts,
        skipDuplicates: true,
      })
      return notInsertedAnswers
    }

    const handleUpdate = async () => {
      const answersToUpdate = seq([...localAnswersIndex]).map(([id, uuid]) => {
        const match = remoteIdsIndex.get(id)
        const hasBeenUpdated = match && match.uuid !== uuid
        return hasBeenUpdated ? match : undefined
      }).compact()
      this.debug(formId, `Handle update (${answersToUpdate.length})...`)
      const previewsAnswersById = await this.prisma.koboAnswers.findMany({
        select: {id: true, answers: true},
        where: {id: {in: answersToUpdate.map(_ => _.id)}}
      }).then(_ => seq(_).groupByAndApply(_ => _.id, _ => _[0].answers as Record<string, any>))
      await Promise.all(answersToUpdate.map(a => {
        this.event.emit(GlobalEvent.Event.KOBO_ANSWER_EDITED_FROM_KOBO, {
          formId,
          answerIds: [a.id],
          answer: Util.getObjectDiff({before: previewsAnswersById[a.id], after: a.answers, skipProperties: ['instanceID', 'rootUuid', 'deprecatedID']})
        })
        return this.prisma.koboAnswers.update({
          where: {
            id: a.id,
          },
          data: {
            uuid: a.uuid,
            validationStatus: a.validationStatus,
            attachments: a.attachments,
            date: a.date,
            start: a.start,
            end: a.end,
            submissionTime: a.submissionTime,
            answers: a.answers,
          }
        })
      }))
      return answersToUpdate
    }

    const answersIdsDeleted = await handleDelete()
    const answersCreated = await handleCreate()
    const answersUpdated = await handleUpdate()

    return {
      answersIdsDeleted,
      answersCreated,
      answersUpdated,
    }
  }

  private readonly syncApiFormAnswers = logPerformance({
    logger: _ => this.log.info(_),
    message: (serverId, formId) => `Sync answers for ${KoboIndex.searchById(formId)?.translation ?? formId}.`,
    showResult: r => `${r.answersCreated.length} created, ${r.answersUpdated.length} updated, ${r.answersIdsDeleted.length} deleted.`,
    fn: this._syncApiFormAnswers,
  })
}
