import {PrismaClient, User} from '@prisma/client'
import {app, AppLogger} from '../../../index.js'
import {Ip} from 'infoportal-api-sdk'
import {HttpError} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../../core/PrismaHelper.js'

export class FormAccessService {
  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('FormAccess'),
  ) {}

  private readonly searchFromAccess = async ({
    workspaceId,
    formId,
    user,
  }: {
    formId?: Ip.FormId
    workspaceId: Ip.WorkspaceId
    user?: Ip.User
  }) => {
    return this.prisma.formAccess.findMany({
      distinct: ['id'],
      where: {
        formId,
        workspaceId,
        AND: [
          {groupId: null},
          ...(user
            ? [
                {
                  OR: [
                    {email: {equals: user.email, mode: 'insensitive' as const}},
                    {job: {equals: user.drcJob, mode: 'insensitive' as const}},
                  ],
                },
              ]
            : []),
        ],
      },
      orderBy: {createdAt: 'desc'},
    })
  }

  private readonly searchFromGroup = async ({
    workspaceId,
    user,
    formId,
  }: {
    formId?: Ip.FormId
    workspaceId: Ip.WorkspaceId
    user?: Ip.User
  }) => {
    return this.prisma.formAccess.findMany({
      include: {
        group: {include: {items: true}},
      },
      where: {
        workspaceId,
        formId,
        groupId: {not: null},
        group: user
          ? {
              items: {
                some: {
                  OR: [
                    {email: {equals: user.email, mode: 'insensitive' as const}},
                    {
                      OR: [{drcOffice: user.drcOffice}, {drcOffice: null}, {drcOffice: ''}],
                      drcJob: {
                        equals: user.drcJob,
                        mode: 'insensitive' as const,
                      },
                    },
                  ],
                },
              },
            }
          : {},
      },
      orderBy: {createdAt: 'desc'},
    })
  }

  // TODO Perf can be optimized using a single SQL query
  // @ts-ignore
  readonly search = async ({
    workspaceId,
    user,
    formId,
  }: {
    workspaceId: Ip.WorkspaceId
    formId?: Ip.FormId
    user?: Ip.User
  }): Promise<Ip.Form.Access[]> => {
    const [fromGroup, fromAccess] = await Promise.all([
      this.searchFromGroup({formId, workspaceId, user}),
      this.searchFromAccess({formId, workspaceId, user}),
    ])
    return [
      ...fromAccess,
      ...fromGroup.map(_ => {
        const accesses = _.group?.items.reduce((acc, curr) => {
          acc.set(curr.level, curr.level)
          return acc
        }, new Map<Ip.AccessLevel, Ip.AccessLevel>())
        return {
          ..._,
          level: accesses?.get('Admin') ?? accesses?.get('Write') ?? Ip.AccessLevel.Read,
          groupName: _.group?.name,
        }
      }),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as any
  }

  readonly create = (payload: Ip.Form.Access.Payload.Create): Promise<Ip.Form.Access[]> => {
    return Promise.all(
      (payload.job ?? [undefined]).map(job =>
        this.prisma.formAccess.create({
          data: {
            ...payload,
            job,
            level: payload.level,
            email: payload.email,
            groupId: payload.groupId,
          },
        }),
      ),
    ) as Promise<Ip.Form.Access[]>
  }

  readonly update = ({id, ...data}: Ip.Form.Access.Payload.Update): Promise<Ip.Form.Access> => {
    return this.prisma.formAccess
      .update({
        where: {id},
        data: data,
      })
      .then(PrismaHelper.mapAccess)
  }

  readonly removeByFormId = ({formId}: {formId: Ip.FormId}) => {
    return this.prisma.formAccess.deleteMany({
      where: {
        formId,
      },
    })
  }

  readonly remove = async ({deletedByEmail, id}: {deletedByEmail: string; id: Ip.Form.AccessId}) => {
    const access = await this.prisma.formAccess.findFirst({
      select: {
        email: true,
      },
      where: {
        id,
      },
    })
    if (!access) throw new HttpError.NotFound()
    if (access.email === deletedByEmail) throw new HttpError.Forbidden('Cannot delete yourself')
    await this.prisma.formAccess.delete({
      select: {
        id: true,
      },
      where: {
        id,
      },
    })
  }
}
