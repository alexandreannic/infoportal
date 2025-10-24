import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class WidgetService {
  constructor(private prisma: PrismaClient) {}

  readonly search = async ({
    sectionId,
    dashboardId,
  }: Ip.Dashboard.Widget.Payload.Search): Promise<Ip.Dashboard.Widget[]> => {
    return this.prisma.dashboardWidget
      .findMany({where: {section: {dashboardId}, sectionId}})
      .then(_ => _.map(prismaMapper.dashboard.mapWidget))
  }

  readonly remove = async ({
    workspaceId,
    id,
  }: {
    id: Ip.Dashboard.WidgetId
    workspaceId: Ip.WorkspaceId
  }): Promise<void> => {
    await this.prisma.dashboardWidget.delete({where: {id}})
  }

  readonly update = async ({
    workspaceId,
    sectionId,
    id,
    ...data
  }: Ip.Dashboard.Widget.Payload.Update): Promise<Ip.Dashboard.Widget> => {
    return this.prisma.dashboardWidget.update({where: {id}, data}).then(prismaMapper.dashboard.mapWidget)
  }

  readonly create = async ({
    position,
    workspaceId,
    ...data
  }: Ip.Dashboard.Widget.Payload.Create): Promise<Ip.Dashboard.Widget> => {
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
