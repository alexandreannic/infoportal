import {PrismaClient} from '@prisma/client'
import {app, AppLogger} from '../../../index.js'
import {HttpError, Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../../core/prismaMapper/PrismaMapper.js'

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
    formId?: Api.FormId
    workspaceId: Api.WorkspaceId
    user?: Api.User
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
                    user.job ? {job: {equals: user.job, mode: 'insensitive' as const}} : {},
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
    formId?: Api.FormId
    workspaceId: Api.WorkspaceId
    user?: Api.User
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
                      OR: [{location: user.location}, {location: null}, {location: ''}],
                      job: {
                        equals: user.job,
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
    workspaceId: Api.WorkspaceId
    formId?: Api.FormId
    user?: Api.User
  }): Promise<Api.Access[]> => {
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
        }, new Map<Api.AccessLevel, Api.AccessLevel>())
        return {
          ..._,
          level: accesses?.get('Admin') ?? accesses?.get('Write') ?? Api.AccessLevel.Read,
          groupName: _.group?.name,
        }
      }),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as any
  }

  readonly create = (payload: Api.Access.Payload.Create): Promise<Api.Access[]> => {
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
    ) as Promise<Api.Access[]>
  }

  readonly update = ({id, ...data}: Api.Access.Payload.Update): Promise<Api.Access> => {
    return this.prisma.formAccess
      .update({
        where: {id},
        data: data,
      })
      .then(prismaMapper.access.mapAccess)
  }

  readonly removeByFormId = ({formId}: {formId: Api.FormId}) => {
    return this.prisma.formAccess.deleteMany({
      where: {
        formId,
      },
    })
  }

  readonly remove = async ({deletedByEmail, id}: {deletedByEmail: string; id: Api.AccessId}) => {
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
