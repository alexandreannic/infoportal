import {PrismaClient} from '@prisma/client'
import {app} from '../../index.js'
import {appConf} from '../../core/conf/AppConf.js'
import {Kobo} from 'kobo-sdk'
import {yup} from '../../helper/Utils.js'
import {SchemaParser} from './SchemaParser.js'

export class SchemaService {
  constructor(
    private prisma: PrismaClient,
    private log = app.logger('SchemaService'),
    private conf = appConf,
  ) {}

  static readonly schema = {
    formId: yup.object({
      formId: yup.string().required(),
    }),
  }
  readonly upload = async ({
    formId,
    uploadedBy,
    file,
  }: {
    uploadedBy: string
    formId: Kobo.FormId
    file: Express.Multer.File
  }) => {
    const validation = await SchemaParser.validateXls(file.path)
    const schemaJson = await SchemaParser.xlsToJson(file.path)
    const schema = await this.saveSchema({formId, schemaJson, uploadedBy})
    return {validation, schema}
  }

  private readonly saveSchema = async ({
    schemaJson,
    formId,
    uploadedBy,
  }: {
    formId: Kobo.Form.Id
    schemaJson: Kobo.Form['content']
    uploadedBy: string
  }) => {
    return this.prisma.$transaction(async tx => {
      const latest = await tx.formSchema.findFirst({
        where: {formId},
        orderBy: {version: 'desc'},
      })
      const nextVersion = (latest?.version ?? 0) + 1
      if (latest && JSON.stringify(latest?.schema) === JSON.stringify(schemaJson))
        throw new Error('No change in schema.')
      const schema = await tx.formSchema.create({
        data: {
          formId,
          source: 'internal',
          version: nextVersion,
          uploadedBy,
          schema: schemaJson,
        },
      })
      const versions = await this.getVersions({formId})
      return {...schema, versions}
    })
  }

  readonly get = async ({formId}: {formId: Kobo.FormId}) => {
    const [active, last, all] = await Promise.all([
      this.prisma.koboForm
        .findFirst({
          select: {activeVersion: true},
          where: {id: formId},
        })
        .then(_ => _?.activeVersion),
      this.prisma.formSchema.findFirst({
        where: {formId},
        orderBy: {version: 'desc'},
      }),
      this.getVersions({formId}),
    ])
    return {active, last, all}
  }

  readonly getVersions = ({formId}: {formId: Kobo.FormId}) => {
    return this.prisma.formSchema.findMany({
      select: {id: true, version: true, message: true, uploadedBy: true, createdAt: true},
      where: {formId},
    })
  }
}
