import {Prisma, PrismaClient} from '@prisma/client'
import {genShortid, slugify} from '@infoportal/common'
import {SchemaMetaHelper, SchemaInspector} from '@infoportal/kobo-helper'
import {HttpError, Ip} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {FormService} from '../form/FormService.js'
import {seq} from '@axanc/ts-utils'

export class DashboardService {
  constructor(
    private prisma: PrismaClient,
    private form = new FormService(prisma),
  ) {}

  readonly getById = async ({id}: {id: Ip.DashboardId}): Promise<Ip.Dashboard | undefined> => {
    return this.prisma.dashboard
      .findUnique({where: {id, deletedAt: null}})
      .then(_ => (_ ? prismaMapper.dashboard.mapDashboard(_) : undefined))
  }

  readonly getPublished = async ({
    workspaceSlug,
    dashboardSlug,
  }: {
    workspaceSlug: string
    dashboardSlug: string
  }): Promise<any> => {
    return this.prisma.dashboard
      .findFirst({
        include: {
          published: {select: {snapshot: true}},
        },
        where: {workspace: {slug: workspaceSlug}, slug: dashboardSlug, publishedId: {not: null}, deletedAt: null},
      })
      .then(_ => {
        if (!_) return
        return {
          ..._,
          snapshot: _.published!.snapshot,
        }
      })
  }

  readonly restorePublishedVersion = async ({workspaceId, id}: {workspaceId: Ip.WorkspaceId; id: Ip.DashboardId}) => {
    const snapshot: Ip.DashboardWithSnapshot['snapshot'] = await this.prisma.dashboard
      .findFirstOrThrow({select: {published: {select: {snapshot: true}}}, where: {id}})
      .then(_ => _.published?.snapshot)
      .catch(HttpError.throwNotFoundIfUndefined())
    await this.prisma.dashboardSection.deleteMany({where: {dashboardId: id}})
    const sections: Prisma.DashboardSectionCreateManyInput[] = snapshot.map(({widgets, ..._}) => ({
      ..._,
      dashboardId: id,
    }))
    const widgets: Prisma.DashboardWidgetCreateManyInput[] = snapshot.flatMap(_ => _.widgets)
    await this.prisma.dashboardSection.createMany({data: sections})
    await this.prisma.dashboardWidget.createMany({data: widgets})
  }

  readonly getProtectedSubmission = async ({
    workspaceSlug,
    dashboardSlug,
  }: {
    workspaceSlug: string
    dashboardSlug: string
  }): Promise<any[]> => {
    const dashboard = await this.prisma.dashboard.findFirstOrThrow({
      where: {workspace: {slug: workspaceSlug}, slug: dashboardSlug},
      select: {sourceFormId: true, sections: {select: {widgets: {select: {type: true, config: true}}}}},
    })
    const widgets = dashboard.sections.flatMap(_ => _.widgets)
    const schema = await this.form.getSchema({formId: dashboard.sourceFormId as Ip.FormId})
    if (!schema) throw new HttpError.NotFound()
    const {metaKeys, questionNames} = this.collectDashboardQuestions({schema, widgets})
    const selectParts = [
      ...metaKeys.map(k => `"${k}"`),
      // ...questionNames.map(k => `answers->'${k}' AS "${k}"`)
      `jsonb_build_object(
          ${questionNames.map(k => `'${k}', answers->'${k}'`).join(',\n    ')}
        ) AS answers`,
    ]
    return this.prisma.$queryRawUnsafe(
      `
        SELECT ${selectParts.join(', ')}
        FROM "FormSubmission"
        WHERE "formId" = $1
    `,
      dashboard.sourceFormId,
    )
  }

  private collectDashboardQuestions = ({
    widgets,
    schema,
  }: {
    schema: Ip.Form.Schema
    widgets: Pick<Ip.Dashboard.Widget, 'type' | 'config'>[]
  }) => {
    const inspector = new SchemaInspector(schema)
    const keys = widgets
      .flatMap(_ => {
        switch (_.type) {
          case 'Card': {
            const config = _.config as Ip.Dashboard.Widget.Config['Card']
            return [config.questionName, config.filter?.questionName]
          }
          case 'BarChart': {
            const config = _.config as Ip.Dashboard.Widget.Config['BarChart']
            return [config.questionName]
          }
          case 'LineChart': {
            const config = _.config as Ip.Dashboard.Widget.Config['LineChart']
            return config.lines?.flatMap(_ => [_.questionName, _.filter?.questionName])
          }
          case 'GeoChart': {
            const config = _.config as Ip.Dashboard.Widget.Config['GeoChart']
            return [config.questionName, config.filter?.questionName]
          }
          case 'GeoPoint': {
            const config = _.config as Ip.Dashboard.Widget.Config['GeoPoint']
            return [config.filter?.questionName, config.questionName]
          }
          case 'Table': {
            const config = _.config as Ip.Dashboard.Widget.Config['Table']
            return [config.column?.questionName, config.row?.questionName, config.filter?.questionName]
          }
          case 'PieChart': {
            const config = _.config as Ip.Dashboard.Widget.Config['PieChart']
            return [config.filter?.questionName, config.questionName]
          }
          default: {
            return []
          }
        }
      })
      .filter(_ => _ !== undefined)
      .map(_ => {
        const repeatGroup = inspector.lookup.group.getByQuestionName(_)
        return repeatGroup?.name ?? _
      })
      .map(_ => {
        if (!/^[a-zA-Z0-9_]+$/.test(_)) throw new HttpError.BadRequest(`Unsafe JSON key: ${_}`)
        return _
      })
    const columnsAlways: (keyof Ip.Submission.Meta)[] = ['id', 'end', 'start', 'submissionTime']
    return {
      metaKeys: seq([...columnsAlways, ...keys.filter(_ => SchemaMetaHelper.isMeta(_))]).distinct(_ => _),
      questionNames: keys.filter(_ => !SchemaMetaHelper.isMeta(_)),
    }
  }

  readonly getAll = async ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<Ip.Dashboard[]> => {
    return this.prisma.dashboard
      .findMany({
        where: {workspaceId, deletedAt: null},
      })
      .then(_ =>
        _.map(_ => {
          return prismaMapper.dashboard.mapDashboard({..._, isPublished: !!_.publishedId})
        }),
      )
  }

  readonly update = async ({
    id,
    workspaceId,
    filters,
    theme,
    ...data
  }: Ip.Dashboard.Payload.Update): Promise<Ip.Dashboard> => {
    return this.prisma.dashboard
      .update({
        where: {id},
        data: {
          ...data,
          theme: theme as any,
          filters: filters as any,
        },
      })
      .then(prismaMapper.dashboard.mapDashboard)
  }

  readonly publish = async ({
    id,
    workspaceId,
    publishedBy,
  }: Ip.Dashboard.Payload.Publish & {publishedBy: Ip.User.Email}) => {
    const dashboard = await this.prisma.dashboard.findFirstOrThrow({where: {id}, select: {id: true, publishedId: true}})
    const snapshot = await this.prisma.dashboardSection.findMany({
      select: {id: true, title: true, description: true, widgets: true},
      where: {dashboardId: id},
    })
    if (dashboard?.publishedId) await this.prisma.dashboardPublished.delete({where: {id: dashboard.publishedId}})
    await this.prisma.dashboardPublished.create({
      data: {snapshot, publishedBy, dashboard: {connect: {id: dashboard.id}}},
    })
  }

  readonly remove = async ({
    id,
    workspaceId,
    deletedBy,
  }: Ip.Dashboard.Payload.Delete & {deletedBy: Ip.User.Email}): Promise<void> => {
    await this.prisma.dashboard.update({
      where: {id},
      data: {
        deletedBy,
        deletedAt: new Date(),
      },
    })
  }

  readonly create = async (data: Ip.Dashboard.Payload.Create & {createdBy: Ip.User.Email}): Promise<Ip.Dashboard> => {
    return this.prisma.dashboard
      .create({
        data: {
          ...data,
          deploymentStatus: 'draft',
        },
      })
      .then(prismaMapper.dashboard.mapDashboard)
  }

  readonly checkSlug = async (name: string) => {
    const suggestedSlug = await this.getUniqSlug(name)
    return {
      isFree: name === suggestedSlug,
      suggestedSlug,
    }
  }

  private readonly getUniqSlug = async (name: string) => {
    const baseSlug = slugify(name)
    const existingSlugs = await this.prisma.workspace
      .findMany({
        select: {slug: true},
        where: {
          slug: {startsWith: baseSlug},
        },
      })
      .then(_ => _.map(_ => _.slug))

    let slug = baseSlug
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${genShortid()}`
    }
    return slug
  }
}
