import {useAppSettings} from '@/core/context/ConfigContext'
import {useMemo} from 'react'
import {useAsync} from '@/shared/hook/useAsync'
import {DrcOffice, KoboGeneralMapping, KoboIndex, KoboShelterTa, OblastIndex, ShelterContractorPrices, ShelterTaPriceLevel} from 'infoportal-common'
import {fnSwitch, map, Seq, seq} from '@alexandreannic/ts-utils'
import {FetchParams} from '@/shared/hook/useFetcher'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {ShelterEntity} from '@/features/Shelter/shelterEntity'
import {Kobo} from 'kobo-sdk'


export type UseShelterData = ReturnType<typeof useShelterData>

export const useShelterData = () => {
  const {api} = useAppSettings()
  const ctxAnswers = useKoboAnswersContext()
  // const req = () => api.shelter.search().then(_ => _.data)
  // const fetcher = useFetcher(req)
  const fetcherNta = ctxAnswers.byName('shelter_nta')
  const fetcherTa = ctxAnswers.byName('shelter_ta')


  const fetchAll = (p: FetchParams = {}) => {
    fetcherNta.fetch()
    fetcherTa.fetch()
  }

  const mappedData = useMemo(() => {
    return map(fetcherNta.get, fetcherTa.get, (nta, ta) => {
      const index: Record<Kobo.SubmissionId, Omit<ShelterEntity, 'id'>> = {} as any
      nta.data.forEach(d => {
        if (!index[d.id]) index[d.id] = {}
        const oblast = OblastIndex.byKoboName(d.ben_det_oblast)
        index[d.id].nta = d
        index[d.id].oblastIso = oblast?.iso
        index[d.id].oblast = oblast?.name
        index[d.id].persons = KoboGeneralMapping.collectXlsKoboIndividuals(KoboShelterTa.harmonizeNtaDisabilityAll(d as any)).map(KoboGeneralMapping.mapPersonDetails)
        index[d.id].office = fnSwitch(d.back_office!, {
          cej: DrcOffice.Chernihiv,
          dnk: DrcOffice.Dnipro,
          hrk: DrcOffice.Kharkiv,
          umy: DrcOffice.Sumy,
          nlv: DrcOffice.Mykolaiv,
          slo: DrcOffice.Sloviansk,
        }, () => undefined) ?? ''
      })
      ta.data.forEach(d => {
        const refId = d.nta_id ? ('' + d.nta_id).replaceAll(/[^\d]/g, '') : d.id
        if (!index[refId]) index[refId] = {}
        const price = ShelterContractorPrices.compute({
          answer: d,
          contractor1: d.tags?.contractor1,
          contractor2: d.tags?.contractor2,
        })
        const nta = index[refId].nta
        const priceLevel = () => {
          if (!price || typeof price !== 'number') return
          if (nta?.dwelling_type === 'house') {
            if (price < 100000) return ShelterTaPriceLevel.Light
            if (price >= 100000 && price <= 200000) return ShelterTaPriceLevel.Medium
            return ShelterTaPriceLevel.Heavy
          } else if (nta?.dwelling_type === 'apartment') {
            if (price < 40000) return ShelterTaPriceLevel.Light
            if (price >= 40000 && price <= 80000) return ShelterTaPriceLevel.Medium
            return ShelterTaPriceLevel.Heavy
          }
        }
        index[refId].ta = {
          ...d,
          _price: price,
          _priceLevel: priceLevel()
        }
      })
      return seq(Object.entries(index))
        // .filter(([k, v]) => !!v.nta)
        .map(([k, v]) => ({id: k, ...v}))
        .sort((a, b) => {
          if (!a.nta) return -1
          if (!b.nta) return 1
          return a.nta.date?.getTime() - b.nta?.date.getTime()
        }) as Seq<ShelterEntity>
    }) ?? seq([])
  }, [fetcherNta.get, fetcherTa.get])

  const index: undefined | Record<Kobo.SubmissionId, number> = useMemo(() => {
    if (!mappedData) return
    return mappedData.reduce((acc, _, i) => {
      acc[_.id] = i
      return acc
    }, {} as Record<Kobo.SubmissionId, number>)
    // const index: Record<'all' | 'nta' | 'ta', Record<Kobo.SubmissionId, number>> = {
    //   all: {},
    //   nta: {},
    //   ta: {},
    // }
    // fetcher.get.forEach((_, i) => {
    //   index.all[_.id] = i
    //   if (_.nta) index.all[_.nta.id] = i
    //   if (_.ta) index.all[_.ta.id] = i
    // })
    // return index
  }, [mappedData])

  const asyncSyncAnswers = useAsync(async () => {
    await Promise.all([
      api.koboApi.synchronizeAnswers(KoboIndex.byName('shelter_ta').id),
      api.koboApi.synchronizeAnswers(KoboIndex.byName('shelter_nta').id),
    ])
    await fetchAll({clean: false, force: true})
  })

  return {
    fetchAll,
    asyncSyncAnswers,
    fetching: fetcherNta.loading || fetcherTa.loading,
    mappedData,
    index,
  } as const
}