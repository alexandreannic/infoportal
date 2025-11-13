import {PrismaClient} from '@prisma/client'
import {app} from '../../../index.js'
import {Ip} from '@infoportal/api-sdk'
import {prismaMapper} from '../../../core/prismaMapper/PrismaMapper.js'

export class FormActionReportService {
  constructor(
    private prisma: PrismaClient,
    private cache = app.cache,
  ) {}

  readonly getByFormId = ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
    return this.prisma.formActionReport
      .findMany({where: {formId}, orderBy: {startedAt: 'desc'}})
      .then(_ => _.map(prismaMapper.form.mapFormActionReport))
  }
}
