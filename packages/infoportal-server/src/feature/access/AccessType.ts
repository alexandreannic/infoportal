import {FeatureAccess} from '@prisma/client'
import {Kobo} from 'kobo-sdk'

export enum AppFeatureId {
  kobo_database = 'kobo_database',
}

export interface KoboDatabaseAccessParams {
  koboFormId: Kobo.FormId
  filters?: Record<string, string[]>
}

export interface KoboDatabaseFeatureParams {
  koboFormId: Kobo.FormId
  filters?: Record<string, string[]>
}

export class KoboDatabaseFeatureParams {
  static readonly create = (_: KoboDatabaseFeatureParams): any => _
}

export interface Access<T = any> extends Omit<FeatureAccess, 'params'> {
  params: T | null
}
