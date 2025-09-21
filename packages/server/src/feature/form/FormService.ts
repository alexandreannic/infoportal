import {Form, PrismaClient} from '@prisma/client'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {FormVersionService} from './FormVersionService.js'
import {FormAccessService} from './access/FormAccessService.js'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {Kobo} from 'kobo-sdk'
import {seq} from '@axanc/ts-utils'
import {KoboSchemaCache} from './KoboSchemaCache.js'

export type FormServiceCreatePayload = Ip.Form.Payload.Create & {
  kobo?: {
    formId: Kobo.FormId
    accountId: Ip.ServerId
  }
  uploadedBy: Ip.User.Email
  workspaceId: Ip.WorkspaceId
  deploymentStatus?: Ip.Form.DeploymentStatus
}

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private formVersion = new FormVersionService(prisma),
    private koboSchemaCache = KoboSchemaCache.getInstance(prisma),
    private access = new FormAccessService(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Ip.FormId}): Promise<undefined | Ip.Form.Schema> => {
    const form = await this.prisma.form.findFirst({select: {id: true, kobo: true}, where: {id: formId}}).then(_ => {
      if (_) return {..._, kobo: _.kobo ? prismaMapper.form.mapKoboInfo(_.kobo) : _.kobo}
      return _
    })
    if (!form) return
    if (!Ip.Form.isConnectedToKobo(form))
      return this.prisma.formVersion
        .findFirst({
          select: {schema: true},
          where: {
            formId,
            status: 'active',
          },
        })
        .then(_ => _?.schema as any)
    return this.koboSchemaCache
      .get({refreshCacheIfMissing: true, formId: form.id as Ip.FormId})
      .then(_ => (_ ? _.content : undefined))
  }

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
    type,
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
        type,
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
    return prismaMapper.form.mapForm(created)
  }

  readonly get = async (id: Ip.FormId): Promise<Ip.Form | undefined> => {
    return this.prisma.form.findFirst({include: {kobo: true}, where: {id}}).then(_ => {
      if (!_) return
      return prismaMapper.form.mapForm(_)
    })
  }

  readonly updateKoboConnexion = async ({
    author,
    formId,
    connected,
  }: Ip.Form.Payload.UpdateKoboConnexion & {
    author: Ip.User.Email
  }): Promise<Ip.Form> => {
    await this.prisma.formKoboInfo.update({
      where: {formId},
      data: {
        deletedAt: connected ? null : new Date(),
        deletedBy: author,
      },
    })
    const update = await this.get(formId)
    if (!update) throw new HttpError.NotFound(`${formId} not found.`)
    return update
  }

  readonly update = async ({formId, archive, category}: Ip.Form.Payload.Update): Promise<Ip.Form> => {
    // TODO trigger event!
    // const koboUpdate$ = this.koboForm.update(params)
    const form = await this.prisma.form.findUnique({select: {type: true}, where: {id: formId}})
    if (!form) throw new HttpError.NotFound(`${formId} not found.`)
    const newData: Partial<Form> = {category}
    if (archive) {
      newData.deploymentStatus = 'archived'
    } else if (archive === false) {
      if (Ip.Form.isKobo(form)) {
        newData.deploymentStatus = 'deployed'
      } else {
        const hasActiveVersion = await this.formVersion.hasActiveVersion({formId})
        newData.deploymentStatus = hasActiveVersion ? 'deployed' : 'draft'
      }
    }
    return this.prisma.form
      .update({
        include: {
          kobo: true,
        },
        where: {id: formId},
        data: newData,
      })
      .then(prismaMapper.form.mapForm)
  }

  readonly remove = async (id: Ip.FormId): Promise<void> => {
    await Promise.any([
      this.prisma.databaseView.deleteMany({where: {databaseId: id}}),
      this.prisma.formSubmission.deleteMany({where: {formId: id}}),
      this.prisma.formVersion.deleteMany({where: {formId: id}}),
      this.prisma.formAccess.deleteMany({where: {formId: id}}),
    ])
    await this.prisma.form.delete({where: {id}})
  }

  readonly getByUser = async ({
    workspaceId,
    user,
  }: {
    user: Ip.User
    workspaceId: Ip.WorkspaceId
  }): Promise<Ip.Form[]> => {
    const accesses = await this.access.search({workspaceId, user})
    return this.prisma.form
      .findMany({
        include: {kobo: true},
        where: {
          workspaceId,
          id: {
            in: seq(accesses)
              .map(_ => _.formId)
              .compact(),
          },
        },
      })
      .then(_ => _.map(prismaMapper.form.mapForm))
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
      .then(_ => _.map(prismaMapper.form.mapForm))
  }

  readonly getKoboIdByFormId = (formId: Ip.FormId): Promise<Kobo.FormId | undefined> => {
    return this.prisma.formKoboInfo.findFirst({select: {koboId: true}, where: {formId}}).then(_ => _?.koboId)
  }
}
