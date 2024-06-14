import {KoboSdkGenerator} from '../../feature/kobo/KoboSdkGenerator'
import {scriptConf} from '../ScriptConf'
import {PrismaClient} from '@prisma/client'
import {AILocationHelper, Ecrec_cashRegistrationBha, KeyOf, KoboIndex, KoboSchemaHelper, OblastIndex} from '@infoportal-common'
import {KoboService} from '../../feature/kobo/KoboService'
import {map, Obj, seq} from '@alexandreannic/ts-utils'
import {PromisePool} from '@supercharge/promise-pool'

export const migrateSettlement = async () => {
  // await run<Shelter_NTA.T>({
  //   formId: KoboIndex.byName('shelter_nta').id,
  //   oblastKey: 'ben_det_oblast',
  //   hromadaKey: 'ben_det_hromada',
  //   raionKey: 'ben_det_raion',
  //   settlementKey: 'settlement',
  //   settlementGroup: 'House_Details',
  // })
  // await run<Bn_re.T>({
  //   formId: KoboIndex.byName('bn_re').id,
  //   oblastKey: 'ben_det_oblast',
  //   hromadaKey: 'ben_det_hromada',
  //   raionKey: 'ben_det_raion',
  //   settlementKey: 'ben_det_settlement',
  //   settlementGroup: 'ben_det',
  // })
  // await run<Protection_referral.T>({
  //   formId: KoboIndex.byName('protection_referral').id,
  //   oblastKey: 'oblast',
  //   hromadaKey: 'hromada',
  //   raionKey: 'raion',
  //   settlementKey: 'settement',
  //   settlementGroup: 'biodata',
  // })
  // await run<Protection_hhs3.T>({
  //   formId: KoboIndex.byName('protection_hhs3').id,
  //   oblastKey: 'where_are_you_current_living_oblast',
  //   raionKey: 'where_are_you_current_living_raion',
  //   hromadaKey: 'where_are_you_current_living_hromada',
  //   settlementKey: 'settlement',
  //   settlementGroup: 'group_basic_bio_data',
  //   withIso: true,
  // })
  // await run<Protection_pss.T>({
  //   formId: KoboIndex.byName('protection_pss').id,
  //   oblastKey: 'ben_det_oblast',
  //   raionKey: 'ben_det_raion',
  //   hromadaKey: 'ben_det_hromada',
  //   settlementKey: 'ben_det_hromada_001',
  //   settlementGroup: 'introduction',
  // })
  // await run<Protection_gbv.T>({
  //   formId: KoboIndex.byName('protection_gbv').id,
  //   oblastKey: 'ben_det_oblast',
  //   raionKey: 'ben_det_raion',
  //   hromadaKey: 'ben_det_hromada',
  //   settlementKey: 'ben_det_hromada_001',
  //   settlementGroup: 'introduction',
  //   // debug: true,
  // })
  await run<Ecrec_cashRegistrationBha.T>({
    formId: KoboIndex.byName('ecrec_cashRegistrationBha').id,
    oblastKey: 'ben_det_oblast',
    raionKey: 'ben_det_raion',
    hromadaKey: 'ben_det_hromada',
    settlementKey: 'ben_det_settlement',
    settlementGroup: 'ben_det',
    // debug: true,
  })
  // await run<Ecrec_cashRegistration.T>({
  //   formId: KoboIndex.byName('ecrec_cashRegistration').id,
  //   oblastKey: 'ben_det_oblast',
  //   raionKey: 'ben_det_raion',
  //   hromadaKey: 'ben_det_hromada',
  //   settlementKey: 'ben_det_settlement',
  //   settlementGroup: 'ben_det',
  //   // debug: true,
  // })
}

const run = async <T extends Record<string, any> = Record<string, any>>({
  oblastKey,
  hromadaKey,
  raionKey,
  formId,
  settlementGroup,
  settlementKey,
  debug,
  withIso,
}: {
  debug?: boolean
  oblastKey: KeyOf<T>
  hromadaKey: KeyOf<T>
  raionKey: KeyOf<T>
  settlementKey: KeyOf<T>
  settlementGroup: string
  formId: string
  withIso?: boolean
}) => {
  const prisma = new PrismaClient()
  const service = new KoboService(prisma)

  const schema = await service.getFormDetails(formId).then(_ => KoboSchemaHelper.buildBundle({schema: _, langIndex: 0}))
  const sdk = await new KoboSdkGenerator(prisma).get(scriptConf.kobo.prod.serverId)
  console.log(`fetching ${KoboIndex.searchById(formId)?.translation}...`)
  const data = await sdk.v2.getAnswers(formId)
    .then(_ => _.data.filter(_ => {
        const s = _.answers[settlementKey]
        return !!s && !s.startsWith('UA')
      })
      // .filter(_ => _.id === '526867989')
    )
  // const data = await sdkv2.getAnswers(KoboIndex.byName('bn_re').id)
  //   .then(_ => (_.data as unknown as KoboAnswerFlat<Bn_re.T, any>[])
  //     .filter(_ => !!_.settlement && _.settlement.startsWith('UA'))
  //   )
  console.log(`fetching ${KoboIndex.searchById(formId)?.translation}...`, data.length)
  const mapped = await Promise.all(data.map(async (_: any) => {
    const cleanSettlement = (_.answers[settlementKey] as string | undefined)
      ?.replace('с.', '')
      .replace('село', '')
      .replace('Себіне', 'Sebyne')
      .replace('Verhnya Sagarivka', 'Verkhnia Saharivka')
      .replace('Trostyanets', 'Trostianets')
      // .replace('Malyii', 'Malyi')
      .replace('Макішин', 'Макишин')
      // .replace('Novoselytsa', 'Novoselytsia')
      // .replace('Ivanytsa', 'Ivanytsia')
      .trim()
    if (withIso) {
      const settlements = await AILocationHelper.getSettlementsByHromadaIso(_.answers[hromadaKey])
      let settlementName = cleanSettlement
      let match
      if (settlementName) {
        const sanitizedSettlement = AILocationHelper.sanitizeManuallyTypedSettlement(settlementName)
        match = settlements.find(_ =>
          _.ua.toLowerCase().replaceAll(`'`, '') === sanitizedSettlement ||
          _.en.toLowerCase() === sanitizedSettlement
        )
      }
      return {
        id: _.id,
        ben_det_oblast: _.answers[oblastKey] + '> ' + _.answers[raionKey] + '> ' + _.answers[hromadaKey] + '> ' + _.answers[settlementKey],
        iso: match?.iso
      }
    }
    return AILocationHelper.findSettlement(
      OblastIndex.byKoboName(_.answers[oblastKey]!).name,
      schema.translate.choice(raionKey, _.answers[raionKey]),
      schema.translate.choice(hromadaKey, _.answers[hromadaKey]),
      cleanSettlement,
    ).then(res => {
      return ({
        id: _.id,
        ben_det_oblast: _.answers[oblastKey] + '> ' + _.answers[raionKey] + '> ' + _.answers[hromadaKey] + '> ' + _.answers[settlementKey],
        iso: res?.iso
      })
    })
  }))

  const wrong = mapped.filter(_ => !_.iso)
  Obj.values(seq(wrong).groupByFirst(_ => _.ben_det_oblast)).forEach(_ => console.log(_.id + ' ' + _.iso + '\t' + _.ben_det_oblast))
  const groupByIso = seq(mapped).filter(_ => !!_.iso).groupBy(_ => _.iso!)
  console.log(wrong.length + '/' + mapped.length, Obj.keys(groupByIso).length)
  await PromisePool.withConcurrency(20).for(map(Obj.entries(groupByIso), _ => debug ? _.splice(0, 1) : _)!).process(([iso, batch], i) => {
    console.log(iso, batch[0].id)
    if (debug) {
      console.log(batch)
    }
    const body = {
      formId,
      submissionIds: batch.map(_ => _.id),
      data: {[settlementGroup + '/' + settlementKey]: iso}
    }
    if (!debug)
      return sdk.v2.updateData(body)
  })
}