import {PrismaClient} from '@prisma/client'
import {Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class WidgetService {
  constructor(private prisma: PrismaClient) {}

  readonly search = async ({
    sectionId,
    dashboardId,
  }: Api.Dashboard.Widget.Payload.Search): Promise<Api.Dashboard.Widget[]> => {
    return this.prisma.dashboardWidget
      .findMany({where: {section: {dashboardId}, sectionId}})
      .then(_ => _.map(prismaMapper.dashboard.mapWidget))
  }

  readonly remove = async ({
    workspaceId,
    id,
  }: {
    id: Api.Dashboard.WidgetId
    workspaceId: Api.WorkspaceId
  }): Promise<void> => {
    await this.prisma.dashboardWidget.delete({where: {id}})
  }

  readonly update = async ({
    workspaceId,
    sectionId,
    id,
    ...data
  }: Api.Dashboard.Widget.Payload.Update): Promise<Api.Dashboard.Widget> => {
    return this.prisma.dashboardWidget.update({where: {id}, data}).then(prismaMapper.dashboard.mapWidget)
  }

  readonly create = async ({
    position,
    workspaceId,
    ...data
  }: Api.Dashboard.Widget.Payload.Create): Promise<Api.Dashboard.Widget> => {
    return this.prisma.dashboardWidget
      .create({
        data: {
          ...data,
          position: position as any,
        },
      })
      .then(prismaMapper.dashboard.mapWidget)
  }
}
