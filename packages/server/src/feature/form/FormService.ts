import {Form, PrismaClient} from '@infoportal/prisma'
import {HttpError, Api} from '@infoportal/api-sdk'
import {FormVersionService} from './FormVersionService.js'
import {FormAccessService} from './access/FormAccessService.js'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {Kobo} from 'kobo-sdk'
import {seq} from '@axanc/ts-utils'
import {KoboSchemaCache} from './KoboSchemaCache.js'

export type FormServiceCreatePayload = Api.Form.Payload.Create & {
  kobo?: {
    formId: Kobo.FormId
    accountId: Api.ServerId
  }
  uploadedBy: Api.User.Email
  workspaceId: Api.WorkspaceId
  deploymentStatus?: Api.Form.DeploymentStatus
}

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private formVersion = new FormVersionService(prisma),
    private koboSchemaCache = KoboSchemaCache.getInstance(prisma),
    private access = new FormAccessService(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Api.FormId}): Promise<undefined | Api.Form.Schema> => {
    const form = await this.prisma.form.findFirst({select: {id: true, kobo: true}, where: {id: formId}}).then(_ => {
      if (_) return {..._, kobo: _.kobo ? prismaMapper.form.mapKoboInfo(_.kobo) : _.kobo}
      return _
    })
    if (!form) return
    if (!Api.Form.isConnectedToKobo(form))
      return this.prisma.formVersion
        .findFirst({
          select: {schemaJson: true},
          where: {
            formId,
            status: 'active',
          },
        })
        .then(_ => _?.schemaJson as any)
    return this.koboSchemaCache
      .get({refreshCacheIfMissing: true, formId: form.id as Api.FormId})
      .then(_ => (_ ? _.content : undefined))
  }

  readonly getSchemaByVersion = async ({
    formId,
    versionId,
  }: {
    versionId: Api.Form.VersionId
    formId: Api.FormId
  }): Promise<undefined | {json: Api.Form.Schema; xml: Api.Form.SchemaXml}> => {
    const _ = await this.prisma.formVersion.findFirst({
      select: {schemaJson: true, schemaXml: true},
      where: {
        formId,
        id: versionId,
      },
    })
    if (!_) return
    if (_.schemaJson && !_.schemaXml) {
      // TODO should not be needed anymore, but was relevant at the time of the creation of schemaXml column until all existing from get migrated.
      const xml = await this.formVersion.getSchemaXml(_.schemaJson as Api.Form.Schema)
      await this.prisma.formVersion.update({data: {schemaXml: xml}, where: {formId, id: versionId}})
      _.schemaXml = xml
    }
    return {xml: _.schemaXml as Api.Form.SchemaXml, json: _?.schemaJson as Api.Form.Schema}
  }

  readonly create = async ({
    name,
    category,
    kobo,
    type,
    deploymentStatus = 'draft',
    uploadedBy,
    workspaceId,
  }: FormServiceCreatePayload): Promise<Api.Form> => {
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
      formId: created.id as Api.FormId,
      workspaceId,
      email: uploadedBy,
      level: 'Admin',
    })
    return prismaMapper.form.mapForm(created)
  }

  readonly get = async (id: Api.FormId): Promise<Api.Form | undefined> => {
    return this.prisma.form.findFirst({include: {kobo: true}, where: {id}}).then(_ => {
      if (!_) return
      return prismaMapper.form.mapForm(_)
    })
  }

  readonly updateKoboConnexion = async ({
    author,
    formId,
    connected,
  }: Api.Form.Payload.UpdateKoboConnexion & {
    author: Api.User.Email
  }): Promise<Api.Form> => {
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

  readonly update = async ({formId, archive, category}: Api.Form.Payload.Update): Promise<Api.Form> => {
    // TODO trigger event!
    // const koboUpdate$ = this.koboForm.update(params)
    const form = await this.prisma.form.findUnique({select: {type: true}, where: {id: formId}})
    if (!form) throw new HttpError.NotFound(`${formId} not found.`)
    const newData: Partial<Form> = {category}
    if (archive) {
      newData.deploymentStatus = 'archived'
    } else if (archive === false) {
      if (Api.Form.isKobo(form)) {
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

  readonly remove = async (id: Api.FormId): Promise<void> => {
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
    user: Api.User
    workspaceId: Api.WorkspaceId
  }): Promise<Api.Form[]> => {
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

  readonly getAll = async ({wsId}: {wsId: Api.WorkspaceId}): Promise<Api.Form[]> => {
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

  readonly getKoboIdByFormId = (formId: Api.FormId): Promise<Kobo.FormId | undefined> => {
    return this.prisma.formKoboInfo.findFirst({select: {koboId: true}, where: {formId}}).then(_ => _?.koboId)
  }
}
