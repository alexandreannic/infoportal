import {Prisma, PrismaClient} from '@prisma/client'
import {AppConf} from './conf/AppConf.js'
import {Ip} from 'infoportal-api-sdk'

export const createdBySystem = 'SYSTEM' as Ip.User.Email

export class DbInit {
  constructor(
    private conf: AppConf,
    private prisma: PrismaClient,
  ) {}

  readonly initializeDatabase = async () => {
    if ((await this.prisma.user.count()) > 0) return
    await Promise.all([this.createAccOwner(), this.createAccAdmins(), this.createAccTest()])
  }

  private readonly createAccTest = async () => {
    return this.upsertUsers([
      {
        email: 'prot.man.hrk@dummy',
        drcJob: 'Protection Manager',
        drcOffice: 'Kharkiv',
        createdBy: createdBySystem,
      },
      {
        email: 'mpca.assist.hrk@dummy',
        drcJob: 'MPCA/NFI Assistant',
        drcOffice: 'Kharkiv',
        createdBy: createdBySystem,
      },
      {
        email: 'prot.officer.dnp@dummy',
        drcJob: 'Protection Officer',
        drcOffice: 'Dnipro',
        createdBy: createdBySystem,
      },
      {
        email: 'prot.co@dummy',
        drcJob: 'Protection Coordinator',
        createdBy: createdBySystem,
      },
      {
        email: 'noaccess@dummy',
        createdBy: createdBySystem,
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
        createdBy: createdBySystem,
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
