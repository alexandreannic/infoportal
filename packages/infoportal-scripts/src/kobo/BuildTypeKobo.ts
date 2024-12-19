import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import * as fs from 'fs'
import {capitalize, KoboIndex} from 'infoportal-common'
import {koboSdk} from '../index'
import {appConf} from '../appConf'
import {Kobo, KoboClient} from 'kobo-sdk'

interface KoboInterfaceGeneratorParams {
  outDir: string,
  formName: string,
  formId: string,
  skipQuestionTyping?: string[]
  overrideOptionsByQuestion?: Record<string, Record<string, string[]>>
  overrideAllOptions?: Record<string, string[]>
  langIndex?: number
}

export class BuildKoboType {
  constructor(
    private sdk = koboSdk,
    private outDir: string = appConf.rootProjectDir + '/../infoportal-common/src/kobo/generated'
  ) {
  }

  static readonly config = Obj.map({
    shelter_north: {
      formId: KoboIndex.byName('shelter_north').id,
    },
    partnership_partnersDatabase: {
      formId: KoboIndex.byName('partnership_partnersDatabase').id,
      overrideOptionsByQuestion: {
        Type_of_organization: {
          'municipal_organization_or_othe': [`Government-run entity`],
        }
      }
    },
    pseah_training_tracker: {
      formId: KoboIndex.byName('pseah_training_tracker').id,
    },
    partnership_assessment: {
      formId: KoboIndex.byName('partnership_assessment').id,
    },
    partnership_initialQuestionnaire: {
      formId: KoboIndex.byName('partnership_initialQuestionnaire').id,
    },
    protection_communityMonitoring: {
      formId: KoboIndex.byName('protection_communityMonitoring').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_counselling: {
      formId: KoboIndex.byName('protection_counselling').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_referral: {
      formId: KoboIndex.byName('protection_referral').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_coc: {
      formId: KoboIndex.byName('protection_coc').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_gbv: {
      formId: KoboIndex.byName('protection_gbv').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_gbvSocialProviders: {
      formId: KoboIndex.byName('protection_gbvSocialProviders').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_groupSession: {
      formId: KoboIndex.byName('protection_groupSession').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    protection_pss: {
      formId: KoboIndex.byName('protection_pss').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    bn_cashForRentApplication: {
      formId: KoboIndex.byName('bn_cashForRentApplication').id,
      skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    bn_rapidResponse: {
      formId: KoboIndex.byName('bn_rapidResponse').id
    },
    bn_rapidResponse2: {
      formId: KoboIndex.byName('bn_rapidResponse2').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    shelter_cashForRepair: {
      formId: KoboIndex.byName('shelter_cashForRepair').id
    },
    ecrec_msmeGrantSelection: {
      formId: KoboIndex.byName('ecrec_msmeGrantSelection').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    ecrec_msmeGrantEoi: {
      formId: KoboIndex.byName('ecrec_msmeGrantEoi').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    ecrec_msmeGrantReg: {
      formId: KoboIndex.byName('ecrec_msmeGrantReg').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    ecrec_vet2_dmfa: {
      formId: KoboIndex.byName('ecrec_vet2_dmfa').id,
      skipQuestionTyping: [
        'hromada',
      ]
    },
    ecrec_vet_bha388: {
      formId: KoboIndex.byName('ecrec_vet_bha388').id,
      skipQuestionTyping: [
        'hromada',
      ]
    },
    ecrec_msme_bha388: {
      formId: KoboIndex.byName('ecrec_msme_bha388').id,
      skipQuestionTyping: [
        'hromada',
      ]
    },
    ecrec_cashRegistration: {
      formId: KoboIndex.byName('ecrec_cashRegistration').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    shelter_cashForShelter: {
      formId: KoboIndex.byName('shelter_cashForShelter').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    ecrec_cashRegistrationBha: {
      formId: KoboIndex.byName('ecrec_cashRegistrationBha').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    ecrec_vetApplication: {
      langIndex: 1,
      formId: KoboIndex.byName('ecrec_vetApplication').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    ecrec_vetEvaluation: {
      langIndex: 1,
      formId: KoboIndex.byName('ecrec_vetEvaluation').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_verificationEcrec: {
      formId: KoboIndex.byName('meal_verificationEcrec').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_verificationWinterization: {
      formId: KoboIndex.byName('meal_verificationWinterization').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_visitMonitoring: {
      formId: KoboIndex.byName('meal_visitMonitoring').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_pdmStandardised: {
      formId: KoboIndex.byName('meal_pdmStandardised').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_cashPdm: {
      formId: KoboIndex.byName('meal_cashPdm').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_shelterPdm: {
      formId: KoboIndex.byName('meal_shelterPdm').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_cfmInternal: {
      formId: KoboIndex.byName('meal_cfmInternal').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    meal_cfmExternal: {
      formId: KoboIndex.byName('meal_cfmExternal').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    shelter_nta: {
      formId: KoboIndex.byName('shelter_nta').id, skipQuestionTyping: [
        'ben_det_hromada',
        'ben_det_raion',
      ]
    },
    shelter_ta: {
      formId: KoboIndex.byName('shelter_ta').id,
      skipQuestionTyping: ['ben_det_hromada', 'ben_det_raion',]
    },
    bn_rapidResponseSida: {
      formId: KoboIndex.byName('bn_rapidResponseSida').id,
    },
    protection_hhs2_1: {
      formId: KoboIndex.byName('protection_hhs2_1').id,
      overrideAllOptions: {
        other_specify: ['Other'],
        health_1_2: ['Health'],
      },
      skipQuestionTyping: [
        'what_is_your_area_of_origin_raion',
        'what_is_your_area_of_origin_hromada',
        'where_are_you_current_living_hromada',
        'where_are_you_current_living_raion',
      ],
      overrideOptionsByQuestion: {
        what_are_the_barriers_to_accessing_health_services: {
          safety_risks_associated_with_access_to_presence_at_health_facility: ['Safety risks associated with access to/presence at health facility'],
        },
        what_are_your_main_concerns_regarding_your_accommodation: {
          'risk_of_eviction': [`Risk of eviction`],
          'accommodations_condition': [`Accommodation’s condition`],
          'overcrowded_lack_of_privacy': [`Overcrowded/Lack of privacy`],
          'lack_of_functioning_utilities': [`Lack of functioning utilities`],
          'lack_of_connectivity': [`Lack of connectivity`],
          'security_and_safety_risks': [`Security and safety risks`],
          'lack_of_financial_compensation_or_rehabilitation_for_damage_or_destruction_of_housing': [`Lack of support for damaged housing`],
        },
        what_is_the_type_of_your_household: {
          'one_person_household': [`One person household`],
          'couple_without_children': [`Couple without children`],
          'couple_with_children': [`Couple with children`],
          'mother_with_children': [`Mother with children`],
          'father_with_children': [`Father with children`],
          'extended_family': [`Extended family`],
        }
      }
    },
    protection_hhs3: {
      formId: KoboIndex.byName('protection_hhs3').id,
      overrideAllOptions: {
        other_specify: ['Other'],
        health_1_2: ['Health'],
      },
      overrideOptionsByQuestion: {
        what_is_the_general_condition_of_your_accommodation: {
          partially_damaged: [`Partially damaged`],
          severely_damaged: [`Severely damaged`],
          destroyed: [`Destroyed`],
        },
        what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members: {
          fear_of_property_being_damaged_or_destroyedby_armed_violence: [`Fear of property being damaged by armed violence`],
        },
        have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation: {
          lack_of_devices_or_internet_connectivity_to_access_online_procedure: ['Unable to access online procedure']
        },
        why_did_you_decide_to_return_to_your_area_of_origin: {
          improved_security_in_area_of_origin: [`Improved security in area of origin`],
          increased_restored_service_availability_in_area_of_origin: [`Increased/restored service availability in area of origin`],
          increased_restored_access_to_livelihood_employment_and_economic_opportunities_in_area_of_origin: [`Increased access to livelihood in area of origin`],
          repaired_restored_infrastructure_in_area_of_origin: [`Repaired/restored infrastructure in area of origin`],
          repaired_housing_compensation_for_destroyedor_damaged_property_in_area_of_origin: [`Repaired property in area of origin`],
          seeking_family_reunification_in_area_of_origin: [`Seeking family reunification in area of origin`],
          insecurity_armed_conflict_in_area_of_displacement: [`Insecurity/armed conflict`],
          social_tensions_and_conflict_with_host_community_in_area_of_displacement: [`Social tensions and conflict with host community`],
          eviction_eviction_threats_in_area_of_displacement: [`Eviction/eviction threats`],
          lack_of_access_to_essential_services_in_area_of_displacement: [`Lack of access to essential services`],
          lack_of_access_to_livelihoods_employment_and_economic_opportunities_in_area_of_displacement: ['Lack of access to livelihoods']
        },
        do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area: {
          lack_of_transportationfinancial_resources_to_pay_transportation: ['Transportation/financial constraints'],
        },
        what_is_your_1_priority: {
          health_m: ['Mental health'],
          health_1_2: ['Health care'],
          health_srh: ['SRHealth'],
        },
        what_are_the_main_sources_of_income_of_your_household: {
          'casual_labour': [`Casual (Temporary) Labour`],
          'humanitarian_assistance': [`Humanitarian Assistance`],
          'social_protection_payments': [`Social protection payments`],
        },
        what_are_the_barriers_to_accessing_health_services: {
          safety_risks_associated_with_access_to_presence_at_health_facility: ['Safety risks linked with access to/presence at facilities'],
        },
        what_are_your_households_intentions_in_terms_of_place_of_residence: {
          integrate_into_the_local_community_of_current_place_of_residence: ['Integrate into the local community'],
          return_to_the_area_of_origin: [`Return to the place of habitual residence`],
        },
        what_housing_land_and_property_documents_do_you_lack: {
          'death_declaration_certificate_by_ambulance_or_police_of_predecessor': [`Death declaration certificate`],
        },
        what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges: {
          'reducing_consumption_of_essential_medicines_or_healthcare_services': [`Reducing healthcare expenses`],
        },
        what_are_your_main_concerns_regarding_your_accommodation: {
          'risk_of_eviction': [`Risk of eviction`],
          'accommodations_condition': [`Accommodation’s condition`],
          'overcrowded_lack_of_privacy': [`Overcrowded/Lack of privacy`],
          'lack_of_functioning_utilities': [`Lack of functioning utilities`],
          'lack_of_connectivity': [`Lack of connectivity`],
          'security_and_safety_risks': [`Security and safety risks`],
          'lack_of_financial_compensation_or_rehabilitation_for_damage_or_destruction_of_housing': [`Lack of support for damaged housing`],
        },
        what_is_the_type_of_your_household: {
          'one_person_household': [`One person household`],
          'couple_without_children': [`Couple without children`],
          'couple_with_children': [`Couple with children`],
          'mother_with_children': [`Mother with children`],
          'father_with_children': [`Father with children`],
          'extended_family': [`Extended family`],
        }
      }
    },
    bn_0_mpcaRegNewShort: {
      formId: KoboIndex.byName('bn_0_mpcaRegNewShort').id, skipQuestionTyping: ['hromada', 'raion']
    },
    bn_0_mpcaReg: {
      formId: KoboIndex.byName('bn_0_mpcaReg').id, skipQuestionTyping: ['hromada', 'raion']
    },
    bn_0_mpcaRegNoSig: {
      formId: KoboIndex.byName('bn_0_mpcaRegNoSig').id, skipQuestionTyping: ['hromada', 'raion']
    },
    bn_0_mpcaRegESign: {
      formId: KoboIndex.byName('bn_0_mpcaRegESign').id, skipQuestionTyping: ['hromada', 'raion']
    },
    bn_re: {
      formId: KoboIndex.byName('bn_re').id
    },
    bn_1_mpcaNfi: {
      formId: KoboIndex.byName('bn_1_mpcaNfi').id
    },
    bn_1_mpcaNfiNaa: {
      formId: KoboIndex.byName('bn_1_mpcaNfiNaa').id
    },
    bn_1_mpcaNfiMyko: {
      formId: KoboIndex.byName('bn_1_mpcaNfiMyko').id
    },
    bn_cashForRentRegistration: {
      formId: KoboIndex.byName('bn_cashForRentRegistration').id,
    },
    protection_hhs2: {
      formId: KoboIndex.byName('protection_hhs2').id,
      overrideAllOptions: {
        health_1_2: ['Health'],
      },
    },
    safety_incident: {
      formId: KoboIndex.byName('safety_incident').id,
      skipQuestionTyping: ['hromada', 'raion',],
    },
    partner_pomogaem: {
      formId: KoboIndex.byName('partner_pomogaem').id,
    },
    partner_lampa: {
      formId: KoboIndex.byName('partner_lampa').id,
    },
    partner_angels: {
      formId: KoboIndex.byName('partner_angels').id,
    },
    partner_misto_syly: {
      formId: KoboIndex.byName('partner_misto_syly').id,
    },
    meal_verificationPartnerBnre: {
      formId: KoboIndex.byName('meal_verificationPartnerBnre').id,
    },
  }, (k, v) => [k, {formName: capitalize(k), ...v} as Omit<KoboInterfaceGeneratorParams, 'outDir'>])

  readonly build = (f: keyof typeof BuildKoboType['config']) => {
    return new KoboInterfaceGenerator(this.sdk, {
      outDir: this.outDir,
      ...BuildKoboType.config[f],
    }).generate()
  }

  readonly buildAll = () => {
    return Promise.all(Obj.keys(BuildKoboType.config).map(this.build))
  }
}

const ignoredQuestionTypes: Kobo.Form['content']['survey'][0]['type'][] = [
  // 'calculate',
  'begin_group',
  'end_group',
  // 'note',
  'end_repeat',
]

class KoboInterfaceGenerator {

  constructor(
    private sdk: KoboClient,
    private options: KoboInterfaceGeneratorParams
  ) {
  }

  readonly excludedQuestionNames = [
    'start',
    'end'
  ]

  readonly fixDuplicateName = (survey: Kobo.Form['content']['survey']): Kobo.Form['content']['survey'] => {
    const duplicate: Record<string, number> = {}
    return survey.map(q => {
      if (!q.name) return q
      if (duplicate[q.name] !== undefined) {
        duplicate[q.name] = duplicate[q.name] + 1
        q.name = q.name + duplicate[q.name]
      } else {
        duplicate[q.name] = 0
      }
      return q
    })
  }

  readonly generate = async () => {
    const form = await this.sdk.v2.getForm(this.options.formId)
    const survey = this.fixDuplicateName(form.content.survey)
    const mainInterface = this.generateInterface({survey, formId: this.options.formId,})
    const options = this.generateOptionsType({survey, choices: form.content.choices,})
    const mapping = this.generateFunctionMapping(survey)
    const location = this.options.outDir + '/'
    if (!fs.existsSync(location)) {
      fs.mkdirSync(location)
    }
    fs.writeFileSync(location + '/' + this.options.formName + '.ts', [
      `export namespace ${this.options.formName} {`,
      mainInterface.join('\n\t'),
      options,
      mapping,
      `}`,
    ].join(`\n`))
  }

  readonly extractQuestionNameFromGroupFn = `
const extractQuestionName = (_: Record<string, any>) => {
  const output: any = {}
  Object.entries(_).forEach(([k, v]) => {
    const arr = k.split('/')
    const qName = arr[arr.length - 1]
    output[qName] = v
  })
  return output
}`

  readonly generateFunctionMapping = (survey: Kobo.Form['content']['survey']) => {
    const repeatItems = this.getBeginRepeatQuestion(survey)
    const basicMapping = (name: string) => {
      return {
        integer: () => `_.${name} ? +_.${name} : undefined`,
        date: () => `_.${name} ? new Date(_.${name}) : undefined`,
        datetime: () => `_.${name} ? new Date(_.${name}) : undefined`,
        select_multiple: () => `_.${name}?.split(' ')`,
      }
    }
    const fnMappings = survey
      .filter(_ => !ignoredQuestionTypes.includes(_.type))
      .filter(_ => repeatItems.every(r => {
        return !_.$qpath.includes(r.name + '-')
      }))
      .map(x => {
        const name = x.name ?? x.$autoname
        return [
          name,
          fnSwitch(x.type, {
            ...basicMapping(name),
            // integer: `_.${name} ? +_.${name} : undefined`,
            // date: `_.${name} ? new Date(_.${name}) : undefined`,
            // datetime: `_.${name} ? new Date(_.${name}) : undefined`,
            // select_multiple: `_.${name}?.split(' ')`,
            begin_repeat: () => {
              const groupedQuestions = survey.filter(_ => _.name !== x.name && _.$qpath?.includes(x.name + '-'))
              return `_['${name}']?.map(extractQuestionName).map((_: any) => {\n`
                + groupedQuestions.map(_ => {
                  const sname = _.name ?? _.$autoname
                  return [
                    sname,
                    fnSwitch(_.type, basicMapping(sname), () => undefined),
                  ]
                }).filter(_ => _[1] !== undefined).map(([questionName, fn]) => `\t\t_['${questionName}'] = ${fn}`).join(`\n`)
                + `\n\t\treturn _`
                + `\t\n})`
            }
          }, _ => undefined)
        ]
      })
      .filter(_ => _[1] !== undefined)
    return this.extractQuestionNameFromGroupFn + '\n\n'
      + `export const map = (_: Record<keyof T, any>): T => ({\n`
      + `\t..._,\n`
      + `${fnMappings.map(([questionName, fn]) => `\t${questionName}: ${fn},`).join('\n')}\n`
      + `}) as T`
  }

  // readonly skipQuestionInBeginRepeat = (survey: KoboApiForm.ts['content']['survey']) => (_: KoboApiForm.ts['content']['survey'][lang]) => {
  //   const repeatItem = this.getBeginRepeatQuestion(survey)
  //   return _ => repeatItem.every(r => {
  //     return !_.$qpath.includes(r.name + '-')
  //   })
  // }

  readonly getBeginRepeatQuestion = (survey: Kobo.Form['content']['survey']) => {
    return survey.filter(_ => _.type === 'begin_repeat')
  }

  get langIndex() {
    return this.options.langIndex ?? 0
  }

  readonly generateInterface = ({
    survey,
    formId,
  }: {
    survey: Kobo.Form['content']['survey'],
    formId: Kobo.FormId
  }): string[] => {
    const indexOptionId = seq(survey).groupBy(_ => _.select_from_list_name!)
    const repeatItems = this.getBeginRepeatQuestion(survey)
    const properties = survey
      .filter(_ => !ignoredQuestionTypes.includes(_.type))
      .filter(_ => repeatItems.every(r => {
        return !_.$qpath.includes(r.name + '-')
      }))
      .map(x => {
        const lastQuestionNameHavingOptionId = seq(indexOptionId[x.select_from_list_name ?? '']).last()?.name
        const basicQuestionTypeMapping = (lastQuestionNameHavingOptionId?: string) => ({
          'select_one': () => 'undefined | ' + (this.options.skipQuestionTyping?.includes(x.name!) ? 'string' : `Option<'${lastQuestionNameHavingOptionId}'>`),
          'select_multiple': () => 'undefined | ' + (this.options.skipQuestionTyping?.includes(x.name!) ? 'string[]' : `Option<'${lastQuestionNameHavingOptionId}'>[]`),
          'integer': () => 'number | undefined',
          'decimal': () => 'number | undefined',
          'text': () => 'string | undefined',
          'date': () => 'Date | undefined',
          'datetime': () => 'Date | undefined',
        })
        const type = fnSwitch(x.type, {
          ...basicQuestionTypeMapping(lastQuestionNameHavingOptionId),
          'begin_repeat': () => {
            const groupedQuestions = survey.filter(_ => _.name !== x.name && _.$qpath?.includes(x.name + '-'))
            return '{' + groupedQuestions.map(_ => {
              const lastQuestionNameHavingOptionId = seq(indexOptionId[_.select_from_list_name ?? '']).last()?.name
              return `'${_.$autoname}': ${fnSwitch(_.type, basicQuestionTypeMapping(lastQuestionNameHavingOptionId), _ => 'string')} | undefined`
            }).join(',') + '}[] | undefined'

          }
        }, () => 'string')
        return (x.label ? `// ${x.$xpath} [${x.type}] ${x.label[this.langIndex]?.replace(/\s/g, ' ')}\n` : '')
          + `  '${x.name ?? x.$autoname}': ${type},`
      })
    return [
      `export type Option<T extends keyof typeof options> = keyof (typeof options)[T]`,
      `// Form id: ${formId}`,
      `export interface T {`,
      ...properties.map(_ => `  ${_}`),
      `}`
    ]
  }

  readonly generateOptionsType = ({
    survey,
    choices,
  }: {
    survey: Kobo.Form['content']['survey'],
    choices: Kobo.Form['content']['choices']
  }) => {
    const indexOptionId = seq(survey).reduceObject<Record<string, string>>(_ => [_.select_from_list_name ?? '', _.name ?? ''])
    const res: Record<string, Record<string, string>> = {}
    choices?.forEach(choice => {
      if (this.options.skipQuestionTyping?.includes(indexOptionId[choice.list_name])) return
      const questionName = indexOptionId[choice.list_name]
      if (!res[questionName]) {
        res[questionName] = {}
      }
      res[questionName][choice.name] = (() => {
        try {
          return this.options.overrideOptionsByQuestion?.[questionName]?.[choice.name]?.[0]
            ?? this.options.overrideAllOptions?.[choice.name]?.[0]
            ?? choice.label[this.langIndex]
        } catch (e: any) {
          return choice.label[this.langIndex]
        }
      })()
    })
    return `export const options = {\n`
      + Object.entries(res).map(([k, v]) => `${k}: {\n` +
        Object.keys(v)
          .map(sk => `\t'${sk.replaceAll(`'`, `\\'`)}': \`${v[sk]?.replace('`', '')}\``)
          .join(',\n')
      ).join('\n},\n')
      + '\n}} as const'
  }
}