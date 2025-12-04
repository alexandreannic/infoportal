import {PrismaClient} from '@infoportal/prisma'
import {app, AppCacheKey} from '../../index.js'
import {appConf} from '../../core/AppConf.js'
import {yup} from '../../helper/Utils.js'
import {HttpError, Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {KoboSchemaCache} from './KoboSchemaCache.js'
import {SchemaParser, SchemaValidator} from '@infoportal/form-helper'
import {XlsFormParser} from './XlsFormParser.js'
import {KoboSdkGenerator} from '../kobo/KoboSdkGenerator.js'
import {PyxFormClient} from '../../core/PyxFormClient.js'

export class FormVersionService {
  constructor(
    private prisma: PrismaClient,
    private koboSchemaCache = KoboSchemaCache.getInstance(prisma),
    private koboSdk = KoboSdkGenerator.getSingleton(prisma),
    private log = app.logger('FormVersionService'),
    private conf = appConf,
  ) {}

  static readonly schema = {
    formId: yup.object({
      formId: yup.string().required(),
    }),
    versionId: yup.object({
      formId: yup.string().required(),
      versionId: yup.string().required(),
    }),
  }

  readonly upload = async ({
    file,
    ...rest
  }: {
    workspaceId: Api.WorkspaceId
    message?: string
    uploadedBy: Api.User.Email
    formId: Api.FormId
    file: Express.Multer.File
  }) => {
    const validation = await this.validateAndParse(file.path)
    if (!validation.schema || validation.status === 'error') {
      throw new Error('Invalid XLSForm')
    }
    return this.createNewVersion({fileName: file.filename, schemaJson: validation.schema, ...rest})
  }

  readonly validateAndParse = XlsFormParser.validateAndParse

  readonly deployLastDraft = async ({formId}: {formId: Api.FormId}) => {
    return this.prisma
      .$transaction(async tx => {
        await tx.formVersion.updateMany({
          where: {formId, status: {in: ['draft', 'active']}},
          data: {status: 'inactive'},
        })

        const last = await tx.formVersion.findFirst({
          where: {formId},
          orderBy: {createdAt: 'desc'},
        })

        if (!last) throw new Error('No form version found')

        await tx.form.update({
          where: {id: formId},
          data: {deploymentStatus: 'deployed'},
        })

        return tx.formVersion.update({
          where: {id: last.id},
          data: {status: 'active'},
        })
      })
      .then(prismaMapper.form.mapVersion)
  }

  readonly createNewVersion = async ({
    schemaJson,
    formId,
    workspaceId,
    ...rest
  }: Api.Form.Version.Payload.CreateNewVersion & {uploadedBy: Api.User.Email}) => {
    return this.prisma.$transaction(async tx => {
      const latest = await tx.formVersion.findFirst({
        where: {formId},
        orderBy: {version: 'desc'},
      })
      console.log('schemaJson', schemaJson)
      const parsedSchema = SchemaParser.parse(schemaJson)
      const errors = SchemaValidator.validate(parsedSchema)?.errors
      const xml = await this.getSchemaXml(parsedSchema)
      if (errors) throw new HttpError.BadRequest(JSON.stringify(errors))
      if (latest && JSON.stringify(latest?.schemaJson) === JSON.stringify(parsedSchema))
        throw new Error('No change in schema.')
      const schema = await (() => {
        if (latest?.status === 'draft') {
          return tx.formVersion.update({
            where: {
              id: latest.id,
            },
            data: {
              schemaJson: parsedSchema,
              schemaXml: xml,
              ...rest,
            },
          })
        } else {
          const nextVersion = (latest?.version ?? 0) + 1
          return tx.formVersion.create({
            data: {
              formId,
              status: 'draft',
              version: nextVersion,
              schemaJson: parsedSchema,
              schemaXml: xml,
              ...rest,
            },
          })
        }
      })()
      const versions = await this.getVersions({formId})
      return prismaMapper.form.mapVersion({...schema, versions})
    })
  }

  readonly getSchemaXml = async (schemaJson: Api.Form.Schema) => {
    const res = await PyxFormClient.getXmlBySchema(schemaJson)
    console.log(res)
    return res
  }

  readonly getVersions = ({formId}: {formId: Api.FormId}): Promise<Api.Form.Version[]> => {
    return this.prisma.formVersion
      .findMany({
        omit: {schemaJson: true, schemaXml: true},
        where: {formId},
      })
      .then(_ => _.map(prismaMapper.form.mapVersion) as Api.Form.Version[])
  }

  readonly hasActiveVersion = ({formId}: {formId: Api.FormId}): Promise<boolean> => {
    return this.prisma.formVersion
      .findFirst({
        where: {formId, status: 'active'},
      })
      .then(_ => _ !== null)
  }

  readonly importLastKoboSchema = async ({
    formId,
    workspaceId,
    author,
  }: {
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
    author: Api.User.Email
  }) => {
    app.cache.clear(AppCacheKey.KoboSchema, formId)
    const lastSchema = await this.koboSchemaCache.get({formId})
    if (!lastSchema) throw new HttpError.NotFound(`[importLastKoboSchema] Missing schema for ${formId}`)
    return this.createNewVersion({
      workspaceId,
      schemaJson: lastSchema.content,
      formId,
      uploadedBy: author,
      message: 'Imported from Kobo - Version: ' + lastSchema.version_id,
    })
  }
}
