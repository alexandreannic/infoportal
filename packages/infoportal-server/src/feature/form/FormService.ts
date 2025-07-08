import {PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common/index'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {KoboService} from '../kobo/KoboService'

export class FormService {
  constructor(
    private prisma: PrismaClient,
    private kobo = new KoboService(prisma),
  ) {}

  readonly getSchema = async ({formId}: {formId: Kobo.FormId}): Promise<Ip.Form.Schema> => {
    const form = await this.prisma.koboForm.findFirstOrThrow({where: {id: formId}})
    if (form.source === 'internal')
      return this.prisma.formVersion
        .findFirstOrThrow({
          select: {schema: true},
          where: {
            formId,
            status: 'active',
          },
        })
        .then(_ => _.schema as any)
    return this.kobo.getSchema({formId}).then(_ => _.content)
  }

  readonly getSchemaByVersion = ({
    formId,
    versionId,
  }: {
    versionId: Ip.Uuid
    formId: Kobo.FormId
  }): Promise<Ip.Form.Schema> => {
    return this.prisma.formVersion
      .findFirstOrThrow({
        select: {schema: true},
        where: {
          formId,
          id: versionId,
        },
      })
      .then(_ => _.schema as any)
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
