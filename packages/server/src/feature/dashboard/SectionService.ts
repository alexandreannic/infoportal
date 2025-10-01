import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class SectionService {
  constructor(private prisma: PrismaClient) {}

  readonly search = async ({dashboardId}: Ip.Dashboard.Section.Payload.Search): Promise<Ip.Dashboard.Section[]> => {
    return this.prisma.dashboardSection
      .findMany({where: {dashboardId}})
      .then(_ => _.map(prismaMapper.dashboard.mapSection))
  }

  readonly remove = async ({id}: {id: Ip.Dashboard.SectionId}): Promise<void> => {
    await this.prisma.dashboardSection.delete({where: {id}})
  }

  readonly update = async ({id, ...data}: Ip.Dashboard.Section.Payload.Update): Promise<Ip.Dashboard.Section> => {
    return this.prisma.dashboardSection.update({where: {id}, data}).then(prismaMapper.dashboard.mapSection)
  }

  readonly create = async ({
    workspaceId,
    ...data
  }: Ip.Dashboard.Section.Payload.Create): Promise<Ip.Dashboard.Section> => {
    return this.prisma.dashboardSection
      .create({
        data,
      })
      .then(prismaMapper.dashboard.mapSection)
  }
}
