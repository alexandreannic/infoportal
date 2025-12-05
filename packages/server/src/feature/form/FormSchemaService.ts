import {Api, HttpError} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {FormVersionService} from './FormVersionService.js'
import {KoboSchemaCache} from './KoboSchemaCache.js'
import {PrismaClient} from '@infoportal/prisma'
import {KoboSdkGenerator} from '../kobo/KoboSdkGenerator.js'

export class FormSchemaService {
  constructor(
    private prisma: PrismaClient,
    private formVersion = new FormVersionService(prisma),
    private koboSchemaCache = KoboSchemaCache.getInstance(prisma),
    private koboSdk = KoboSdkGenerator.getSingleton(prisma),
  ) {}

  readonly get = async ({formId}: {formId: Api.FormId}): Promise<undefined | Api.Form.Schema> => {
    const form = await this.getForm(formId)
    if (!form) return
    return Api.Form.isConnectedToKobo(form)
      ? this.koboSchemaCache.get({refreshCacheIfMissing: true, formId}).then(_ => (_ ? _.content : undefined))
      : this.getBy({formId, status: 'active'})
  }

  readonly getXml = async ({formId}: {formId: Api.FormId}): Promise<undefined | Api.Form.SchemaXml> => {
    const form = await this.getForm(formId)
    if (!form) return
    if (Api.Form.isConnectedToKobo(form)) {
      const sdk = await this.koboSdk.getBy.formId(formId)
      if (!sdk) throw new HttpError.NotFound(`koboSdk not found for formId ${formId}`)
      const xml = await sdk.v2.form.getXml({formId: formId})
      return xml as Api.Form.SchemaXml
    }
    return this.getXmlBy({formId, status: 'active'})
  }

  readonly getByVersion = async ({
    formId,
    versionId,
  }: {
    versionId: Api.Form.VersionId
    formId: Api.FormId
  }): Promise<undefined | Api.Form.Schema> => {
    return this.getBy({formId, versionId})
  }

  readonly getByVersionXml = async ({
    formId,
    versionId,
  }: {
    versionId: Api.Form.VersionId
    formId: Api.FormId
  }): Promise<undefined | Api.Form.Schema> => {
    return this.getXmlBy({formId, versionId})
  }

  private readonly getXmlBy = async ({
    formId,
    status,
    versionId,
  }: {
    formId: Api.FormId
    status?: Api.Form.Version['status']
    versionId?: Api.Form.VersionId
  }) => {
    const maybeXml = await this.prisma.formVersion
      .findFirst({
        select: {schemaXml: true},
        where: {formId, status, id: versionId},
      })
      .then(_ => _?.schemaXml as any)
    if (maybeXml) return maybeXml
    const json = await this.prisma.formVersion
      .findFirst({
        select: {schemaJson: true},
        where: {formId, status, id: versionId},
      })
      .then(_ => _?.schemaJson as any)
    const xml = await this.formVersion.getSchemaXml(json as Api.Form.Schema)
    await this.prisma.formVersion.updateMany({data: {schemaXml: xml}, where: {formId, status: 'active'}})
    return xml
  }

  private readonly getBy = ({
    formId,
    status,
    versionId,
  }: {
    formId: Api.FormId
    status?: Api.Form.Version['status']
    versionId?: Api.Form.VersionId
  }) => {
    return this.prisma.formVersion
      .findFirst({
        select: {schemaJson: true},
        where: {
          formId,
          id: versionId,
          status,
        },
      })
      .then(_ => _?.schemaJson as any)
  }

  private readonly getForm = async (formId: Api.FormId) => {
    const form = await this.prisma.form.findFirst({select: {id: true, kobo: true}, where: {id: formId}})
    if (form) return {...form, kobo: form.kobo ? prismaMapper.form.mapKoboInfo(form.kobo) : form.kobo}
    return form
  }
}
