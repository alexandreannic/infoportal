import {PrismaClient} from '@prisma/client'
import {app} from '../../index.js'
import {appConf} from '../../core/conf/AppConf.js'
import {Kobo} from 'kobo-sdk'
import {yup} from '../../helper/Utils.js'
import {XlsFormParser} from './XlsFormParser.js'
import UUID = Kobo.Submission.UUID
import {Ip} from 'infoportal-api-sdk'

export class FormVersionService {
  constructor(
    private prisma: PrismaClient,
    private log = app.logger('SchemaService'),
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
    formId,
    uploadedBy,
    file,
  }: {
    uploadedBy: string
    formId: Kobo.FormId
    file: Express.Multer.File
  }) => {
    const validation = await XlsFormParser.validateAndParse(file.path)
    if (!validation.schema || validation.status === 'error') {
      throw new Error('Invalid XLSForm')
    }
    return this.createNewVersion({fileName: file.filename, formId, schemaJson: validation.schema, uploadedBy})
  }

  private readonly createNewVersion = async ({
    schemaJson,
    formId,
    uploadedBy,
    fileName,
  }: {
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
      const schema = await tx.formVersion.create({
        data: {
          fileName,
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

  readonly getVersions = ({formId}: {formId: Kobo.FormId}): Promise<Ip.Form.Version[]> => {
    return this.prisma.formVersion.findMany({
      omit: {schema: true},
      where: {formId},
    })
  }

  readonly getSchema = ({formId, versionId}: {versionId: UUID; formId: Kobo.FormId}) => {
    return this.prisma.formVersion.findFirstOrThrow({
      where: {
        formId,
        id: versionId,
      },
    })
  }
}
