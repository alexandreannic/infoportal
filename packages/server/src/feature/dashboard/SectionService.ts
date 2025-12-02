import {PrismaClient} from '@infoportal/prisma'
import {Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class SectionService {
  constructor(private prisma: PrismaClient) {}

  readonly search = async ({dashboardId}: Api.Dashboard.Section.Payload.Search): Promise<Api.Dashboard.Section[]> => {
    return this.prisma.dashboardSection
      .findMany({where: {dashboardId}})
      .then(_ => _.map(prismaMapper.dashboard.mapSection))
  }

  readonly remove = async ({id}: {id: Api.Dashboard.SectionId}): Promise<void> => {
    await this.prisma.dashboardSection.delete({where: {id}})
  }

  readonly update = async ({id, ...data}: Api.Dashboard.Section.Payload.Update): Promise<Api.Dashboard.Section> => {
    return this.prisma.dashboardSection.update({where: {id}, data}).then(prismaMapper.dashboard.mapSection)
  }

  readonly create = async ({
    workspaceId,
    ...data
  }: Api.Dashboard.Section.Payload.Create): Promise<Api.Dashboard.Section> => {
    return this.prisma.dashboardSection
      .create({
        data,
      })
      .then(prismaMapper.dashboard.mapSection)
  }
}
