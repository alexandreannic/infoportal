import {KoboHelper, KoboIndex, KoboSubmission, logPerformance, UUID} from 'infoportal-common'
import {Prisma, PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from '../KoboSdkGenerator'
import {app, AppCacheKey, AppLogger} from '../../../index'
import {createdBySystem} from '../../../core/DbInit'
import {seq} from '@alexandreannic/ts-utils'
import {GlobalEvent} from '../../../core/GlobalEvent'
import {KoboService} from '../KoboService'
import {AppError} from '../../../helper/Errors'
import {appConf} from '../../../core/conf/AppConf'
import {genUUID, Util} from '../../../helper/Utils'
import {Kobo} from 'kobo-sdk'

export type KoboSyncServerResult = {
  answersIdsDeleted: Kobo.FormId[]
  answersCreated: KoboSubmission[]
  answersUpdated: KoboSubmission[]
  validationUpdated: KoboSubmission[]
}

export class KoboSyncServer {

  constructor(
    private prisma: PrismaClient,
    private service = new KoboService(prisma),
    private koboSdkGenerator: KoboSdkGenerator = KoboSdkGenerator.getSingleton(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private appCache = app.cache,
    private conf = appConf,
    private log: AppLogger = app.logger('KoboSyncServer'),
  ) {
  }

  private static readonly removeGroup = (answers: Record<string, any>): Record<string, any> => {
    return seq(Object.entries(answers)).reduceObject(([k, v]) => {
      const nameWithoutGroup = k.replace(/^.*\//, '')
      if (Array.isArray(v)) {
        return [nameWithoutGroup, v.map(KoboSyncServer.removeGroup)]
      }
      return [nameWithoutGroup, v]
    })
  }

  private static readonly mapAnswer = (k: Kobo.Submission): KoboSubmission => {
    delete k['formhub/uuid']
    delete k['meta/instanceId']
    const {
      _id,
      start,
      end,
      __version__,
      _xform_id_string,
      _uuid,
      _attachments,
      _status,
      _geolocation,
      _submission_time,
      _tags,
      _notes,
      _validation_status,
      _submitted_by,
      ...answers
    } = k
    const answersUngrouped = KoboSyncServer.removeGroup(answers)
    const date = answersUngrouped.date ? new Date(answersUngrouped.date) : new Date(_submission_time)
    return {
      attachments: _attachments ?? [],
      geolocation: _geolocation,
      date: date,
      start: start ?? date,
      end: end ?? date,
      submissionTime: new Date(_submission_time),
      version: __version__,
      id: '' + _id,
      uuid: _uuid,
      submittedBy: _submitted_by,
      validationStatus: KoboHelper.mapValidation.fromKobo(k),
      lastValidatedTimestamp: _validation_status?.timestamp,
      validatedBy: _validation_status?.by_whom,
      answers: answersUngrouped,
    }
  }

  readonly handleWebhookNewAnswers = async ({formId, answer: _answer}: {formId?: Kobo.FormId, answer: Kobo.Submission}) => {
    const answer = KoboSyncServer.mapAnswer(_answer)
    this.log.info(`Handle webhook for form ${formId}, ${answer.id}`)
    if (!formId)
      throw new AppError.WrongFormat('missing_form_id')
    const connectedForm = this.prisma.koboForm.findFirst({where: {id: formId}})
    if (!connectedForm) {
      throw new AppError.NotFound('form_not_found')
    }
    this.event.emit(GlobalEvent.Event.KOBO_ANSWER_NEW, {
      formId,
      answerIds: [answer.id],
      answer: answer.answers,
    })
    return this.service.create(formId, answer)
  }

  readonly syncApiAnswersToDbAll = async (updatedBy: string = createdBySystem) => {
    const allForms = await this.prisma.koboForm.findMany()
    this.log.info(`Synchronize kobo forms:`)
    for (const form of allForms) {
      try {
        await this.syncApiAnswersToDbByForm({formId: form.id, updatedBy})
      } catch (e) {
        console.error(e)
      }
    }
    this.log.info(`Synchronize kobo forms finished!`)
  }

  private info = (formId: string, message: string) => this.log.info(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)
  private debug = (formId: string, message: string) => this.log.debug(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)

  readonly syncApiAnswersToDbByForm = async ({formId, updatedBy}: {formId: Kobo.FormId, updatedBy?: string}) => {
    try {
      this.debug(formId, `Synchronizing by ${updatedBy}...`)
      await this.syncApiFormInfo(formId)
      const res = await this.syncApiFormAnswers(formId)
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

  private readonly syncApiFormInfo = async (formId: Kobo.FormId) => {
    const sdk = await this.koboSdkGenerator.getBy.formId(formId)
    const schema = await sdk.v2.getForm(formId)
    return this.prisma.koboForm.update({
      where: {id: formId},
      data: {
        name: schema.name,
        deploymentStatus: schema.deployment_status
      }
    })
  }

  private readonly _syncApiFormAnswers = async (formId: Kobo.FormId): Promise<KoboSyncServerResult> => {
    const sdk = await this.koboSdkGenerator.getBy.formId(formId)
    this.debug(formId, `Fetch remote answers...`)
    const remoteAnswers = await sdk.v2.getAnswers(formId).then(_ => _.results.map(KoboSyncServer.mapAnswer))
    const remoteIdsIndex: Map<Kobo.FormId, KoboSubmission> = remoteAnswers.reduce((map, curr) => map.set(curr.id, curr), new Map<Kobo.FormId, KoboSubmission>)//new Map(remoteAnswers.map(_ => _.id))
    this.debug(formId, `Fetch remote answers... ${remoteAnswers.length} fetched.`)

    this.debug(formId, `Fetch local answers...`)
    const localAnswersIndex = await this.prisma.koboAnswers.findMany({where: {formId, deletedAt: null}, select: {id: true, lastValidatedTimestamp: true, uuid: true}}).then(_ => {
      return _.reduce((map, {id, ...rest}) => map.set(id, rest), new Map<Kobo.FormId, {lastValidatedTimestamp: null | number, uuid: UUID}>())
    })
    this.debug(formId, `Fetch local answers... ${localAnswersIndex.size} fetched.`)

    const handleDelete = async () => {
      const idsToDelete = [...localAnswersIndex.keys()].filter(_ => !remoteIdsIndex.has(_))
      const tracker = genUUID().slice(0, 5)
      this.info(formId, `Handle delete ${tracker} (${idsToDelete.length})...`)
      if (idsToDelete.length) {
        this.info(formId, `Handle delete ${tracker} - localAnswersIndex: ${localAnswersIndex.size} - remoteIdsIndex: ${remoteIdsIndex.size}`)
        this.info(formId, `Handle delete ${tracker} - idsToDelete: ${idsToDelete.join(',')}`)
      }

      await this.prisma.koboAnswers.updateMany({
        data: {
          deletedAt: new Date(),
          deletedBy: 'system-sync-' + tracker,
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
        this.event.emit(GlobalEvent.Event.KOBO_ANSWER_NEW, {
          formId,
          answerIds: [_.id],
          answer: _.answers,
        })
        return res
      })
      await this.prisma.koboAnswers.createMany({
        data: inserts,
        skipDuplicates: true,
      })
      return notInsertedAnswers
    }

    const handleValidation = async () => {
      const answersToUpdate = seq([...localAnswersIndex]).map(([id, index]) => {
        const match = remoteIdsIndex.get(id)
        const hasBeenUpdated = match && match.lastValidatedTimestamp !== index.lastValidatedTimestamp
        return hasBeenUpdated ? match : undefined
      }).compact()
      this.debug(formId, `Handle validation (${answersToUpdate.length})...`)
      await Promise.all(answersToUpdate.map(a => {
        this.event.emit(GlobalEvent.Event.KOBO_VALIDATION_EDITED_FROM_KOBO, {
          formId,
          answerIds: [a.id],
          status: a.validationStatus,
        })
        return this.prisma.koboAnswers.update({
          where: {id: a.id,},
          data: {
            validationStatus: a.validationStatus,
            lastValidatedTimestamp: a.lastValidatedTimestamp,
          }
        })
      }))
      return answersToUpdate
    }

    const handleUpdate = async () => {
      const answersToUpdate = seq([...localAnswersIndex]).map(([id, index]) => {
        const match = remoteIdsIndex.get(id)
        const hasBeenUpdated = match && match.uuid !== index.uuid
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
          answer: Util.getObjectDiff({
            before: previewsAnswersById[a.id],
            after: a.answers,
            skipProperties: ['instanceID', 'rootUuid', 'deprecatedID']
          })
        })
        return this.prisma.koboAnswers.update({
          where: {
            id: a.id,
          },
          data: {
            uuid: a.uuid,
            attachments: a.attachments,
            date: a.date,
            start: a.start,
            end: a.end,
            answers: a.answers,
          }
        })
      }))
      return answersToUpdate
    }

    const answersIdsDeleted = await handleDelete()
    const answersCreated = await handleCreate()
    const answersUpdated = await handleUpdate()
    const validationUpdated = await handleValidation()

    return {
      answersIdsDeleted,
      answersCreated,
      answersUpdated,
      validationUpdated,
    }
  }

  private readonly syncApiFormAnswers = logPerformance({
    logger: _ => this.log.info(_),
    message: (formId) => `Sync answers for ${KoboIndex.searchById(formId)?.translation ?? formId}.`,
    showResult: r => `${r.answersCreated.length} created, ${r.answersUpdated.length} updated, ${r.answersIdsDeleted.length} deleted.`,
    fn: this._syncApiFormAnswers,
  })
}
