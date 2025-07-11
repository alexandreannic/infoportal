import {FormAccessLevel, PrismaClient, User} from '@prisma/client'
import {UUID} from 'infoportal-common'
import {app, AppLogger} from '../../index.js'
import {Ip} from 'infoportal-api-sdk'

export class FormAccessService {
  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('FormAccess'),
  ) {}

  private readonly searchFromAccess = async ({workspaceId, user}: {workspaceId: UUID; user?: User}) => {
    return this.prisma.formAccess.findMany({
      distinct: ['id'],
      where: {
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

  private readonly searchFromGroup = async ({workspaceId, user}: {workspaceId: UUID; user?: User}) => {
    return this.prisma.formAccess.findMany({
      include: {
        group: {include: {items: true}},
      },
      where: {
        workspaceId,
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
  readonly searchForUser = async ({
    workspaceId,
    user,
  }: {
    workspaceId: Ip.Uuid
    user?: User
  }): Promise<Ip.Form.Access[]> => {
    const [fromGroup, fromAccess] = await Promise.all([
      this.searchFromGroup({workspaceId, user}),
      this.searchFromAccess({workspaceId, user}),
    ])
    return [
      ...fromAccess,
      ...fromGroup.map(_ => {
        const accesses = _.group?.items.reduce((acc, curr) => {
          acc.set(curr.level, curr.level)
          return acc
        }, new Map<FormAccessLevel, FormAccessLevel>())
        return {
          ..._,
          level: accesses?.get('Admin') ?? accesses?.get('Write') ?? FormAccessLevel.Read,
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
    return this.prisma.formAccess.update({
      where: {id},
      data: data,
    }) as Promise<Ip.Form.Access>
  }

  readonly removeByFormId = ({formId}: {formId: Ip.FormId}) => {
    return this.prisma.formAccess.deleteMany({
      where: {
        formId,
      },
    })
  }

  readonly remove = ({id}: {id: Ip.Uuid}) => {
    return this.prisma.formAccess
      .delete({
        where: {
          id,
        },
      })
      .then(() => id)
  }
}
