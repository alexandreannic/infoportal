import {genUUID, IpEvent, logPerformance, UUID} from '@infoportal/common'
import {PrismaClient} from '@infoportal/prisma'
import {KoboSdkGenerator} from './KoboSdkGenerator.js'
import {app, AppCacheKey, AppLogger} from '../../index.js'
import {createdBySystem} from '../../core/DbInit.js'
import {chunkify, seq} from '@axanc/ts-utils'
import {SubmissionService} from '../form/submission/SubmissionService.js'
import {HttpError, Api} from '@infoportal/api-sdk'
import {appConf} from '../../core/AppConf.js'
import {previewList} from '../../helper/Utils.js'
import {Kobo, KoboSubmissionFormatter} from 'kobo-sdk'
import {KoboMapper} from './KoboMapper.js'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export type KoboInsert = {
  id: Api.SubmissionId
  formId: Api.FormId
  originId: Kobo.SubmissionId
  // koboFormId: Kobo.FormId
  uuid: string
  start: Date
  end: Date
  submissionTime: Date
  submittedBy?: string
  version?: string
  validationStatus?: Api.Submission.Validation
  validatedBy?: string
  lastValidatedTimestamp?: number
  geolocation: [number, number]
  answers: Record<string, any>
  attachments: Kobo.Submission.Attachment[]
  deletedAt?: Date
  deletedBy?: Api.User.Email
}

export type KoboSyncServerResult = {
  answersIdsDeleted: Kobo.FormId[]
  answersCreated: KoboInsert[]
  answersUpdated: KoboInsert[]
  validationUpdated: KoboInsert[]
}

export class KoboSyncServer {
  constructor(
    private prisma: PrismaClient,
    private service = new SubmissionService(prisma),
    private koboSdkGenerator: KoboSdkGenerator = KoboSdkGenerator.getSingleton(prisma),
    private event = app.event,
    private appCache = app.cache,
    private conf = appConf,
    private log: AppLogger = app.logger('KoboSyncServer'),
  ) {}

  private static readonly mapAnswer = (formId: Api.FormId, k: Kobo.Submission.Raw): KoboInsert => {
    const {
      ['formhub/uuid']: formhubUuid,
      ['meta/instanceId']: instanceId,
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
    const answersUngrouped = KoboSubmissionFormatter.removePath(answers)
    const date = answersUngrouped.date ? new Date(answersUngrouped.date as number) : new Date(_submission_time)
    return {
      id: SubmissionService.genId(),
      originId: '' + _id,
      // koboFormId: _xform_id_string,
      attachments: _attachments ?? [],
      geolocation: _geolocation.filter(_ => _ !== null) as [number, number],
      start: start ?? date,
      end: end ?? date,
      submissionTime: new Date(_submission_time),
      version: __version__,
      uuid: _uuid,
      submittedBy: _submitted_by,
      validationStatus: KoboMapper.mapValidation.fromKobo(k),
      lastValidatedTimestamp: _validation_status?.timestamp,
      formId,
      // validatedBy: _validation_status?.by_whom,
      answers: answersUngrouped,
    }
  }

  readonly handleWebhookNewAnswers = async ({
    koboFormId,
    answer: _answer,
  }: {
    koboFormId?: Kobo.FormId
    answer: Kobo.Submission
  }) => {
    if (!koboFormId) throw new HttpError.WrongFormat('missing_form_id')
    const connectedForms = await this.prisma.form
      .findMany({
        select: {workspaceId: true, id: true},
        where: {kobo: {koboId: koboFormId}},
      })
      .then(_ => _.map(prismaMapper.form.mapForm))
    this.log.info(`Handle webhook for form ${koboFormId}, ${_answer._id}`)
    connectedForms.map(_ => {
      const answers = KoboSyncServer.mapAnswer(_.id, _answer)
      return this.service.create({
        // formId: _.id,
        workspaceId: _.workspaceId as Api.WorkspaceId,
        data: answers,
      })
    })
  }

  readonly syncApiAnswersToDbAll = async (updatedBy: Api.User.Email = createdBySystem) => {
    const allForms = await this.prisma.formKoboInfo.findMany()
    this.log.info(`Synchronize kobo forms:`)
    for (const form of allForms) {
      try {
        await this.syncApiAnswersToDbByForm({formId: form.formId as Api.FormId, updatedBy})
      } catch (e) {
        console.error(e)
      }
    }
    this.log.info(`Synchronize kobo forms finished!`)
  }

  private info = (formId: string, message: string) => this.log.info(`${formId}: ${message}`)
  private debug = (formId: string, message: string) => this.log.debug(`${formId}: ${message}`)

  readonly syncApiAnswersToDbByForm = async ({formId, updatedBy}: {formId: Api.FormId; updatedBy?: Api.User.Email}) => {
    const koboFormId = await this.prisma.formKoboInfo
      .findFirst({select: {koboId: true}, where: {formId}})
      .then(_ => _?.koboId)
    if (!koboFormId) throw new HttpError.BadRequest(`Form ${formId} is not connected to a Kobo form.`)

    try {
      this.debug(formId, `Synchronizing by ${updatedBy}...`)
      await this.syncApiFormInfo({formId, koboFormId})
      const res = await this.syncApiFormAnswers({formId, koboFormId})
      await this.prisma.$transaction([
        this.prisma.form.update({
          where: {id: formId},
          data: {
            updatedAt: new Date(),
            updatedBy: updatedBy,
          },
        }),
      ])
      this.log.info(formId, `Synchronizing by ${updatedBy}... COMPLETED.`)
      if (
        !this.conf.production ||
        res.answersIdsDeleted.length + res.answersUpdated.length + res.answersIdsDeleted.length > 0
      ) {
        this.event.emit(IpEvent.KOBO_FORM_SYNCHRONIZED, {formId})
      }
      this.appCache.clear(AppCacheKey.KoboAnswers, formId)
      this.appCache.clear(AppCacheKey.KoboSchema, formId)
    } catch (e) {
      this.log.info(formId, `Synchronizing by ${updatedBy}... FAILED.`)
      throw e
    }
  }

  private readonly syncApiFormInfo = async ({formId, koboFormId}: {koboFormId: Kobo.FormId; formId: Api.FormId}) => {
    const sdk = await this.koboSdkGenerator.getBy.koboFormId(koboFormId)
    const schema = await sdk.v2.form.get({formId: koboFormId, use$autonameAsName: true})
    await Promise.all([
      this.prisma.form.updateMany({
        where: {
          id: formId,
        },
        data: {
          name: schema.name,
          deploymentStatus: schema.deployment_status,
        },
      }),
      this.prisma.formKoboInfo.updateMany({
        where: {koboId: koboFormId},
        data: {
          enketoUrl: schema.deployment__links.offline_url,
        },
      }),
    ])
  }

  private readonly _syncApiFormAnswers = async ({
    formId,
    koboFormId,
  }: {
    formId: Api.FormId
    koboFormId: Kobo.FormId
  }): Promise<KoboSyncServerResult> => {
    const sdk = await this.koboSdkGenerator.getBy.koboFormId(koboFormId)

    this.debug(koboFormId, `Fetch remote answers...`)
    const remoteAnswers = await sdk.v2.submission
      .getRaw({formId: koboFormId})
      .then(_ => _.results.map(_ => KoboSyncServer.mapAnswer(formId, _)))
    const remoteIdsIndex: Map<Kobo.FormId, KoboInsert> = remoteAnswers.reduce(
      (map, curr) => map.set(curr.originId, curr),
      new Map<Kobo.FormId, KoboInsert>(),
    )
    this.debug(koboFormId, `Fetch remote answers... ${remoteAnswers.length} fetched.`)

    this.debug(koboFormId, `Fetch local answers...`)
    const localAnswersIndex = await this.prisma.formSubmission
      .findMany({
        where: {formId, deletedAt: null, originId: {not: null}},
        select: {originId: true, lastValidatedTimestamp: true, uuid: true},
      })
      .then(_ => {
        return _.reduce(
          (map, {originId, ...rest}) => map.set(originId!, rest),
          new Map<Kobo.SubmissionId, {lastValidatedTimestamp: null | number; uuid: UUID}>(),
        )
      })
    this.debug(koboFormId, `Fetch local answers... ${localAnswersIndex.size} fetched.`)

    const handleDelete = async () => {
      const idsToDelete = [...localAnswersIndex.keys()].filter(_ => !remoteIdsIndex.has(_))
      const tracker = genUUID().slice(0, 5)
      this.info(koboFormId, `Handle delete ${tracker} (${idsToDelete.length})...`)
      if (idsToDelete.length) {
        this.info(
          koboFormId,
          `Handle delete ${tracker} - localAnswersIndex: ${localAnswersIndex.size} - remoteIdsIndex: ${remoteIdsIndex.size}`,
        )
        this.info(koboFormId, `Handle delete ${tracker} - idsToDelete: ${previewList(idsToDelete)}`)
      }
      await chunkify({
        concurrency: 1,
        data: idsToDelete,
        size: this.conf.db.maxPreparedStatementParams,
        fn: ids => {
          return this.prisma.formSubmission.updateMany({
            data: {
              deletedAt: new Date(),
              deletedBy: 'system-sync-' + tracker,
            },
            where: {formId, id: {in: ids}},
          })
        },
      })
      return idsToDelete
    }

    const handleCreate = async () => {
      const notInsertedAnswers = remoteAnswers.filter(_ => !localAnswersIndex.has(_.originId))
      this.debug(koboFormId, `Handle create (${notInsertedAnswers.length})...`)
      await this.service.createMany({data: notInsertedAnswers as any, skipDuplicates: true})
      return notInsertedAnswers
    }

    const handleValidation = async () => {
      const answersToUpdate = seq([...localAnswersIndex])
        .map(([id, index]) => {
          const match = remoteIdsIndex.get(id)
          const hasBeenUpdated = match && (match.lastValidatedTimestamp ?? null) !== index.lastValidatedTimestamp
          return hasBeenUpdated ? match : undefined
        })
        .compact()
      this.debug(koboFormId, `Handle validation (${answersToUpdate.length})...`)
      await Promise.all(
        answersToUpdate.map(a => {
          // this.event.emit(IpEvent.KOBO_VALIDATION_EDITED_FROM_KOBO, {
          //   formId,
          //   submissionIds: [a.id],
          //   status: a.validationStatus,
          // })
          return this.prisma.formSubmission.updateMany({
            where: {formId, originId: a.originId},
            data: {
              validationStatus: a.validationStatus,
              lastValidatedTimestamp: a.lastValidatedTimestamp,
            },
          })
        }),
      )
      return answersToUpdate
    }

    const handleUpdate = async () => {
      const answersToUpdate = seq([...localAnswersIndex])
        .map(([id, index]) => {
          const match = remoteIdsIndex.get(id)
          const hasBeenUpdated = match && match.uuid !== index.uuid
          return hasBeenUpdated ? match : undefined
        })
        .compact()
      this.debug(koboFormId, `Handle update (${answersToUpdate.length})...`)
      // const previewsAnswersById = await this.prisma.formSubmission
      //   .findMany({
      //     select: {id: true, answers: true},
      //     where: {id: {in: answersToUpdate.map(_ => _.id)}},
      //   })
      //   .then(_ =>
      //     seq(_).groupByAndApply(
      //       _ => _.id,
      //       _ => _[0].answers as Record<string, any>,
      //     ),
      //   )
      await Promise.all(
        answersToUpdate.map(a => {
          // this.event.emit(IpEvent.KOBO_ANSWER_EDITED_FROM_KOBO, {
          //   formId,
          //   submissionIds: [a.id],
          //   answer: Util.getObjectDiff({
          //     before: previewsAnswersById[a.id],
          //     after: a.answers,
          //     skipProperties: ['instanceID', 'rootUuid', 'deprecatedID'],
          //   }),
          // })
          return this.prisma.formSubmission.updateMany({
            where: {
              // originId_formId: {
              originId: a.originId,
              formId,
              // },
            },
            data: {
              uuid: a.uuid,
              attachments: a.attachments,
              start: a.start,
              end: a.end,
              answers: a.answers,
            },
          })
        }),
      )
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
    message: formId => `Sync answers for ${formId}.`,
    showResult: r =>
      `${r.answersCreated.length} created, ${r.answersUpdated.length} updated, ${r.answersIdsDeleted.length} deleted.`,
    fn: this._syncApiFormAnswers,
  })
}
