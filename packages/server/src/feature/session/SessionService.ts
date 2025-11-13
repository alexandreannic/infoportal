import {PrismaClient, User} from '@prisma/client'
import {app, AppLogger} from '../../index.js'
import {AuthenticationProvider} from '@microsoft/microsoft-graph-client/src/IAuthenticationProvider'
import {AuthenticationProviderOptions} from '@microsoft/microsoft-graph-client/src/IAuthenticationProviderOptions'
import {Client} from '@microsoft/microsoft-graph-client'
import {SessionError} from './SessionErrors.js'
import {google} from 'googleapis'
import {WorkspaceService} from '../workspace/WorkspaceService.js'
import {UserProfile} from './AppSession.js'
import {HttpError, Ip} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'
import {UserService} from '../user/UserService.js'

export class SessionService {
  constructor(
    private prisma: PrismaClient,
    private user = UserService.getInstance(prisma),
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
        return this.loginWithGoogle(userBody).then(this.get)
      case 'microsoft':
        return this.loginWithMicrosoft(userBody).then(this.get)
      default:
        throw new Error('Invalid provider')
    }
  }

  private readonly loginWithGoogle = async (userBody: {
    name: string
    username: string
    accessToken: string
  }): Promise<Ip.User> => {
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
    const email = userInfo.data.email as Ip.User.Email
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
      // job: jobTitle,
      avatar,
    })

    this.log.info(`${connectedUser.email} connected via Google.`)
    return prismaMapper.access.mapUser(connectedUser)
  }

  readonly loginWithMicrosoft = async (userBody: {
    name: string
    username: string
    accessToken: string
  }): Promise<Ip.User> => {
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
      email: msUser.mail as Ip.User.Email,
      job: msUser.jobTitle?.trim().replace(/\s+/g, ' '),
      accessToken: userBody.accessToken,
      name: userBody.name,
      avatar: avatar ? Buffer.from(avatar) : undefined,
    })
    this.log.info(`${connectedUser.email} connected.`)
    return prismaMapper.access.mapUser(connectedUser)
  }

  readonly syncUserInDb = async ({
    email,
    job,
    accessToken,
    avatar,
    name,
  }: {
    accessToken: string
    avatar?: Buffer
    name: string
    email: Ip.User.Email
    job?: string
  }): Promise<User> => {
    const user = await this.prisma.user.findFirst({where: {email}})
    if (!user) {
      this.log.info(`Create account ${email}.`)
      return this.prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          name,
          accessToken,
          job: job,
          avatar: avatar as any,
          lastConnectedAt: new Date(),
        },
      })
    } else {
      return this.prisma.user.update({
        where: {email},
        data: {
          accessToken,
          name,
          avatar: avatar as any,
          job: job,
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

  readonly connectAs = async ({connectedUser, spyEmail}: {connectedUser: Ip.User; spyEmail: Ip.User.Email}) => {
    const connectAsUser = await this.user.getByEmail(spyEmail).then(HttpError.throwNotFoundIfUndefined('connectAs'))
    if (connectAsUser.id === connectedUser.id) throw new SessionError.UserNoAccess()
    return this.get(connectAsUser)
  }

  readonly revertConnectAs = async (originalEmail?: Ip.User.Email) => {
    if (!originalEmail) {
      throw new HttpError.Forbidden('')
    }
    const user = await this.user.getByEmail(originalEmail).then(HttpError.throwNotFoundIfUndefined(''))
    return this.get(user)
  }

  readonly get = async (user: Ip.User): Promise<UserProfile> => {
    const workspaces = await this.workspace.getByUser(user.email)
    return {
      workspaces,
      user,
    }
  }
}
