import {Form, PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'
import {KoboFormService} from '../kobo/KoboFormService.js'
import {FormVersionService} from './FormVersionService.js'
import {FormAccessService} from './access/FormAccessService.js'
import {PrismaHelper} from '../../core/PrismaHelper'

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private koboForm = new KoboFormService(prisma),
    private formVersion = new FormVersionService(prisma),
    private formAccess = new FormAccessService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Ip.FormId}): Promise<undefined | Ip.Form.Schema> => {
    const form = await this.prisma.form.findFirst({where: {id: formId}})
    if (!form) return
    if (form.source === 'internal')
      return this.prisma.formVersion
        .findFirst({
          select: {schema: true},
          where: {
            formId,
            status: 'active',
          },
        })
        .then(_ => _?.schema as any)
    return this.koboForm.getSchema({formId}).then(_ => _.content)
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

  readonly create = async (
    payload: Ip.Form.Payload.Create & {uploadedBy: string; workspaceId: Ip.WorkspaceId},
  ): Promise<Ip.Form> => {
    const created = await this.prisma.form.create({
      data: {
        name: payload.name,
        category: payload.category,
        deploymentStatus: 'draft',
        uploadedBy: payload.workspaceId,
        source: 'internal',
        workspaces: {connect: {id: payload.workspaceId}},
      },
    })
    await this.formAccess.create({
      formId: created.id as Ip.FormId,
      workspaceId: payload.workspaceId,
      email: payload.uploadedBy,
      level: 'Admin',
    })
    return PrismaHelper.mapForm(created)
  }

  readonly get = async (id: Ip.FormId): Promise<Ip.Form | undefined> => {
    return this.prisma.form.findFirst({where: {id}}).then(_ => {
      if (!_) return
      return PrismaHelper.mapForm(_)
    })
  }

  readonly update = async (params: Ip.Form.Payload.Update): Promise<Ip.Form> => {
    const {formId, archive, source} = params

    const koboUpdate$ = this.koboForm.update(params)

    const newData: Partial<Form> = {}
    if (archive) {
      newData.deploymentStatus = 'archived'
    } else if (archive === false) {
      const hasActiveVersion = await this.formVersion.hasActiveVersion({formId})
      newData.deploymentStatus = hasActiveVersion ? 'deployed' : 'draft'
    }
    if (source) {
      newData.source = source
    }
    const [_, update] = await Promise.all([
      koboUpdate$,
      this.prisma.form
        .update({
          where: {id: formId},
          data: newData,
        })
        .then(PrismaHelper.mapForm),
    ])
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

  readonly getAll = async ({wsId}: {wsId: UUID}): Promise<Ip.Form[]> => {
    return this.prisma.form
      .findMany({
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
      .then(_ => _.map(PrismaHelper.mapForm))
  }
}
