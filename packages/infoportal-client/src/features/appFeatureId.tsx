import {Obj} from '@alexandreannic/ts-utils'
import {UserSession} from '@/core/sdk/server/session/Session'
import {appConfig} from '@/conf/AppConfig'
import {Access} from '@/core/sdk/server/access/Access'
import {KoboIndex} from 'infoportal-common'

export enum AppFeatureId {
  meal = 'meal',
  kobo_database = 'kobo_database',
  mpca = 'mpca',
  ecrec = 'ecrec',
  shelter = 'shelter',
  partnership = 'partnership',
  wfp_deduplication = 'wfp_deduplication',
  activity_info = 'activity_info',
  cfm = 'cfm',
  admin = 'admin',
  sandbox = 'sandbox',
  snapshot = 'snapshot',
  hdp = 'hdp',
  safety = 'safety',
  protection = 'protection',
  metaDashboard = 'metaDashboard',
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
  metaDashboard: {
    id: AppFeatureId.metaDashboard,
    name: 'Meta Dashboard',
    materialIcons: 'language',
    color: '#7300d7',
    path: '/meta-dashboard',
    category: 'general',
    showIf: (u) => true,
  },
  kobo_database: {
    id: AppFeatureId.kobo_database,
    name: 'Kobo Databases',
    materialIcons: 'fact_check',
    color: '#259af4',
    path: '/database',
    category: 'general',
  },
  shelter: {
    id: AppFeatureId.shelter,
    name: 'Shelter',
    materialIcons: 'home_work',
    color: '#742020',
    path: '/shelter',
    category: 'programs',
    showIf: (u, accesses) => {
      return (
        u?.admin ||
        (accesses &&
          !!accesses
            .filter(Access.filterByFeature(AppFeatureId.kobo_database))
            .find((_) => _.params?.koboFormId === KoboIndex.byName('shelter_nta').id))
      )
    },
  },
  mpca: {
    id: AppFeatureId.mpca,
    name: 'Cash Assistance',
    materialIcons: 'savings',
    color: '#00d82e',
    path: '/mpca',
    category: 'programs',
    showIf: (u, accesses) => {
      return true
      // return u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.mpca)
    },
  },
  ecrec: {
    id: AppFeatureId.ecrec,
    name: 'Economic Recovery',
    materialIcons: 'agriculture',
    color: '#daba00',
    category: 'programs',
    path: '/ecrec',
    showIf: (u, accesses) => true, // TODO: should we restrict access to this feature?
  },
  protection: {
    id: AppFeatureId.protection,
    name: 'Protection',
    // materialIcons: 'display_settings',
    materialIcons: 'diversity_3',
    color: '#418fde',
    path: '/protection',
    category: 'programs',
    showIf: (u, accesses) => {
      return true
    },
  },
  meal: {
    id: AppFeatureId.meal,
    name: 'MEAL',
    // materialIcons: 'display_settings',
    materialIcons: 'troubleshoot',
    color: '#1f9b97',
    path: '/meal',
    category: 'programs',
    showIf: (u, accesses) => {
      return true
      // u?.admin || accesses && !!accesses
      //   .filter(Access.filterByFeature(AppFeatureId.kobo_database))
      //   .find(_ => _.params?.koboFormId === KoboIndex.byName('bn_re').id)
      // return u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.mpca)
    },
  },
  activity_info: {
    materialIcons: 'group_work',
    id: AppFeatureId.activity_info,
    name: 'Activity Info',
    color: '#00e6b8',
    path: '/activity-info',
    category: 'general',
    showIf: (_) => true,
  },
  wfp_deduplication: {
    id: AppFeatureId.wfp_deduplication,
    name: 'WFP Deduplication',
    materialIcons: 'join_left',
    color: '#f1a100',
    path: '/wfp-deduplication',
    category: 'general',
    showIf: (u, accesses) => {
      return u?.admin || (accesses && !!accesses.find((_) => _.featureId === AppFeatureId.wfp_deduplication))
    },
  },
  hdp: {
    id: AppFeatureId.hdp,
    name: 'HDP',
    materialIcons: 'rocket_launch',
    // materialIcons: 'explosion',
    // materialIcons: 'destruction',
    // materialIcons: 'bomb',
    color: '#027ca2',
    path: '/hdp',
    category: 'programs',
    showIf: (u, accesses) => {
      return false
    },
  },
  cfm: {
    id: AppFeatureId.cfm,
    name: 'CFM',
    materialIcons: 'support_agent',
    color: '#1c2c73',
    path: '/cfm',
    category: 'programs',
    showIf: (u, accesses) => true,
    // showIf: (u, accesses) => u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.cfm)
  },
  [AppFeatureId.partnership]: {
    id: AppFeatureId.partnership,
    name: 'Partnership',
    materialIcons: 'handshake',
    color: '#8ab4f8',
    path: '/partnership',
    category: 'programs',
    showIf: (u, accesses) => true,
    // showIf: (u, accesses) => u?.admin || accesses && !!accesses.find(_ => _.featureId === AppFeatureId.cfm)
  },
  safety: {
    id: AppFeatureId.safety,
    name: 'Safety',
    // materialIcons: 'display_settings',
    materialIcons: 'security',
    color: '#dd2222',
    path: '/safety',
    category: 'programs',
    showIf: (u, accesses) => {
      return true
    },
  },
  snapshot: {
    id: AppFeatureId.snapshot,
    name: 'Snapshots',
    materialIcons: 'photo_camera',
    color: 'silver',
    path: '/snapshot',
    category: 'settings',
    showIf: (_) => true,
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
  sandbox: {
    id: AppFeatureId.sandbox,
    color: '#c0c0c0',
    materialIcons: 'api',
    name: 'Sandbox',
    path: '/sandbox',
    category: 'settings',
    showIf: (_) => _ && _?.email === appConfig.contact,
  },
} as const

export const appFeatures = Obj.values(appFeaturesIndex)
