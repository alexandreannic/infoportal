import {AILocationHelper, DrcProject, DrcProjectHelper, Protection_gbv} from 'infoportal-common'
import {AiGbvType} from '@/features/ActivityInfo/Gbv/aiGbvType'
import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {aiInvalidValueFlag} from '@/features/ActivityInfo/shared/AiTable'
import {InferTypedAnswer} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {Period} from 'infoportal-common'

export namespace AiGbvMapper {

  export type Type = Omit<AiGbvType.Type,
    'Reporting Organization' |
    'Response Theme'
  > & AiGbvType.TypeSub & {
    answer: Record<string, any>
  }

  const planCode = {
    [DrcProject['UKR-000345 BHA2']]: 'GBV-DRC-00001',
    [DrcProject['UKR-000347 DANIDA']]: 'GBV-DRC-00002',
    [DrcProject['UKR-000355 Danish MFA']]: 'GBV-DRC-00003',
    [DrcProject['UKR-000330 SDC2']]: 'GBV-DRC-00004',
    [DrcProject['UKR-000304 PSPU']]: 'GBV-DRC-00005',
    [DrcProject['UKR-000371 ECHO3']]: 'GBV-DRC-00006',
    [DrcProject['UKR-000372 ECHO3']]: 'GBV-DRC-00006',
    [DrcProject['UKR-000363 UHF8']]: 'GBV-DRC-00007',
  } as const

  export const mapGbvActivity = (period: Partial<Period>) => async (res: ApiPaginate<InferTypedAnswer<'protection_gbv'>>['data']) => {
    const periodStr = AiMapper.getPeriodStr(period)
    const data: Type[] = await Promise.all(res
      .filter(_ => _.new_ben !== 'no')
      .filter(_ => !!_.activity && !(_.activity.includes('other') && _.activity.length === 1))
      .flatMap(d => {
        const kitAssigned = {
          elderly: d.elderly ?? 0,
          kit_other: d.kit_other ?? 0,
          winter: d.winter ?? 0,
          basic: d.basic ?? 0,
        }
        return seq(d.custom.persons!).compactBy('age').sortByNumber(_ => _.age, '9-0').flatMap((ind, index) => {
          return (d.activity ?? []).map(async activity => {
            const res: Type = {
              answer: d,
              ...AiMapper.getLocationByKobo(d),
              'Settlement': await AILocationHelper.findSettlementByIso(d.ben_det_hromada_001).then(_ => _?._5w ?? aiInvalidValueFlag + d.ben_det_hromada_001),
              ...AiMapper.disaggregatePersons([ind]),
              'Reporting Month': periodStr,
              'Plan/Project Code': fnSwitch(
                DrcProjectHelper.search(Protection_gbv.options.project[d.project!])!,
                planCode,
                () => aiInvalidValueFlag + Protection_gbv.options.project[d.project!] as any
              )!,
              'Population Group': AiMapper.mapPopulationGroup(ind.displacement),
              'Indicators': fnSwitch(activity!, {
                'awareness_raising': `# of individuals reached with awareness-raising activities and GBV-life-saving information`,
                'psychosocial_support': `# of individuals provided with specialized individual or group GBV psychosocial support that meet GBViE standards (not including recreational activities)`,
                'education_sessions': `# of women and girls who received recreational and livelihood skills including vocational education sessions in women and girls safe spaces`,
                'training_actors': `# of non-GBV service providers trained on GBV prevention, risk mitigation and referrals that meet GBViE minimum standards`,
                'training_providers': `# of GBV service providers trained on GBV prevention and response that meet GBViE minimum standards`,
                'dignity_kits': `# of women and girls at risk who received dignity kits`,
              }, () => aiInvalidValueFlag as any),
              ...activity === 'dignity_kits' && (() => {
                const toDistribute = {
                  elderly: 0,
                  winter: 0,
                  basic: 0,
                  kit_other: 0,
                }
                Obj.keys(kitAssigned).some(kit => {
                  if (kitAssigned[kit] > 0) {
                    kitAssigned[kit] = kitAssigned[kit] - 1
                    toDistribute[kit] = 1
                    return true
                  }
                  return false
                })
                if (Obj.values(toDistribute).every(_ => _ === 0)) {
                  throw new Error('Kit count issue for ' + d.id)
                }
                return {
                  'Type of distribution': fnSwitch(d.distribute!, Protection_gbv.options.distribute, () => aiInvalidValueFlag as any),
                  'Who distributed the kits?': fnSwitch(d.distributor!, Protection_gbv.options.distributor, () => aiInvalidValueFlag as any),
                  'Basic/Essential': toDistribute.basic,
                  'Elderly': toDistribute.elderly,
                  'Winter': toDistribute.winter,
                  'Other': toDistribute.kit_other,
                  'Dignity kits in stock?': 'No',
                  // 'Any assessment/feedback done/collected on post distribution of kits?': fnSwitch(d.feedback!, Protection_gbv.options.feedback, () => 'No assessments planned/done'),
                  'Any assessment/feedback done/collected on post distribution of kits?': 'No assessments planned/done',
                }
              })()
            }
            return res
          })
        })
      }))
    return data
  }
}