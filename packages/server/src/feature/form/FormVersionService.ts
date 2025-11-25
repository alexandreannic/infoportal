import {PrismaClient} from '@prisma/client'
import {app, AppCacheKey} from '../../index.js'
import {appConf} from '../../core/conf/AppConf.js'
import {Kobo} from 'kobo-sdk'
import {yup} from '../../helper/Utils.js'
import {XlsFormParser} from '../kobo/XlsFormParser.js'
import {HttpError, Ip} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {FormService} from './FormService.js'
import {KoboSchemaCache} from './KoboSchemaCache.js'
import {Obj} from '@axanc/ts-utils'
import {SchemaValidator} from '@infoportal/kobo-helper'

export class FormVersionService {
  constructor(
    private prisma: PrismaClient,
    private koboSchemaCache = KoboSchemaCache.getInstance(prisma),
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

  readonly validateAndParse = XlsFormParser.validateAndParse

  readonly upload = async ({
    file,
    ...rest
  }: {
    workspaceId: Ip.WorkspaceId
    message?: string
    uploadedBy: Ip.User.Email
    formId: Ip.FormId
    file: Express.Multer.File
  }) => {
    const validation = await XlsFormParser.validateAndParse(file.path)
    if (!validation.schema || validation.status === 'error') {
      throw new Error('Invalid XLSForm')
    }
    return this.createNewVersion({fileName: file.filename, schemaJson: validation.schema, ...rest})
  }

  readonly deployLastDraft = async ({formId}: {formId: Ip.FormId}) => {
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
  }: Ip.Form.Version.Payload.CreateNewVersion & {uploadedBy: Ip.User.Email}) => {
    return this.prisma.$transaction(async tx => {
      const latest = await tx.formVersion.findFirst({
        where: {formId},
        orderBy: {version: 'desc'},
      })
      const error = SchemaValidator.validate(schemaJson)
      if (error) throw new HttpError.BadRequest(JSON.stringify(error))
      if (latest && JSON.stringify(latest?.schema) === JSON.stringify(schemaJson))
        throw new Error('No change in schema.')
      const schema = await (() => {
        if (latest?.status === 'draft') {
          return tx.formVersion.update({
            where: {
              id: latest.id,
            },
            data: {
              schema: schemaJson,
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
              schema: schemaJson,
              ...rest,
            },
          })
        }
      })()
      const versions = await this.getVersions({formId})
      return prismaMapper.form.mapVersion({...schema, versions})
    })
  }

  readonly getVersions = ({formId}: {formId: Ip.FormId}): Promise<Ip.Form.Version[]> => {
    return this.prisma.formVersion
      .findMany({
        omit: {schema: true},
        where: {formId},
      })
      .then(_ => _.map(prismaMapper.form.mapVersion))
  }

  readonly hasActiveVersion = ({formId}: {formId: Ip.FormId}): Promise<boolean> => {
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
    workspaceId: Ip.WorkspaceId
    formId: Ip.FormId
    author: Ip.User.Email
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
