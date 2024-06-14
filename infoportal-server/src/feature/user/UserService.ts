import {PrismaClient} from '@prisma/client'
import {app, AppLogger} from '../../index'
import {DrcOffice} from '@infoportal-common'

export class UserService {

  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('UserService'),
  ) {
  }

  readonly getAll = () => {
    return this.prisma.user.findMany({orderBy: {lastConnectedAt: 'desc'}})
  }

  readonly getUserByEmail = (email: string) => {
    return this.prisma.user.findFirst({
      where: {email},
    })
  }

  readonly update = ({
    email,
    drcOffice,
  }: {
    email: string,
    drcOffice?: DrcOffice
  }) => {
    return this.prisma.user.update({
      where: {email},
      data: {drcOffice}
    })
  }
}