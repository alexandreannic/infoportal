import {Obj} from '@axanc/ts-utils'

export interface Oblast {
  name: OblastName
  shortName?: string
  iso: OblastISO
}

export type OblastISO = keyof typeof OblastIndex.oblastByISO
export type OblastName = (typeof OblastIndex.oblastByISO)[keyof typeof OblastIndex.oblastByISO]
export type OblastKoboName = keyof (typeof OblastIndex)['koboOblastIndexIso']

export namespace OblastIndex {
  export const byIso: {
    (_: OblastISO): Oblast
    (_: string | undefined): Oblast | undefined
  } = (iso) => {
    return {
      iso,
      // @ts-ignore
      name: OblastIndex.oblastByISO[iso],
      // @ts-ignore
      shortName: OblastIndex.shortNamesIndex[iso],
    } as any
  }

  export const byName: {
    (_: OblastName): Oblast
    (_: string): Oblast | undefined
    (_: OblastName | undefined | string): Oblast | undefined
  } = (name) => {
    const iso = oblastIsoByName[name as keyof typeof oblastIsoByName]
    return OblastIndex.byIso(iso)
  }

  export const byKoboName: {
    (_: OblastKoboName): Oblast
    (_: string): Oblast | undefined
    (_: OblastKoboName | undefined | string): Oblast | undefined
  } = (name) => {
    const iso = OblastIndex.koboOblastIndexIso[name as OblastKoboName]
    return OblastIndex.byIso(iso) as any
  }

  export const shortNamesIndex: Partial<Record<OblastISO, string>> = {
    UA01: `TODO Autonomous Republic of Crimea`,
    UA71: `TODO Cherkaska`,
    UA74: `Chernihiv`, // ok
    UA73: `Chernivtsi`,
    UA12: `Dnipropetrovsk`, // ok
    UA14: `Donetsk`, // ok
    UA26: `Ivano-Frankivsk`, // ok
    UA63: `Kharkiv`, // ok
    UA65: `Kherson`, // ok
    UA68: `TODO Khmelnytska`,
    UA35: `TODO Kirovohradska`,
    UA80: `TODO Kyiv`,
    UA32: `TODO Kyivska`,
    UA44: `Luhanska`, // UA-09 in Real but UA-44 in Activity Info
    UA46: `Lviv`, // ok
    UA48: `Mykolaiv`, // ok
    UA51: `TODO Odeska`,
    UA53: `TODO Poltavska`,
    UA56: `TODO Rivnenska`,
    UA85: `TODO Sevastopol`,
    UA59: `Sumy`,
    UA61: `TODO Ternopilska`,
    UA05: `TODO Vinnytska`,
    UA07: `Volyn`, // ok
    UA21: `TODO Zakarpatska`,
    UA23: `Zaporizhzhia`, // ok
    UA18: `TODO Zhytomyrska`,
  }

  export const names: OblastName[] = [
    `Autonomous Republic of Crimea`,
    `Cherkaska`,
    `Chernihivska`,
    `Chernivetska`,
    `Dnipropetrovska`,
    `Donetska`,
    `Ivano-Frankivska`,
    `Kharkivska`,
    `Khersonska`,
    `Khmelnytska`,
    `Kirovohradska`,
    `Kyiv`,
    `Kyivska`,
    `Luhanska`, // UA-09 in Real but UA-44 in Activity Info
    `Lvivska`,
    `Mykolaivska`,
    `Odeska`,
    `Poltavska`,
    `Rivnenska`,
    `Sevastopol`,
    `Sumska`,
    `Ternopilska`,
    `Vinnytska`,
    `Volynska`,
    `Zakarpatska`,
    `Zaporizka`,
    `Zhytomyrska`,
  ]

  export const oblastByISO = Object.freeze({
    UA01: `Autonomous Republic of Crimea`,
    UA71: `Cherkaska`,
    UA74: `Chernihivska`,
    UA73: `Chernivetska`,
    UA12: `Dnipropetrovska`,
    UA14: `Donetska`,
    UA26: `Ivano-Frankivska`,
    UA63: `Kharkivska`,
    UA65: `Khersonska`,
    UA68: `Khmelnytska`,
    UA35: `Kirovohradska`,
    UA80: `Kyiv`,
    UA32: `Kyivska`,
    UA44: `Luhanska`, // UA-09 in Real but UA-44 in Activity Info
    UA46: `Lvivska`,
    UA48: `Mykolaivska`,
    UA51: `Odeska`,
    UA53: `Poltavska`,
    UA56: `Rivnenska`,
    UA85: `Sevastopol`,
    UA59: `Sumska`,
    UA61: `Ternopilska`,
    UA05: `Vinnytska`,
    UA07: `Volynska`,
    UA21: `Zakarpatska`,
    UA23: `Zaporizka`,
    UA18: `Zhytomyrska`,
  })

  export const isos = Obj.keys(OblastIndex.oblastByISO)

  const oblastIsoByName = Obj.transform(OblastIndex.oblastByISO, (k, v) => [v, k])

  export const koboOblastIndexIso = {
    aroc: 'UA01' as OblastISO, //'UA43'
    cherkaska: 'UA71' as OblastISO,
    chernihivska: 'UA74' as OblastISO,
    chernivetska: 'UA73' as OblastISO, // 'UA77'
    dnipropetrovska: 'UA12' as OblastISO,
    donetska: 'UA14' as OblastISO,
    'ivano-frankivska': 'UA26' as OblastISO,
    kharkivska: 'UA63' as OblastISO,
    khersonska: 'UA65' as OblastISO,
    khmelnytska: 'UA68' as OblastISO,
    kirovohradska: 'UA35' as OblastISO,
    citykyiv: 'UA80' as OblastISO, //'UA80' as OblastISO,
    kyivska: 'UA32' as OblastISO,
    luhanska: 'UA44' as OblastISO, //'UA09' as OblastISO,
    lvivska: 'UA46' as OblastISO,
    mykolaivska: 'UA48' as OblastISO,
    odeska: 'UA51' as OblastISO,
    poltavska: 'UA53' as OblastISO,
    rivnenska: 'UA56' as OblastISO,
    sevastopilska: 'UA85' as OblastISO, //'UA85' as OblastISO,
    sumska: 'UA59' as OblastISO,
    ternopilska: 'UA61' as OblastISO,
    vinnytska: 'UA05' as OblastISO,
    volynska: 'UA07' as OblastISO,
    zakarpatska: 'UA21' as OblastISO,
    zaporizka: 'UA23' as OblastISO,
    zhytomyrska: 'UA18' as OblastISO,
  } as const
}

// const protHH0oblastKey: Record<string, OblastISO> = {
//   vin: 'UA05',
//   vol: 'UA07',
//   dnip: 'UA12',
//   don: 'UA14',
//   zhy: 'UA18',
//   zak: 'UA21',
//   zap: 'UA23',
//   ivan: 'UA26',
//   kyi: 'UA32',
//   avt: 'UA01',
//   kir: 'UA35',
//   luh: 'UA44',
//   lvi: 'UA46',
//   myk: 'UA48',
//   ode: 'UA51',
//   pol: 'UA53',
//   riv: 'UA56',
//   sum: 'UA59',
//   ter: 'UA61',
//   kha: 'UA63',
//   khe: 'UA65',
//   khm: 'UA68',
//   che: 'UA71',
//   chern: 'UA73',
//   cherni: 'UA74',
//   sev: 'UA85',
// }
