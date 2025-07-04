import {seq} from '@axanc/ts-utils'
import {KoboForm, Prisma, PrismaClient} from '@prisma/client'
import {PromisePool} from '@supercharge/promise-pool'
import {UUID} from 'infoportal-common'
import {Kobo, KoboClient} from 'kobo-sdk'
import {appConf} from '../../core/conf/AppConf.js'
import {app, AppCacheKey} from '../../index.js'
import {KoboSdkGenerator} from './KoboSdkGenerator.js'

export interface KoboFormCreate {
  uid: string
  serverId: UUID
  uploadedBy: string
  workspaceId: UUID
}

export class KoboFormService {
  constructor(
    private prisma: PrismaClient,
    private koboSdk = KoboSdkGenerator.getSingleton(prisma),
    private cache = app.cache,
    private conf = appConf,
  ) {}

  static readonly apiToDb = ({
    schema,
    serverId,
    uploadedBy,
    workspaceId,
  }: {
    schema: Kobo.Form
    serverId: UUID
    workspaceId: UUID
    uploadedBy: string
  }): Prisma.KoboFormUncheckedCreateInput => {
    return {
      name: schema.name,
      id: schema.uid,
      serverId: serverId,
      deploymentStatus: schema.deployment_status,
      uploadedBy: uploadedBy,
      workspaces: {connect: {id: workspaceId}},
    }
  }

  readonly add = async (payload: KoboFormCreate) => {
    const sdk = await this.koboSdk.getBy.serverId(payload.serverId)
    const schema = await sdk.v2.form.get({formId: payload.uid, use$autonameAsName: true})
    const [newFrom] = await Promise.all([
      this.prisma.koboForm.create({
        data: KoboFormService.apiToDb({
          schema,
          serverId: payload.serverId,
          uploadedBy: payload.uploadedBy,
          workspaceId: payload.workspaceId,
        }),
      }),
      this.createHookIfNotExists(sdk, payload.uid),
    ])
    this.cache.clear(AppCacheKey.KoboServerIndex)
    this.cache.clear(AppCacheKey.KoboClient)
    return newFrom
  }

  static readonly HOOK_NAME = 'InfoPortal'

  private createHookIfNotExists = async (sdk: KoboClient, formId: Kobo.FormId) => {
    const hooks = await sdk.v2.hook.get({formId})
    if (hooks.results.find(_ => _.name === KoboFormService.HOOK_NAME)) return
    return sdk.v2.hook.create({
      formId,
      destinationUrl: this.conf.baseUrl + `/kobo-api/webhook`,
      name: KoboFormService.HOOK_NAME,
    })
  }

  readonly registerHooksForAll = async () => {
    const forms = await this.prisma.koboForm.findMany()
    const sdks = await Promise.all(
      seq(forms)
        .distinct(_ => _.serverId)
        .get()
        .map(server =>
          this.koboSdk.getBy.serverId(server.serverId).then(_ => ({
            serverId: server.serverId,
            sdk: _,
          })),
        ),
    ).then(_ => seq(_).reduceObject<Record<string, KoboClient>>(_ => [_.serverId!, _.sdk]))
    await Promise.all(
      forms.map(async form =>
        this.createHookIfNotExists(sdks[form.serverId], form.id).catch(() => console.log(`Not created ${form.id}`)),
      ),
    )
  }

  readonly get = async (id: Kobo.FormId): Promise<KoboForm | undefined> => {
    return (await this.prisma.koboForm.findFirst({where: {id}})) ?? undefined
  }

  readonly getAll = async ({wsId}: {wsId: UUID}): Promise<KoboForm[]> => {
    return this.prisma.koboForm.findMany({
      include: {
        server: true,
      },
      where: {
        workspaces: {
          some: {
            id: wsId,
          },
        },
      },
    })
  }

  readonly refreshAll = async ({byEmail, wsId}: {byEmail: string; wsId: UUID}) => {
    const forms = await this.getAll({wsId}).then(seq)
    const sdks = await Promise.all(
      forms
        .map(_ => _.serverId)
        .distinct(_ => _)
        .map(_ => this.koboSdk.getBy.serverId(_))
        .get(),
    )
    const indexForm = seq(forms).groupByFirst(_ => _.id)
    const indexSchema = await Promise.all(sdks.map(_ => _.v2.form.getAll()))
      .then(_ => _.flatMap(_ => _.results))
      .then(_ => seq(_).groupByFirst(_ => _.uid))
    await PromisePool.withConcurrency(this.conf.db.maxConcurrency)
      .for(forms)
      .handleError(async error => {
        throw error
      })
      .process(form => {
        const db = KoboFormService.apiToDb({
          schema: indexSchema[form.id],
          serverId: indexForm[form.id].serverId,
          uploadedBy: byEmail,
          workspaceId: wsId,
        })
        return this.prisma.koboForm.update({
          data: db,
          where: {
            id: form.id,
          },
        })
      })
  }
}
