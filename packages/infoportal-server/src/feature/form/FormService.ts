import {Form, PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {FormVersionService} from './FormVersionService.js'
import {FormAccessService} from './access/FormAccessService.js'
import {PrismaHelper} from '../../core/PrismaHelper.js'
import {Kobo} from 'kobo-sdk'
import {app, AppCacheKey} from '../../index.js'
import {duration} from '@axanc/ts-utils'
import {KoboSdkGenerator} from '../kobo/KoboSdkGenerator.js'

export type FormServiceCreatePayload = Ip.Form.Payload.Create & {
  kobo?: {
    formId: Kobo.FormId
    accountId: Ip.ServerId
  }
  uploadedBy: string
  workspaceId: Ip.WorkspaceId
  deploymentStatus?: Ip.Form.DeploymentStatus
}

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private formVersion = new FormVersionService(prisma),
    private koboSdk = KoboSdkGenerator.getSingleton(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Ip.FormId}): Promise<undefined | Ip.Form.Schema> => {
    const form = await this.prisma.form.findFirst({select: {kobo: true}, where: {id: formId}})
    if (!form) return
    if (!form.kobo)
      return this.prisma.formVersion
        .findFirst({
          select: {schema: true},
          where: {
            formId,
            status: 'active',
          },
        })
        .then(_ => _?.schema as any)
    return this.getKoboSchema({koboFormId: form.kobo.koboId}).then(_ => _.content)
  }

  private readonly getKoboSchema = app.cache.request({
    key: AppCacheKey.KoboSchema,
    genIndex: _ => _.koboFormId,
    ttlMs: duration(2, 'day').toMs,
    fn: async ({koboFormId}: {koboFormId: Kobo.FormId}): Promise<Kobo.Form> => {
      const sdk = await this.koboSdk.getBy.formId(koboFormId)
      return sdk.v2.form.get({formId: koboFormId, use$autonameAsName: true})
    },
  })

  readonly getSchemaByVersion = async ({
    formId,
    versionId,
  }: {
    versionId: Ip.Form.VersionId
    formId: Ip.FormId
  }): Promise<undefined | Ip.Form.Schema> => {
    const _ = await this.prisma.formVersion.findFirst({
      select: {schema: true},
      where: {
        formId,
        id: versionId,
      },
    })
    return _?.schema as any
  }

  readonly create = async ({
    name,
    category,
    kobo,
    deploymentStatus = 'draft',
    uploadedBy,
    workspaceId,
  }: FormServiceCreatePayload): Promise<Ip.Form> => {
    const created = await this.prisma.form.create({
      include: {
        kobo: true,
      },
      data: {
        name,
        category,
        deploymentStatus,
        uploadedBy,
        workspaceId,
        kobo: kobo
          ? {
              create: {
                accountId: kobo.accountId,
                koboId: kobo.formId,
              },
            }
          : undefined,
      },
    })
    await this.formAccess.create({
      formId: created.id as Ip.FormId,
      workspaceId,
      email: uploadedBy,
      level: 'Admin',
    })
    return PrismaHelper.mapForm(created)
  }

  readonly get = async (id: Ip.FormId): Promise<Ip.Form | undefined> => {
    return this.prisma.form.findFirst({include: {kobo: true}, where: {id}}).then(_ => {
      if (!_) return
      return PrismaHelper.mapForm(_)
    })
  }

  readonly disconnectFromKobo = async (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}): Promise<Ip.Form> => {
    return this.prisma.form
      .update({
        include: {
          kobo: true,
        },
        where: {id: params.formId},
        data: {
          kobo: {delete: true},
        },
      })
      .then(PrismaHelper.mapForm)
  }

  readonly update = async (params: Ip.Form.Payload.Update): Promise<Ip.Form> => {
    const {formId, archive} = params

    // TODO trigger event!
    // const koboUpdate$ = this.koboForm.update(params)

    const newData: Partial<Form> = {}
    if (archive) {
      newData.deploymentStatus = 'archived'
    } else if (archive === false) {
      const hasActiveVersion = await this.formVersion.hasActiveVersion({formId})
      newData.deploymentStatus = hasActiveVersion ? 'deployed' : 'draft'
    }
    const update = await this.prisma.form
      .update({
        include: {
          kobo: true,
        },
        where: {id: formId},
        data: newData,
      })
      .then(PrismaHelper.mapForm)
    return update
  }

  readonly remove = async (id: Ip.FormId): Promise<number> => {
    await Promise.any([
      this.prisma.databaseView.deleteMany({where: {databaseId: id}}),
      this.prisma.formSubmission.deleteMany({where: {formId: id}}),
      this.prisma.formVersion.deleteMany({where: {formId: id}}),
      this.prisma.formAccess.deleteMany({where: {formId: id}}),
    ])
    await this.prisma.form.delete({where: {id}})
    return 1
  }

  readonly getAll = async ({wsId}: {wsId: Ip.WorkspaceId}): Promise<Ip.Form[]> => {
    return this.prisma.form
      .findMany({
        include: {
          kobo: true,
        },
        where: {
          workspaceId: wsId,
        },
      })
      .then(_ => _.map(PrismaHelper.mapForm))
  }
}
