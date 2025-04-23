import {Obj} from '@axanc/ts-utils'
import {UserSession} from '@/core/sdk/server/session/Session'
import {Access} from '@/core/sdk/server/access/Access'

export enum AppFeatureId {
  kobo_database = 'kobo_database',
  admin = 'admin',
}

export interface AppFeature {
  id: AppFeatureId
  name: string
  materialIcons: string
  color: string
  path: string
  category: 'programs' | 'general' | 'settings'
  showIf?: (_?: UserSession, a?: Access[]) => boolean | undefined
}

export const appFeaturesIndex: Record<AppFeatureId, AppFeature> = {
  kobo_database: {
    id: AppFeatureId.kobo_database,
    name: 'Kobo Databases',
    materialIcons: 'fact_check',
    color: '#259af4',
    path: '/database',
    category: 'general',
  },
  admin: {
    id: AppFeatureId.admin,
    name: 'Admin',
    materialIcons: 'admin_panel_settings',
    color: 'silver',
    path: '/admin',
    category: 'settings',
    showIf: (_) => _ && _?.admin,
  },
} as const

export const appFeatures = Obj.values(appFeaturesIndex)
