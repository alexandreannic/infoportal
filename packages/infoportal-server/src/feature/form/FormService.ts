import {PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common/index'
import {Ip} from 'infoportal-api-sdk'
import {KoboService} from '../kobo/KoboService.js'
import {FormAccessService} from '../access/FormAccessService.js'
import {KoboFormService} from '../kobo/KoboFormService.js'

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private kobo = new KoboService(prisma),
    private koboForm = new KoboFormService(prisma),
    private access = new FormAccessService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Ip.FormId}): Promise<undefined | Ip.Form.Schema> => {
    const form = await this.prisma.koboForm.findFirst({where: {id: formId}})
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
    return this.kobo.getSchema({formId}).then(_ => _.content)
  }

  readonly getSchemaByVersion = async ({
    formId,
    versionId,
  }: {
    versionId: Ip.Uuid
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

  readonly create = async (payload: Ip.Form.Payload.Create & {uploadedBy: string; workspaceId: Ip.Uuid}) => {
    return this.prisma.koboForm.create({
      data: {
        name: payload.name,
        category: payload.category,
        deploymentStatus: 'draft',
        uploadedBy: payload.workspaceId,
        source: 'internal',
        workspaces: {connect: {id: payload.workspaceId}},
      },
    })
  }

  readonly get = async (id: Ip.FormId): Promise<Ip.Form | undefined> => {
    return (await this.prisma.koboForm.findFirst({where: {id}})) ?? undefined
  }

  readonly updateSource = async ({formId, source}: Ip.Form.Payload.UpdateSource) => {
    const [_, update] = await Promise.all([
      source === 'disconnected' ? this.koboForm.deleteHook({formId}) : this.koboForm.createHookIfNotExists({formId}),
      this.prisma.koboForm.update({
        where: {id: formId},
        data: {source},
      }),
    ])
    return update
  }

  readonly remove = async (id: Ip.FormId): Promise<number> => {
    await Promise.any([
      this.prisma.databaseView.deleteMany({where: {databaseId: id}}),
      this.prisma.koboAnswers.deleteMany({where: {formId: id}}),
      this.prisma.formVersion.deleteMany({where: {formId: id}}),
      this.prisma.formAccess.deleteMany({where: {formId: id}}),
    ])
    await this.prisma.koboForm.delete({where: {id}})
    return 1
  }

  readonly getAll = async ({wsId}: {wsId: UUID}): Promise<Ip.Form[]> => {
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
}
