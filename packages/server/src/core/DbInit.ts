import {Prisma, PrismaClient} from '@prisma/client'
import {AppConf} from './AppConf.js'
import {Api} from '@infoportal/api-sdk'

export const createdBySystem = 'SYSTEM' as Api.User.Email

export class DbInit {
  constructor(
    private conf: AppConf,
    private prisma: PrismaClient,
  ) {}

  readonly initializeDatabase = async () => {
    if ((await this.prisma.user.count()) > 0) return
    await Promise.all([this.createAccOwner(), this.createAccAdmins(), this.createAccTest()])
  }

  // ([47.9967, -4.0964])
  // ([4.6504, -74.051])
  // ([51.547664, 31.5164277])
  // ([47.9967, -4.0964])

  private readonly createAccTest = async () => {
    return this.upsertUsers([
      {
        email: 'prot.man.hrk@dummy',
        job: 'Protection Manager',
        location: 'Kharkiv',
      },
      {
        email: 'mpca.assist.hrk@dummy',
        job: 'MPCA/NFI Assistant',
        location: 'Kharkiv',
      },
      {
        email: 'prot.officer.dnp@dummy',
        job: 'Protection Officer',
        location: 'Dnipro',
      },
      {
        email: 'prot.co@dummy',
        job: 'Protection Coordinator',
      },
      {
        email: 'noaccess@dummy',
      },
    ])
  }

  private readonly createAccAdmins = async () => {
    const adminsEmail = [
      'julian.zakrzewski@drc.ngo',
      'alix.journoud@drc.ngo',
      'katrina.zacharewski@drc.ngo',
      'isabel.pearson@drc.ngo',
    ]
    return this.upsertUsers(
      adminsEmail.map(email => ({
        email,
      })),
    )
  }

  private readonly createAccOwner = async () => {
    return this.upsertUsers([
      {
        email: this.conf.ownerEmail,
        accessLevel: 'Admin',
      },
    ])
  }

  private readonly upsertUsers = async (users: Prisma.UserCreateInput[]) => {
    await Promise.all(
      users.map(_ =>
        this.prisma.user.upsert({
          update: _,
          create: _,
          where: {email: _.email},
        }),
      ),
    )
  }
}
