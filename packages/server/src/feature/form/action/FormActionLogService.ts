import {PrismaClient} from '@prisma/client'
import {Ip, Paginate} from 'infoportal-api-sdk'
import {prismaMapper} from '../../../core/prismaMapper/PrismaMapper.js'

export class FormActionLogService {
  constructor(private prisma: PrismaClient) {}

  readonly search = ({
    actionId,
    formId,
    limit = 200,
    offset,
    workspaceId,
  }: Ip.Form.Action.Log.Payload.Search): Promise<Ip.Paginate<Ip.Form.Action.Log>> => {
    return this.prisma.formActionLog
      .findMany({
        take: limit,
        skip: offset,
        orderBy: {createdAt: 'desc'},
        where: {
          action: {
            is: {
              formId,
              id: actionId,
            },
          },
        },
      })
      .then(_ => _.map(prismaMapper.form.mapFormActionLog))
      .then(Paginate.make())
  }
}
