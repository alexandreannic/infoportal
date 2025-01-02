import {Protection_hhs2, Protection_hhs3} from '../generated'
import {KoboBaseTags, KoboSubmissionFlat, PersonDetails} from './Kobo'
import {DrcProject} from '../../type/Drc'
import {KoboGeneralMapping} from './KoboMapperPerson'

export namespace KoboProtection_hhs3 {

  export type Person = PersonDetails & {
    lackDoc: Protection_hhs2.T['does_1_lack_doc']
    isIdpRegistered: Protection_hhs2.T['is_member_1_registered']
  }

  export type T = KoboSubmissionFlat<Omit<Protection_hhs3.T, 'hh_char_hh_det'>, ProtectionHhsTags> & {
    persons: Person[]
  }

  export const map = (d: KoboSubmissionFlat<Protection_hhs3.T, ProtectionHhsTags>): KoboSubmissionFlat<T, ProtectionHhsTags> => {
    const r: T = d as unknown as T
    r.persons = d.hh_char_hh_det?.map((_, i) => {
      return {
        ...KoboGeneralMapping.mapPersonDetails(_ as any),
        lackDoc: d.hh_char_hh_doc?.[i].does_lack_doc,
        isIdpRegistered: d.hh_char_hh_doc?.[i].is_member_registered
      }
    }) ?? []
    return r
  }
}

export interface ProtectionCommunityMonitoringTags extends KoboBaseTags {
  project?: DrcProject
}

export interface ProtectionHhsTags extends KoboBaseTags {
  projects?: DrcProject[]
}

export const currentProtectionProjects = [
  DrcProject['UKR-000363 UHF8'],
  DrcProject['UKR-000298 Novo-Nordisk'],
  DrcProject['UKR-000322 ECHO2'],
  DrcProject['UKR-000314 UHF4'],
  DrcProject['UKR-000336 UHF6'],
  DrcProject['UKR-000226 SDC'],
  DrcProject['UKR-000309 OKF'],
  DrcProject['UKR-000372 ECHO3'],
  DrcProject['UKR-000355 Danish MFA'],
  DrcProject['UKR-000397 GFFO'],
  DrcProject['None'],
]




