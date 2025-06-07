import {FeatureAccess, FeatureAccessLevel, Prisma, PrismaClient, User} from '@prisma/client'
import {Access, AppFeatureId, KoboDatabaseFeatureParams} from './AccessType.js'
import {yup} from '../../helper/Utils.js'
import {Obj} from '@axanc/ts-utils'
import {InferType} from 'yup'
import {UUID} from 'infoportal-common'
import {app, AppLogger} from '../../index.js'

export type AccessCreateParams = InferType<typeof AccessService.createSchema>

export interface FeatureAccesses extends FeatureAccess {
  groupName?: string
}

interface SearchByFeature {
  ({
    featureId,
    user,
  }: {
    featureId?: AppFeatureId.kobo_database
    user?: User
  }): Promise<Access<KoboDatabaseFeatureParams>[]>
}

export class AccessService {
  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('AccessService'),
  ) {}

  static readonly drcOfficeSchema = yup.string()
  static readonly drcJobSchema = yup.string().required() //yup.mixed<DrcJob>().oneOf(Obj.values(DrcJob)),
  static readonly levelSchema = yup.mixed<FeatureAccessLevel>().oneOf(Obj.values(FeatureAccessLevel)).required()
  static readonly featureIdSchema = yup.mixed<AppFeatureId>().oneOf(Obj.values(AppFeatureId))

  static readonly createSchema = yup.object({
    featureId: AccessService.featureIdSchema,
    level: AccessService.levelSchema,
    drcOffice: AccessService.drcOfficeSchema.optional().nullable(),
    drcJob: yup.array().of(AccessService.drcJobSchema).optional().nullable(),
    email: yup.string().optional().nullable(),
    groupId: yup.string().optional().nullable(),
    params: yup.mixed().optional().nullable(),
  })

  static readonly updateSchema = yup.object({
    level: yup.mixed<FeatureAccessLevel>().oneOf(Obj.values(FeatureAccessLevel)),
    drcJob: yup.string(), //yup.mixed<DrcJob>().oneOf(Obj.values(DrcJob)),
    drcOffice: yup.string(),
  })

  static readonly searchSchema = yup.object({
    featureId: yup.mixed<AppFeatureId>().oneOf(Obj.values(AppFeatureId)),
  })

  private readonly searchFromAccess = async ({featureId, user}: {featureId?: AppFeatureId; user?: User}) => {
    return this.prisma.featureAccess.findMany({
      distinct: ['id'],
      where: {
        AND: [
          {groupId: null},
          {featureId: featureId},
          ...(user
            ? [
                {
                  OR: [
                    {email: {equals: user.email, mode: 'insensitive' as const}},
                    {drcJob: {equals: user.drcJob, mode: 'insensitive' as const}},
                  ],
                },
              ]
            : []),
        ],
      },
      orderBy: {createdAt: 'desc'},
    })
  }

  private readonly searchFromGroup = async ({featureId, user}: {featureId?: AppFeatureId; user?: User}) => {
    return this.prisma.featureAccess.findMany({
      include: {
        group: {include: {items: true}},
      },
      where: {
        featureId: featureId,
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
  readonly searchForUser: SearchByFeature = async ({featureId, user}: any) => {
    const [fromGroup, fromAccess] = await Promise.all([
      this.searchFromGroup({featureId, user}),
      this.searchFromAccess({featureId, user}),
    ])
    return [
      ...fromAccess,
      ...fromGroup.map(_ => {
        const accesses = _.group?.items.reduce((acc, curr) => {
          acc.set(curr.level, curr.level)
          return acc
        }, new Map<FeatureAccessLevel, FeatureAccessLevel>())
        return {
          ..._,
          level: accesses?.get('Admin') ?? accesses?.get('Write') ?? FeatureAccessLevel.Read,
          groupName: _.group?.name,
        }
      }),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  readonly create = (body: AccessCreateParams) => {
    return Promise.all(
      (body.drcJob ?? [undefined]).map(drcJob =>
        this.prisma.featureAccess.create({
          data: {
            ...body,
            drcJob,
            level: body.level,
            email: body.email,
            groupId: body.groupId,
            featureId: body.featureId,
            params: body.params ?? Prisma.DbNull,
          },
        }),
      ),
    )
  }

  readonly update = (id: UUID, body: InferType<typeof AccessService.updateSchema>) => {
    return this.prisma.featureAccess.update({
      where: {id},
      data: {
        level: body.level,
        drcJob: body.drcJob,
      },
    })
  }

  readonly remove = (id: string) => {
    return this.prisma.featureAccess.delete({
      where: {
        id,
      },
    })
  }
}
