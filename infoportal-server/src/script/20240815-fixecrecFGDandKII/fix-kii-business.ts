import {PrismaClient} from '@prisma/client'
import {KoboMappedAnswersService} from '../../feature/kobo/KoboMappedAnswersService'
import {KoboSdkGenerator} from '../../feature/kobo/KoboSdkGenerator'
import {scriptConf} from '../ScriptConf'
import {Bn_re, KoboAnswer, KoboAnswerFlat, KoboIndex, KoboSdkv1} from '@infoportal-common'
import {fnSwitch} from '@alexandreannic/ts-utils'
import PromiseRetry from 'promise-retry'
import PromisePool from '@supercharge/promise-pool'
import { roundToNearestMinutesWithOptions } from 'date-fns/esm/fp'


export const updateKiiBusiness = async () => {
  await updateKoboAnswers({
    formId: 'aCbkJiYuDkFo3vFedWpYvb',
    mapping: row => ({
      'information/primary_business_sectors': row.answers.primary_business_sectors,
      'information/speaking_business_sectors': row.answers.speaking_business_sectors,
      'information/most_relevant_documents': row.answers.most_relevant_documents,
      'information/none_most_relevant_documents': row.answers.none_most_relevant_documents,
      'information/businesses_relocated_from_area': row.answers.businesses_relocated_from_area,
      'information/type_businesses_relocated_from_area': row.answers.type_businesses_relocated_from_area,
      'information/motivations_businesses_relocated_from_area': row.answers.motivations_businesses_relocated_from_area,
      'information/businesses_relocated_the_area': row.answers.businesses_relocated_the_area,
      'information/type_businesses_relocated_the_area': row.answers.type_businesses_relocated_the_area,
      'information/motivations_businesses_relocated_the_area': row.answers.motivations_businesses_relocated_the_area,
      'information/knowledge_businesses_relocated_the_area': row.answers.knowledge_businesses_relocated_the_area,
      'information/businesses_returned_after_leaving': row.answers.businesses_returned_after_leaving,
      'information/type_businesses_returned_after_leaving': row.answers.type_businesses_returned_after_leaving,
      'information/motivations_businesses_returned_after_leaving': row.answers.motivations_businesses_returned_after_leaving,
      'information/new_businesses_opened': row.answers.new_businesses_opened,
      'information/new_businesses_opened_yes': row.answers.new_businesses_opened_yes,
      'information/challenges_businesses_facing': row.answers.challenges_businesses_facing,
      'information/barriers_women_accessing': row.answers.barriers_women_accessing,
      'barriers_employment/barriers_women_starting': row.answers.barriers_women_starting,
      'barriers_employment/women_seeking_employment': row.answers.women_seeking_employment,
      'barriers_employment/bar_idp': row.answers.bar_idp,
      'barriers_employment/bar_idp2': row.answers.bar_idp2,
      'barriers_employment/bar_idp3': row.answers.bar_idp3,
      'barriers_employment/bar_idp4': row.answers.bar_idp4,
      'recruitment_demand/challenges_currently_facing ': row.answers.challenges_currently_facing ,
      'recruitment_demand/skills_particularly_high': row.answers.skills_particularly_high,
      'recruitment_demand/businesses_undertaking_improve': row.answers.businesses_undertaking_improve,
      'recruitment_demand/interested_training_potential': row.answers.interested_training_potential,
      'service_mapping/describe_accessibility_training': row.answers.describe_accessibility_training,
      'service_mapping/businesses_working_employees': row.answers.businesses_working_employees,
      'service_mapping/what_other': row.answers.what_other,
    })
  })
  await updateKoboAnswers({
    formId: "aELY9ndpht6JBcZ54dXqqn",
    mapping: row => ({
      'barriers/main_challenges_employment': row.answers.main_challenges_employment,
      'barriers/specific': row.answers.specific,
      'barriers/specific_idp': row.answers.specific_idp,
      'barriers/material_resources_needed': row.answers.material_resources_needed,
      'barriers/have_access_resources': row.answers.have_access_resources,
      'barriers/overcome_these_problems': row.answers.overcome_these_problems,
      'job_preference/work_most_interested': row.answers.work_most_interested,
      'job_preference/work_most_interested_wipj': row.answers.work_most_interested_wipj,
      'job_preference/work_most_interested_witj': row.answers.work_most_interested_witj,
      'job_preference/work_most_interested_widl': row.answers.work_most_interested_widl,
      'job_preference/work_most_interested_wise': row.answers.work_most_interested_wise,
      'job_preference/sector_work_interested': row.answers.sector_work_interested,
      'job_preference/sector_work_interested_sial': row.answers.sector_work_interested_sial,
      'job_preference/sector_work_interested_sigs': row.answers.sector_work_interested_sigs,
      'job_preference/sector_work_interested_sisk': row.answers.sector_work_interested_sisk,
      'job_preference/sector_work_interested_sicw': row.answers.sector_work_interested_sicw,
      'job_preference/sector_work_interested_simw': row.answers.sector_work_interested_simw,
      'job_preference/sector_work_interested_sipl': row.answers.sector_work_interested_sipl,
      'job_preference/sector_work_interested_siew': row.answers.sector_work_interested_siew,
      'job_preference/sector_work_interested_sico': row.answers.sector_work_interested_sico,
      'job_preference/sector_work_interested_sigt': row.answers.sector_work_interested_sigt,
      'job_preference/sector_work_interested_simc': row.answers.sector_work_interested_simc,
      'job_preference/sector_work_interested_sitt': row.answers.sector_work_interested_sitt,
      'job_preference/sector_work_interested_siec': row.answers.sector_work_interested_siec,
      'job_preference/sector_work_interested_sihc': row.answers.sector_work_interested_sihc,
      'job_preference/sector_work_interested_sifw': row.answers.sector_work_interested_sifw,
      'job_preference/sector_work_interested_sict': row.answers.sector_work_interested_sict,
      'job_preference/sector_work_interested_siad': row.answers.sector_work_interested_siad,
      'job_preference/sector_work_interested_sids': row.answers.sector_work_interested_sids,
      'job_preference/sector_work_interested_sits': row.answers.sector_work_interested_sits,
      'job_preference/sector_work_interested_sihb': row.answers.sector_work_interested_sihb,
      'job_preference/sector_work_interested_sirs': row.answers.sector_work_interested_sirs,
      'job_preference/sector_work_interested_sips': row.answers.sector_work_interested_sips,
      'job_preference/sector_work_interested_sina': row.answers.sector_work_interested_sina,
      'job_preference/sector_work_interested_sigo': row.answers.sector_work_interested_sigo,
      'job_preference/sector_work_interested_other': row.answers.sector_work_interested_other,
      'job_preference/challenges_access_work': row.answers.challenges_access_work,
      'service_mapping/type_certification_needed': row.answers.type_certification_needed,
      'service_mapping/jobs_would_accept': row.answers.jobs_would_accept,
      'service_mapping/knowledge_skills_neede': row.answers.knowledge_skills_neede,
      'service_mapping/access_necessary_training': row.answers.access_necessary_training,
      'service_mapping/center_train': row.answers.center_train,
      'service_mapping/access_training_centres': row.answers.access_training_centres,
      'service_mapping/support_seeking_access': row.answers.support_seeking_access,
      'service_mapping/access_employment_centers': row.answers.access_employment_centers,
      'service_mapping/barriers_accessing_disincentives': row.answers.barriers_accessing_disincentives,
      'service_mapping/barriers_accessing_disincentives_other': row.answers.barriers_accessing_disincentives_other,
    })
  })
}

export const updateKoboAnswers = async ({
  formId,
  mapping,
}: {
  mapping: (_: KoboAnswer) => Record<string, string>
  formId: string
}) => {
  const flag = '[migration_sucessful]'
  const prisma = new PrismaClient()
  const service = new KoboMappedAnswersService(prisma)
  const formName = KoboIndex.searchById(formId)?.name ?? formId
  console.log(`Fetch ${formName}...`)
  const sdk = await new KoboSdkGenerator(prisma).get(scriptConf.kobo.prod.serverId)
  const rows = await sdk.v2.getAnswers(formId).then(_ => _.data)
  console.log(`Fetch ${formName}... ${rows.length} FOUND!`)

  const update = async (id: string,index: number,  body: any) => {
    await sdk.v2.updateData({
      formId,
      data: body,
      submissionIds: [id],
    })
    console.log(`Updating ${id} (${index + 1}/${rows.length})... DONE!`)
  }

  await PromisePool.withConcurrency(50).for(rows).process((row, index) => {
    return update(row.id, index, mapping(row)) 
  })
  await prisma.koboAnswers.updateMany({
    where:{
      formId,
    },
    data: {
      uuid: '' + Math.random(),
    }
  })
  console.log(`DONE ${formName}!`)
}