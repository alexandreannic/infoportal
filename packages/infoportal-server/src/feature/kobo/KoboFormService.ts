import {seq} from '@axanc/ts-utils'
import {PrismaClient} from '@prisma/client'
import {PromisePool} from '@supercharge/promise-pool'
import {Kobo, KoboClient} from 'kobo-sdk'
import {appConf} from '../../core/conf/AppConf.js'
import {app, AppCacheKey} from '../../index.js'
import {KoboSdkGenerator} from './KoboSdkGenerator.js'
import {Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'
import {FormService, FormServiceCreatePayload} from '../form/FormService.js'

export class KoboFormService {
  constructor(
    private prisma: PrismaClient,
    private koboSdk = KoboSdkGenerator.getSingleton(prisma),
    private form = new FormService(prisma),
    private cache = app.cache,
    private conf = appConf,
  ) {}

  static readonly apiToDb = ({
    schema,
    accountId,
    uploadedBy,
    workspaceId,
  }: {
    schema: Kobo.Form
    accountId: Ip.ServerId
    workspaceId: Ip.WorkspaceId
    uploadedBy: Ip.User.Email
  }): FormServiceCreatePayload => {
    return {
      name: schema.name,
      deploymentStatus: schema.deployment_status,
      kobo: {
        accountId,
        formId: schema.uid,
      },
      uploadedBy: uploadedBy,
      workspaceId,
    }
  }

  static readonly HOOK_NAME = 'InfoPortal'

  readonly importFromKobo = async (
    payload: Ip.Form.Payload.Import & {uploadedBy: Ip.User.Email; workspaceId: Ip.WorkspaceId},
  ): Promise<Ip.Form> => {
    const sdk = await this.koboSdk.getBy.accountId(payload.serverId)
    const schema = await sdk.v2.form.get({formId: payload.uid, use$autonameAsName: true})
    const [newFrom] = await Promise.all([
      this.form.create(
        KoboFormService.apiToDb({
          schema,
          accountId: payload.serverId,
          uploadedBy: payload.uploadedBy,
          workspaceId: payload.workspaceId,
        }),
      ),
      // this.prisma.form.create({
      //   include: {
      //     kobo: true,
      //   },
      //   data: KoboFormService.apiToDb({
      //     schema,
      //     accountId: payload.serverId,
      //     uploadedBy: payload.uploadedBy,
      //     workspaceId: payload.workspaceId,
      //   }),
      // }),
      this.createHookIfNotExists({sdk, koboFormId: payload.uid}),
    ])
    this.cache.clear(AppCacheKey.KoboServerIndex)
    this.cache.clear(AppCacheKey.KoboClient)
    return PrismaHelper.mapForm(newFrom)
  }

  readonly deleteHookIfExists = async ({formId, sdk}: {formId: Kobo.FormId; sdk?: KoboClient}) => {
    if (!sdk) sdk = await this.koboSdk.getBy.koboFormId(formId)
    await sdk.v2.hook.deleteByName({formId, name: KoboFormService.HOOK_NAME}).catch(() => {})
  }

  readonly update = async ({formId, archive}: Ip.Form.Payload.Update) => {
    const koboFormId = await this.prisma.form
      .findFirst({where: {id: formId, kobo: {isNot: null}}, select: {kobo: true}})
      .then(_ => _?.kobo?.koboId)
    if (!koboFormId) return

    const sdk = await this.koboSdk.getBy.koboFormId(koboFormId)

    const queries: Promise<any>[] = []

    if (archive) {
      queries.push(this.deleteHookIfExists({formId: koboFormId, sdk}))
    } else if (archive === false) {
      queries.push(this.createHookIfNotExists({koboFormId: koboFormId, sdk}))
    }
    if (archive !== undefined) {
      queries.push(sdk.v2.form.updateDeployment({formId: koboFormId, active: !archive}))
    }
    await Promise.all(queries)
  }

  readonly createHookIfNotExists = async ({sdk, koboFormId}: {koboFormId: Kobo.FormId; sdk?: KoboClient}) => {
    if (!sdk) sdk = await this.koboSdk.getBy.koboFormId(koboFormId)
    const hooks = await sdk.v2.hook.get({formId: koboFormId})
    if (hooks.results.find(_ => _.name === KoboFormService.HOOK_NAME)) return
    return sdk.v2.hook.create({
      formId: koboFormId,
      destinationUrl: this.conf.baseUrl + `/kobo-api/webhook`,
      name: KoboFormService.HOOK_NAME,
    })
  }

  // readonly registerHooksForAll = async () => {
  //   const forms = await this.prisma.form.findMany({where: {kobo: {isNot: null}}}).then(_ => seq(_).compactBy('serverId'))
  //   const sdks = await Promise.all(
  //     seq(forms)
  //       .distinct(_ => _.serverId)
  //       .get()
  //       .map(server =>
  //         this.koboSdk.getBy.serverId(server.serverId).then(_ => ({
  //           serverId: server.serverId,
  //           sdk: _,
  //         })),
  //       ),
  //   ).then(_ => seq(_).reduceObject<Record<string, KoboClient>>(_ => [_.serverId!, _.sdk]))
  //   await Promise.all(
  //     forms.map(async form =>
  //       this.createHookIfNotExists({sdk: sdks[form.serverId], formId: form.id}).catch(() =>
  //         console.log(`Not created ${form.id}`),
  //       ),
  //     ),
  //   )
  // }

  private readonly getAll = async ({wsId}: {wsId: Ip.WorkspaceId}): Promise<Ip.Form[]> => {
    return this.prisma.form
      .findMany({
        include: {
          kobo: true,
        },
        where: {
          kobo: {isNot: null},
          workspaceId: wsId,
        },
      })
      .then(_ => _.map(PrismaHelper.mapForm))
  }

  readonly refreshAll = async ({byEmail, wsId}: {byEmail: Ip.User.Email; wsId: Ip.WorkspaceId}) => {
    const forms = await this.getAll({wsId}).then(seq)
    const sdks = await Promise.all(
      forms
        .map(_ => _.kobo?.accountId)
        .compact()
        .distinct(_ => _)
        .map(_ => this.koboSdk.getBy.accountId(_))
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
        const {kobo, ...db} = KoboFormService.apiToDb({
          schema: indexSchema[form.id],
          accountId: indexForm[form.id].kobo!.accountId,
          uploadedBy: byEmail,
          workspaceId: wsId,
        })
        return this.prisma.form.update({
          include: {
            kobo: true,
          },
          data: db,
          where: {
            id: form.id,
          },
        })
      })
  }
}
