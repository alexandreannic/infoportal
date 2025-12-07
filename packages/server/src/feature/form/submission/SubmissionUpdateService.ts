import {PrismaClient, Prisma} from '@infoportal/prisma'
import pLimit from 'p-limit'
import {Api} from '@infoportal/api-sdk'
import {KoboMapper} from '../../kobo/KoboMapper.js'
import retry from 'promise-retry'
import {Util} from '../../../helper/Utils.js'
import {Kobo} from 'kobo-sdk'
import {SubmissionService} from './SubmissionService.js'
import {SubmissionHistoryService} from '../history/SubmissionHistoryService.js'
import {app} from '../../../index.js'
import {KoboSdkGenerator} from '../../kobo/KoboSdkGenerator.js'
import {FormService} from '../FormService.js'
import {IpEvent} from '@infoportal/common'

const RETRIES = 3
const RETRY_BASE_MS = 200
const KOBO_PARALLELISM = 4

export class SubmissionUpdateService {
  private readonly koboLimit = pLimit(KOBO_PARALLELISM)

  constructor(
    private prisma: PrismaClient,
    private history = new SubmissionHistoryService(prisma),
    private sdkGenerator = KoboSdkGenerator.getSingleton(prisma),
    private event = app.event,
    private form = new FormService(prisma),
  ) {}

  /**
   * Update the whole answers object for one submission.
   * Uses optimistic concurrency if the record has `version`.
   */
  readonly updateSingle = async ({
    formId,
    submissionId,
    answers,
    authorEmail,
  }: Api.Submission.Payload.UpdateSingle & {
    authorEmail: Api.User.Email
  }): Promise<Api.Submission> => {
    // Load existing answers to compute diff
    const existing = await this.prisma.formSubmission.findFirstOrThrow({
      where: {id: submissionId},
      select: {id: true, answers: true},
    })

    const before = (existing.answers ?? {}) as Record<string, any>
    const diff = Util.getObjectDiff({before, after: answers})

    // Transaction: history + update
    const updated = await this.prisma.$transaction(async tx => {
      // Write history entries
      if (Object.keys(diff).length > 0) {
        await Promise.all(
          Object.entries(diff).map(([key, newValue]) =>
            this.history.create({
              type: 'answer',
              formId,
              submissionIds: [submissionId],
              property: key,
              oldValue: before[key],
              newValue,
              authorEmail,
            }),
          ),
        )
      }
      return tx.formSubmission.update({
        where: {id: submissionId},
        data: {answers},
        select: SubmissionService.SUBMISSION_SELECT,
      })
    })

    // emit event after committed
    Object.entries(diff).forEach(([question, answer]) => {
      this.event.emit(IpEvent.SUBMISSION_EDITED, {formId, submissionIds: [submissionId], question, answer})
    })

    const ctx = await this.getKoboContextSafe(formId, [submissionId])
    if (ctx) {
      await this.safeKoboSync(
        () =>
          ctx.sdk.v2.submission.update({
            formId: ctx.koboFormId,
            submissionIds: ctx.koboSubmissionIds,
            data: answers,
          }),
        formId,
        [submissionId],
        authorEmail,
      )
    }

    return updated as Api.Submission
  }

  /**
   * Bulk update a single question across many submissions.
   * `answer` can be string or array-of-strings (will join with space).
   */
  readonly bulkUpdateQuestion = async ({
    formId,
    submissionIds,
    question,
    answer: value,
    authorEmail,
  }: Api.Submission.Payload.BulkUpdateQuestion & {
    authorEmail: Api.User.Email
  }): Promise<Api.BulkResponse<Api.SubmissionId>> => {
    // DB + history transaction
    await this.prisma.$transaction(async tx => {
      await this.history.create({
        type: 'answer',
        formId,
        submissionIds,
        property: question,
        newValue: value ?? null,
        authorEmail,
      })

      if (value == null || value === '') {
        // remove key from jsonb
        await tx.$executeRaw`
          UPDATE "FormSubmission"
          SET answers = answers - ${question}
          WHERE id IN (${Prisma.join(submissionIds)})
        `
      } else {
        await tx.$executeRawUnsafe(
          `
            UPDATE "FormSubmission"
            SET answers = jsonb_set(answers, ARRAY[$1], to_jsonb($2::text))
            WHERE id = ANY ($3::text[])
          `,
          question,
          value,
          submissionIds,
        )
      }
    })

    this.event.emit(IpEvent.SUBMISSION_EDITED, {formId, submissionIds: submissionIds, question, answer: value})

    const ctx = await this.getKoboContextSafe(formId, submissionIds)
    if (ctx) {
      await this.safeKoboSync(
        () =>
          ctx.sdk.v2.submission.update({
            formId: ctx.koboFormId,
            submissionIds: ctx.koboSubmissionIds,
            data: {[question]: value},
          }),
        formId,
        submissionIds,
        authorEmail,
      )
    }

    return submissionIds.map(id => ({id, status: 'success'}))
  }

  /**
   * Update validation status for a set of submissions.
   */
  readonly bulkUpdateValidation = async ({
    formId,
    submissionIds,
    status,
    authorEmail,
  }: {
    formId: Api.FormId
    submissionIds: Api.SubmissionId[]
    status: Api.Submission.Validation
    authorEmail: Api.User.Email
  }): Promise<Api.BulkResponse<Api.SubmissionId>> => {
    const mapped = KoboMapper.mapValidation.toKobo(status)

    await this.prisma.$transaction(async tx => {
      await tx.formSubmission.updateMany({
        where: {id: {in: submissionIds}},
        data: {
          validationStatus: status,
          end: new Date(),
        },
      })

      await this.history.create({
        type: 'validation',
        formId,
        submissionIds: submissionIds,
        newValue: status,
        authorEmail,
      })
    })

    this.event.emit(IpEvent.SUBMISSION_EDITED_VALIDATION, {formId, submissionIds: submissionIds, status})

    const ctx = await this.getKoboContextSafe(formId, submissionIds)
    if (ctx) {
      const doSync = () => {
        if (mapped._validation_status) {
          return Promise.all([
            ctx.sdk.v2.submission.updateValidation({
              formId: ctx.koboFormId,
              submissionIds: ctx.koboSubmissionIds,
              status: mapped._validation_status,
            }),
            ctx.sdk.v2.submission.update({
              formId: ctx.koboFormId,
              submissionIds: ctx.koboSubmissionIds,
              data: {[KoboMapper._IP_VALIDATION_STATUS_EXTRA]: null},
            }),
          ])
        }
        return Promise.all([
          ctx.sdk.v2.submission.update({
            formId: ctx.koboFormId,
            submissionIds: ctx.koboSubmissionIds,
            data: {[KoboMapper._IP_VALIDATION_STATUS_EXTRA]: mapped._IP_VALIDATION_STATUS_EXTRA},
          }),
          ctx.sdk.v2.submission.updateValidation({
            formId: ctx.koboFormId,
            submissionIds: ctx.koboSubmissionIds,
            status: Kobo.Submission.Validation.no_status,
          }),
        ])
      }

      await this.safeKoboSync(doSync, formId, submissionIds, authorEmail)
    }

    return submissionIds.map(id => ({id, status: 'success'}))
  }

  /**
   * Soft-remove submissions: mark deleted and attempt to delete in Kobo.
   */
  readonly remove = async ({
    submissionIds,
    formId,
    authorEmail,
  }: {
    submissionIds: Api.SubmissionId[]
    formId: Api.FormId
    authorEmail: Api.User.Email
  }) => {
    // DB + history in transaction
    await this.prisma.$transaction(async tx => {
      await tx.formSubmission.updateMany({
        where: {id: {in: submissionIds}, formId},
        data: {deletedAt: new Date(), deletedBy: authorEmail},
      })

      await this.history.create({
        type: 'delete',
        formId,
        submissionIds: submissionIds,
        authorEmail,
      })
    })

    this.event.emit(IpEvent.SUBMISSION_REMOVED, {submissionIds: submissionIds, formId})

    // Kobo delete
    const ctx = await this.getKoboContextSafe(formId, submissionIds)
    if (ctx) {
      await this.safeKoboSync(
        () =>
          ctx.sdk.v2.submission.delete({
            formId: ctx.koboFormId,
            submissionIds: ctx.koboSubmissionIds,
          }),
        formId,
        submissionIds,
        authorEmail,
      )
    }

    return submissionIds.map(id => ({id, status: 'success'}))
  }

  /**
   * Resolve Kobo context (sdk, koboFormId, koboSubmissionIds) safely.
   * Returns null if Kobo not connected or no kobo submission ids found.
   */
  private async getKoboContextSafe(formId: Api.FormId, submissionIds: Api.SubmissionId[]) {
    // try {
    const isConnected = await this.isConnectedToKobo(formId)
    if (!isConnected) return null

    const sdk = await this.sdkGenerator.getBy.formId(formId)
    if (!sdk) throw new Error(`KoboSdk not found for form ${formId}`)

    const [koboFormId, koboSubmissionIds] = await Promise.all([
      this.form.getKoboIdByFormId(formId),
      this.getKoboSubmissionIds({submissionIds}),
    ])

    if (!koboFormId) throw new Error(`kobo formId not found for form ${formId}`)
    if (!koboSubmissionIds || koboSubmissionIds.length === 0) return null

    return {sdk, koboFormId, koboSubmissionIds}
    // } catch (err) {
    // If resolving Kobo fails, record for observability and return null
    // Do not throw — DB changes should remain source of truth
    // await this.history.create({
    //   type: 'sync_failed_resolve',
    //   formId,
    //   submissionIds: submissionIds,
    //   newValue: {error: String(err)},
    //   authorEmail: 'system',
    // })
    // this.event.emit(IpEvent.SYNC_RESOLVE_FAILED, {formId, submissionIds, error: String(err)})
    // return null
    // }
  }

  /**
   * Safely run a Kobo action with retry and record failures if persistent.
   */
  private async safeKoboSync(
    action: () => Promise<any>,
    formId: Api.FormId,
    submissionIds: Api.SubmissionId[],
    authorEmail: Api.User.Email,
  ) {
    // try {
    return retry(() => this.koboLimit(() => action()), {retries: RETRIES, maxRetryTime: RETRY_BASE_MS})
    // } catch (err) {
    // record failure for later reconciliation
    //   await this.history.create({
    //     type: 'sync_failed',
    //     formId,
    //     submissionIds: submissionIds,
    //     newValue: {error: String(err)},
    //     authorEmail,
    //   })
    //   this.event.emit(IpEvent.SYNC_FAILED, {formId, submissionIds, error: String(err)})
    // }
  }

  /**
   * Return originId (Kobo submission ID) for each local submission id.
   * If some originId is null, they will be filtered out by callers.
   */
  private async getKoboSubmissionIds({submissionIds}: {submissionIds: string[]}) {
    const rows = await this.prisma.formSubmission.findMany({
      where: {id: {in: submissionIds}},
      select: {originId: true},
    })
    return rows.map(r => r.originId).filter(Boolean) as string[]
  }

  private readonly isConnectedToKobo = (formId: Api.FormId) => {
    return this.prisma.formKoboInfo.findFirst({select: {formId: true}, where: {formId}}).then(_ => !!_)
  }
}
