import {ApiClient} from '../ApiClient'
import {Access, AccessSearch, KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {UUID} from 'infoportal-common'
import {UserSdk} from '@/core/sdk/server/user/UserSdk'

interface SearchByFeature {
  (_: {
    workspaceId: UUID
    featureId: AppFeatureId.kobo_database
    email?: string
  }): Promise<Access<KoboDatabaseAccessParams>[]>

  (_: {workspaceId: UUID; featureId?: AppFeatureId; email?: string}): Promise<Access<any>[]>
}

type FeatureCreateBase = Omit<Access, 'drcJob' | 'id' | 'createdAt' | 'updatedAt' | 'featureId' | 'params'> & {
  drcJob?: string[]
  groupId?: UUID
  workspaceId: UUID
}

interface AccessUpdate extends Pick<Access, 'id' | 'workspaceId' | 'drcJob' | 'drcOffice' | 'level'> {}

interface AccessCreate {
  (
    _: FeatureCreateBase & {featureId: AppFeatureId.kobo_database; params: KoboDatabaseAccessParams},
  ): Promise<Access<KoboDatabaseAccessParams>>

  (_: FeatureCreateBase & {featureId?: AppFeatureId; params?: any}): Promise<Access<any>>
}

export class AccessSdk {
  constructor(
    private client: ApiClient,
    private userSdk: UserSdk,
  ) {}

  static readonly filterByFeature: {
    (_: AppFeatureId.kobo_database): (a: Access<any>) => a is Access<KoboDatabaseAccessParams>
    (_?: AppFeatureId): (a: Access<any>) => a is Access<any>
  } =
    (featureId): any =>
    (access: Access<any>) => {
      return !featureId || access.featureId === featureId
    }

  readonly create: AccessCreate = async ({workspaceId, ...body}) => {
    return this.client.put<Access>(`/${workspaceId}/access`, {body})
  }

  readonly update = async ({workspaceId, id, ...body}: AccessUpdate) => {
    return this.client.post<Access>(`/${workspaceId}/access/${id}`, {body})
  }

  readonly remove = ({workspaceId, id}: {workspaceId: UUID; id: UUID}) => {
    return this.client.delete<Access>(`/${workspaceId}/access/${id}`)
  }

  readonly search: SearchByFeature = <T = any>({workspaceId, ...params}: AccessSearch): Promise<Access<T>[]> => {
    return this.client
      .get<Record<keyof Access, any>[]>(`/${workspaceId}/access`, {qs: params})
      .then(_ => _.map(Access.map))
  }

  readonly searchForConnectedUser: SearchByFeature = <T = any>({
    workspaceId,
    ...params
  }: AccessSearch): Promise<Access<T>[]> => {
    return this.client
      .get<Record<keyof Access, any>[]>(`/${workspaceId}/access/me`, {qs: params})
      .then(_ => _.map(Access.map))
  }

  // readonly searchByFeature: SearchByFeature = (featureId) => {
  //   switch (featureId) {
  //     case AppFeatureId.kobo_database:
  //       return this.search<KoboDatabaseFeatureParams>({featureId})
  //     default:
  //       throw new Error('To implement')
  //   }
  // }
}
