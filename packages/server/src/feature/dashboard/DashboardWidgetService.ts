import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class WidgetService {
  constructor(private prisma: PrismaClient) {}

  readonly getByDashboard = async ({
    workspaceId,
    dashboardId,
  }: {
    dashboardId: Ip.DashboardId
    workspaceId: Ip.WorkspaceId
  }): Promise<Ip.Dashboard.Widget[]> => {
    return this.prisma.widget.findMany({where: {dashboardId}}).then(_ => _.map(prismaMapper.dashboard.mapWidget))
  }

  readonly remove = async ({
    workspaceId,
    dashboardId,
    widgetId,
  }: {
    widgetId: Ip.Dashboard.WidgetId
    dashboardId: Ip.DashboardId
    workspaceId: Ip.WorkspaceId
  }): Promise<void> => {
    await this.prisma.widget.delete({where: {id: widgetId}})
  }

  readonly update = async ({
    workspaceId,
    dashboardId,
    widgetId,
    ...data
  }: Ip.Dashboard.Widget.Payload.Update): Promise<Ip.Dashboard.Widget> => {
    return this.prisma.widget.update({where: {id: widgetId}, data}).then(prismaMapper.dashboard.mapWidget)
  }

  readonly create = async ({
    position,
    workspaceId,
    ...data
  }: Ip.Dashboard.Widget.Payload.Create): Promise<Ip.Dashboard.Widget> => {
    return this.prisma.widget
      .create({
        data: {
          ...data,
          position: position as any,
        },
      })
      .then(prismaMapper.dashboard.mapWidget)
  }
}
