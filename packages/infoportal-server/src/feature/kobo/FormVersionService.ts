import {PrismaClient} from '@prisma/client'
import {app} from '../../index.js'
import {appConf} from '../../core/conf/AppConf.js'
import {Kobo} from 'kobo-sdk'
import {yup} from '../../helper/Utils.js'
import {XlsFormParser} from './XlsFormParser.js'
import {Ip} from 'infoportal-api-sdk'

export class FormVersionService {
  constructor(
    private prisma: PrismaClient,
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
    message?: string
    uploadedBy: string
    formId: Kobo.FormId
    file: Express.Multer.File
  }) => {
    const validation = await XlsFormParser.validateAndParse(file.path)
    if (!validation.schema || validation.status === 'error') {
      throw new Error('Invalid XLSForm')
    }
    return this.createNewVersion({fileName: file.filename, schemaJson: validation.schema, ...rest})
  }

  readonly deployLastDraft = async ({formId}: {formId: Ip.FormId}) => {
    return this.prisma.$transaction(async tx => {
      await tx.formVersion.updateMany({
        where: {formId, status: {in: ['draft', 'active']}},
        data: {status: 'inactive'},
      })

      const last = await tx.formVersion.findFirst({
        where: {formId},
        orderBy: {createdAt: 'desc'},
      })

      if (!last) throw new Error('No form version found')

      await tx.koboForm.update({
        where: {id: formId},
        data: {deploymentStatus: 'deployed'},
      })

      return tx.formVersion.update({
        where: {id: last.id},
        data: {status: 'active'},
      })
    })
  }

  private readonly createNewVersion = async ({
    schemaJson,
    formId,
    ...rest
  }: {
    message?: string
    fileName?: string
    formId: Kobo.Form.Id
    schemaJson: Kobo.Form['content']
    uploadedBy: string
  }) => {
    return this.prisma.$transaction(async tx => {
      const latest = await tx.formVersion.findFirst({
        where: {formId},
        orderBy: {version: 'desc'},
      })
      const nextVersion = (latest?.version ?? 0) + 1
      if (latest && JSON.stringify(latest?.schema) === JSON.stringify(schemaJson))
        throw new Error('No change in schema.')
      await tx.formVersion.updateMany({
        where: {
          formId,
          status: 'draft',
        },
        data: {status: 'inactive'},
      })
      const schema = await tx.formVersion.create({
        data: {
          formId,
          status: 'draft',
          source: 'internal',
          version: nextVersion,
          schema: schemaJson,
          ...rest,
        },
      })
      const versions = await this.getVersions({formId})
      return {...schema, versions}
    })
  }

  readonly getVersions = ({formId}: {formId: Kobo.FormId}): Promise<Ip.Form.Version[]> => {
    return this.prisma.formVersion.findMany({
      omit: {schema: true},
      where: {formId},
    })
  }

  readonly hasActiveVersion = ({formId}: {formId: Kobo.FormId}): Promise<boolean> => {
    return this.prisma.formVersion
      .findFirst({
        where: {formId, status: 'active'},
      })
      .then(_ => _ !== null)
  }
}
