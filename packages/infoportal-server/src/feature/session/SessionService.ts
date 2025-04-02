import {PrismaClient, User as PUser} from '@prisma/client'
import {app, AppLogger} from '../../index.js'
import {AuthenticationProvider} from '@microsoft/microsoft-graph-client/src/IAuthenticationProvider'
import {AuthenticationProviderOptions} from '@microsoft/microsoft-graph-client/src/IAuthenticationProviderOptions'
import {Client} from '@microsoft/microsoft-graph-client'
import {SessionError} from './SessionErrors.js'
// import {User} from '@microsoft/msgraph-sdk-javascript/lib/src/models/user'

type User = {
  mail?: string
  jobTitle?: string
}

export class SessionService {
  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('SessionService'),
  ) {}

  readonly login = async (userBody: {name: string; username: string; accessToken: string}) => {
    class MyCustomAuthenticationProvider implements AuthenticationProvider {
      getAccessToken = async (authenticationProviderOptions?: AuthenticationProviderOptions) => {
        return userBody.accessToken
      }
    }

    // const msGraphSdk = GraphServiceClient.init({
    //   authProvider: new MyCustomAuthenticationProvider()
    // })
    // msGraphSdk.users.get()
    // const email = await msGraphSdk.me.get().then(_ => {
    //   return _!.mail as string
    // })

    const msGraphSdk = Client.initWithMiddleware({
      authProvider: new MyCustomAuthenticationProvider(),
    })
    const msUser: User = await msGraphSdk.api('/me').get()
    const avatar = await msGraphSdk
      .api('/me/photo/$value')
      .get()
      .then((_: Blob) => _.arrayBuffer())
      .catch(() => {
        this.log.info(`No profile picture for ${msUser.mail}.`)
      })

    if (msUser.mail === undefined || msUser.jobTitle === undefined) {
      throw new SessionError.UserNotFound()
    }
    const connectedUser = await this.syncUserInDb({
      email: msUser.mail,
      drcJob: msUser.jobTitle?.trim().replace(/\s+/g, ' '),
      accessToken: userBody.accessToken,
      name: userBody.name,
      avatar: avatar ? Buffer.from(avatar) : undefined,
    })
    this.log.info(`${connectedUser.email} connected.`)
    return connectedUser
  }

  readonly syncUserInDb = async ({
    email,
    drcJob,
    accessToken,
    avatar,
    name,
  }: {
    accessToken: string
    avatar?: Buffer
    name: string
    email: string
    drcJob: string
  }): Promise<PUser> => {
    const user = await this.prisma.user.findFirst({where: {email}})
    if (!user) {
      this.log.info(`Create account ${email}.`)
      return this.prisma.user.create({
        data: {
          email,
          name,
          accessToken,
          drcJob: drcJob,
          avatar,
          lastConnectedAt: new Date(),
        },
      })
    } else {
      return this.prisma.user.update({
        where: {email},
        data: {
          accessToken,
          name,
          avatar,
          drcJob: drcJob,
          lastConnectedAt: new Date(),
        },
      })
    }
  }

  readonly saveActivity = async ({email, detail}: {email?: string; detail?: string}) => {
    const user = email ? await this.prisma.user.findUnique({where: {email}}) : undefined
    return this.prisma.userActivity.create({
      data: {
        userId: user?.id,
        detail,
        at: new Date(),
      },
    })
  }
}
