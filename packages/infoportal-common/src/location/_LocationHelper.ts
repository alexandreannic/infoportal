import {lazy, map, Obj} from '@alexandreannic/ts-utils'
import {OblastIndex} from './oblastIndex'
import {AiOblast, aiOblasts} from './aiOblasts'
import {hromadas} from './hromadas'
import {raions} from './raions'
import {Settlement, SettlementIso} from './settlements'
// @ts-ignore
const settlements$ = import('../../ressources/settlements.json').then(_ => _ as Record<SettlementIso, Settlement>)
const settlementsGeoLoc$ = import('../../ressources/settlementsGeoLoc.json').then(_ => _ as unknown as Record<SettlementIso, [number, number]>)
// const aiSettlements$ = import('../../ressources/aiSettlements.ts').then(_ => _ as Record<string, string>)

// const settlements = _settlements as any
// const settlements = JSON.parse(_settlements)

export type AILocation = {
  iso: string
  ua: string
  // ru: string
  en: string
  _5w: string
  parent: string
  // lat_centroid: number
  // lon_centroid: number
}

export class AILocationHelper {

  private static readonly findLocation = <K extends string>(loc: Record<K, string>, name: string, type: string): K | undefined => {
    const res = Obj.keys(loc).find(_ => _.includes(name))
    if (!res) {
      console.error(`Cannot find ${type} ${name}`)
    }
    return res
  }

  static readonly settlements = settlements$.then(_ => _ as unknown as Record<SettlementIso, Settlement>)
  static readonly settlementsIsoByParentIso: Promise<Record<string, string[]>> = this.settlements.then(settlements => {
    const index: Record<string, string[]> = {}
    for (var k in settlements) {
      const obj = settlements[k]
      if (!index[obj.parent]) index[obj.parent] = []
      index[obj.parent].push(obj.iso)
    }
    return index
  })

  static get5w = (label5w: string) => label5w.split('_')[0] ?? label5w

  static readonly getSettlement = lazy(async (): Promise<Record<SettlementIso, Settlement>> => {
    const res = await settlements$.then(_ => _ as unknown as Record<SettlementIso, Settlement>)
    return res
  })

  static readonly getSettlementGeoLoc = lazy(async (): Promise<Record<SettlementIso, [number, number]>> => {
    return settlementsGeoLoc$
  })

  static getSettlementsByHromadaIso = async (hromadaIso: string) => {
    const settlements = await this.settlements
    const index = await AILocationHelper.settlementsIsoByParentIso
    const isos = index[hromadaIso]
    return isos.map(_ => settlements[_])
  }

  static readonly findOblast = (name: string): AiOblast | undefined => AILocationHelper.findLocation(aiOblasts, name, 'Oblast')

  static readonly findRaion = (oblastName: string, raionName?: string): undefined | AILocation => {
    if (!raionName) return
    const fixedRaion = {
      'Cnernivetskyi': 'Chernivetskyi',
      'Volodymyr-Volynskyi': 'Volodymyrskyi',
    }[raionName] ?? raionName
    const oblastIso = OblastIndex.byName(oblastName)?.iso
    const list = Obj.values(raions).filter(_ => _.parent === oblastIso)
    return list.find(_ => _.en.toLowerCase() === fixedRaion.toLowerCase())
  }

  static readonly findHromadaByIso = (iso: keyof typeof hromadas) => {
    if (!iso) return
    const res = hromadas[iso]
    if (!res) throw new Error(`No hromada for ${iso}.`)
    return res
  }

  static readonly findRaionByIso = (iso?: keyof typeof raions) => {
    if (!iso) return
    const res = raions[iso]
    if (!res) throw new Error(`No raion for ${iso}.`)
    return res
  }

  static readonly findHromada = (oblastName: string, raionName: string, hromadaName?: string) => {
    if (!hromadaName) return
    if (hromadaName === 'Cnernivetskyi') {
      hromadaName = 'Chernivetskyi'
    }
    const raionIso = AILocationHelper.findRaion(oblastName, raionName)?.iso
    const list = Obj.values(hromadas).filter(_ => _.parent === raionIso)
    return list.find(_ => _.en.toLowerCase() === hromadaName?.toLowerCase())
  }

  static readonly findSettlementByIso = async (iso: string): Promise<Settlement | undefined> => {
    const settlements = await AILocationHelper.getSettlement().then(_ => _ as unknown as Record<SettlementIso, Settlement>)
    return settlements[iso!]
  }

  static readonly sanitizeManuallyTypedSettlement = (settlementName: string): string => {
    settlementName = settlementName?.trim().replaceAll(/\s+/g, ' ').replaceAll('=', '')
    const settlementFixes: Record<string, string> = {
      'Kamianets-Podilsk': 'Kamianets-Podilskyi',
      'Synelnykovo': 'Synelnykove',
      'Liski': 'Lisky',
      'Vosdvyzhivka': 'Vozdvyzhivka'
    }
    settlementName = (settlementFixes[settlementName] ?? settlementName).toLowerCase()
    map(settlementName.match(/([\s\w]+),/) ?? undefined, matches => {
      settlementName = matches[1]
    })
    if (settlementName.startsWith('м.')) settlementName = settlementName.replace('м.', '').trim()
    else if (settlementName.startsWith('С.')) settlementName = settlementName.replace('С.', '').trim()
    else if (settlementName.startsWith('с.')) settlementName = settlementName.replace('с.', '').trim()
    if (settlementName.endsWith('village council')) settlementName = settlementName.replace('village council', '').trim()
    else if (settlementName.endsWith('village')) settlementName = settlementName.replace('village', '').trim()
    else if (settlementName.endsWith('селище')) settlementName = settlementName.replace('селище', '').trim()
    if (settlementName.endsWith('tsa')) settlementName = settlementName.replace(/tsa$/, 'tsia')
    else if (settlementName.endsWith('yii')) settlementName = settlementName.replace(/yii$/, 'yi')
    else if (settlementName.endsWith(`'s`)) settlementName = settlementName.replace(`'s`, '')
    settlementName = settlementName.replaceAll(`'`, '')
    return settlementName
  }

  static readonly findSettlement = async (oblastName: string, raionName: string, hromadaName: string, settlementName?: string): Promise<Settlement | undefined> => {
    const hromada = AILocationHelper.findHromada(oblastName, raionName, hromadaName)
    if (!hromada) return
    const settlements = await AILocationHelper.getSettlementsByHromadaIso(hromada.iso)
    if (settlements.length === 1) return settlements[0]
    if (!settlementName) return

    const settlementFixes: Record<string, string> = {
      'Kamianets-Podilsk': 'Kamianets-Podilskyi',
      'Synelnykovo': 'Synelnykove',
      'Liski': 'Lisky',
      'Vosdvyzhivka': 'Vozdvyzhivka'
    }
    settlementName = (settlementFixes[settlementName] ?? settlementName).toLowerCase()
    let match = settlements.find(_ =>
      _.ua.toLowerCase() === settlementName ||
      _.en.toLowerCase() === settlementName
    )
    if (!match) {
      const sanitizedSettlementName = this.sanitizeManuallyTypedSettlement(settlementName)
      match = settlements.find(_ =>
        _.ua.toLowerCase() === sanitizedSettlementName ||
        _.en.toLowerCase() === sanitizedSettlementName
      )
    }
    if (match) return match
    // return {
    //   'Chernihivska': settlements.find(_ => _.en === 'Chernihiv')
    // }[hromadaName]
  }
}
