import {PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common/index'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {KoboService} from '../kobo/KoboService.js'
import {FormAccessService} from '../access/FormAccessService.js'

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private kobo = new KoboService(prisma),
    private access = new FormAccessService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Kobo.FormId}): Promise<undefined | Ip.Form.Schema> => {
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
    formId: Kobo.FormId
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
        uploadedBy: payload.workspaceId,
        source: 'internal',
        workspaces: {connect: {id: payload.workspaceId}},
      },
    })
  }

  readonly get = async (id: Kobo.FormId): Promise<Ip.Form | undefined> => {
    return (await this.prisma.koboForm.findFirst({where: {id}})) ?? undefined
  }

  readonly remove = async (id: Kobo.FormId): Promise<number> => {
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
