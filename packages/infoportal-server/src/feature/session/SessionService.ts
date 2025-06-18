import {PrismaClient, User} from '@prisma/client'
import {app, AppLogger} from '../../index.js'
import {AuthenticationProvider} from '@microsoft/microsoft-graph-client/src/IAuthenticationProvider'
import {AuthenticationProviderOptions} from '@microsoft/microsoft-graph-client/src/IAuthenticationProviderOptions'
import {Client} from '@microsoft/microsoft-graph-client'
import {SessionError} from './SessionErrors.js'
import {google} from 'googleapis'
import {GroupService} from '../group/GroupService.js'
import {WorkspaceService} from '../workspace/WorkspaceService.js'
import {AccessService} from '../access/AccessService.js'
import {AppSession, UserProfile} from './AppSession.js'

// import {User} from '@microsoft/msgraph-sdk-javascript/lib/src/models/user'

export class SessionService {
  constructor(
    private prisma: PrismaClient,
    private workspace = new WorkspaceService(prisma),
    private log: AppLogger = app.logger('SessionService'),
  ) {}

  readonly login = async (userBody: {
    name: string
    username: string
    accessToken: string
    provider: 'google' | 'microsoft'
  }) => {
    switch (userBody.provider) {
      case 'google':
        return this.loginWithGoogle(userBody)
      case 'microsoft':
        return this.loginWithMicrosoft(userBody)
      default:
        throw new Error('Invalid provider')
    }
  }

  private readonly loginWithGoogle = async (userBody: {name: string; username: string; accessToken: string}) => {
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({access_token: userBody.accessToken})

    // const jobTitle = await google
    //   .admin({version: 'directory_v1', auth: oauth2Client})
    //   .users.get({userKey: 'me'})
    //   .then(user => {
    //     return user.data.organizations?.[0]?.title
    //   })

    const oauth2 = google.oauth2({version: 'v2', auth: oauth2Client})
    const userInfo = await oauth2.userinfo.get()
    const email = userInfo.data.email
    const name = userInfo.data.name ?? userBody.name

    if (!email) {
      throw new SessionError.UserNotFound()
    }

    let avatar: Buffer | undefined
    try {
      const res = await fetch(userInfo.data.picture!, {
        headers: {Authorization: `Bearer ${userBody.accessToken}`},
      })
      const blob = await res.arrayBuffer()
      avatar = Buffer.from(blob)
    } catch {
      this.log.info(`No profile picture for ${email}`)
    }

    const connectedUser = await this.syncUserInDb({
      email,
      accessToken: userBody.accessToken,
      name,
      // drcJob: jobTitle,
      avatar,
    })

    this.log.info(`${connectedUser.email} connected via Google.`)
    return connectedUser
  }

  readonly loginWithMicrosoft = async (userBody: {name: string; username: string; accessToken: string}) => {
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
    const msUser: {
      mail?: string
      jobTitle?: string
    } = await msGraphSdk.api('/me').get()
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
    drcJob?: string
  }): Promise<User> => {
    const user = await this.prisma.user.findFirst({where: {email}})
    if (!user) {
      this.log.info(`Create account ${email}.`)
      return this.prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
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

  readonly get = async (user: User): Promise<UserProfile> => {
    const workspaces = await this.workspace.getByUser(user.email)
    return {
      workspaces,
      user,
    }
  }
}
