import {AppFeatureId} from '@/features/appFeatureId'
import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'

export enum AccessLevel {
  Read = 'Read',
  Write = 'Write',
  Admin = 'Admin',
}

export const accessLevelIcon: Record<AccessLevel, string> = {
  Read: 'visibility',
  Write: 'edit',
  Admin: 'gavel',
}

export interface Access<T = any> {
  workspaceId: UUID
  id: string
  featureId?: AppFeatureId
  params?: T
  level: AccessLevel
  email?: string
  drcJob?: string
  groupId?: UUID
  groupName?: string
  drcOffice?: string
  createdAt: Date
  updatedAt?: Date
}

export interface WfpDeduplicationAccessParams {
  filters?: Record<string, string[]>
}

export interface KoboDatabaseAccessParams {
  koboFormId: Kobo.FormId
  filters?: Record<string, string[]>
}

export class KoboDatabaseAccessParams {
  static readonly create = (_: KoboDatabaseAccessParams): any => _
}

export interface AccessSearch {
  workspaceId: UUID
  featureId?: AppFeatureId
}

interface FilterByFeature {
  (f: AppFeatureId.kobo_database): (_: Access<any>) => _ is Access<KoboDatabaseAccessParams>

  (f: AppFeatureId): (_: Access<any>) => _ is Access<any>
}

export interface AccessSum {
  read: boolean
  write: boolean
  admin: boolean
}

export class Access {
  static readonly toSum = (accesses: Access<any>[], admin?: boolean) => {
    return {
      admin: admin || !!accesses.find(_ => _.level === AccessLevel.Admin),
      write: admin || !!accesses.find(_ => _.level === AccessLevel.Write || _.level === AccessLevel.Admin),
      read:
        admin ||
        !!accesses.find(
          _ => _.level === AccessLevel.Write || _.level === AccessLevel.Admin || _.level === AccessLevel.Read,
        ),
    }
  }

  // @ts-ignore
  static readonly filterByFeature: FilterByFeature = f => _ => {
    return _.featureId === f
  }

  static readonly map = (_: Record<keyof Access, any>): Access => {
    _.createdAt = new Date(_.createdAt)
    _.updatedAt = new Date(_.updatedAt)
    return _
  }
}
