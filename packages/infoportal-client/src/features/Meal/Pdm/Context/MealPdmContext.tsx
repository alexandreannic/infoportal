import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {
  DrcOffice,
  DrcProject,
  DrcProjectHelper,
  KoboIndex,
  KoboMealPdm,
  KoboSubmissionFlat,
  KoboXmlMapper,
  Meal_cashPdm,
  Meal_shelterPdm,
  OblastIndex,
  OblastName,
  Period,
  Meal_nfiPdm,
  Person,
} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {fnSwitch, map, seq, Seq} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher, UseFetcher} from '@/shared/hook/useFetcher'

export enum PdmType {
  Cash = 'Cash',
  Shelter = 'Shelter',
  Nfi = 'Nfi',
}

export type PdmForm = Meal_cashPdm.T | Meal_shelterPdm.T | Meal_nfiPdm.T

export type PdmData<T extends PdmForm> = {
  type: PdmType
  oblast: OblastName
  project: DrcProject | undefined
  office: DrcOffice | undefined
  persons: Person.Details[]
  answers: KoboSubmissionFlat<T>
}

export interface MealPdmDashboardContext {
  fetcherAnswers: UseFetcher<(filter: Partial<Period>) => Promise<Seq<PdmData<PdmForm>>>>
  fetcherPeriod: UseFetcher<() => Promise<Period>>
  periodFilter: Partial<Period>
  setPeriodFilter: Dispatch<SetStateAction<Partial<Period>>>
  answersIndex?: Record<Kobo.SubmissionId, PdmData<PdmForm>>
}

const Context = React.createContext({} as MealPdmDashboardContext)

export const useMealPdmContext = () => useContext<MealPdmDashboardContext>(Context)

export const MealPdmProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const request = (): Promise<Seq<PdmData<PdmForm>>> => {
    return Promise.all([
      api.kobo.typedAnswers.search.meal_cashPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Cash,
          oblast: OblastIndex.byKoboName(record.ben_det_oblast!)!.name,
          project: DrcProjectHelper.search(record.donor),
          office: fnSwitch(
            record.office!,
            {
              dnipro: DrcOffice.Dnipro,
              empca: DrcOffice.Kharkiv,
              chernihiv: DrcOffice.Chernihiv,
              sumy: DrcOffice.Sumy,
              mykolaiv: DrcOffice.Mykolaiv,
              lviv: DrcOffice.Lviv,
              zaporizhzhya: DrcOffice.Zaporizhzhya,
              slovyansk: DrcOffice.Sloviansk,
            },
            () => undefined,
          ),
          persons: KoboMealPdm.mapCashPersons(record),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.meal_shelterPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Shelter,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          project: DrcProjectHelper.search(record.Donor),
          office: KoboXmlMapper.office(record.office),
          persons: KoboMealPdm.mapShelterPersons(record),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.meal_nfiPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Nfi,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          project: DrcProjectHelper.search(record.donor),
          office: KoboXmlMapper.office(record.office_responsible),
          persons: KoboMealPdm.mapNfiPersons(record),
          answers: record,
        })),
      ),
    ]).then((results) => seq(results.flat()))
  }

  const fetcherPeriod = useFetcher(() => {
    return Promise.all([
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_cashPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_shelterPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_nfiPdm').id),
    ]).then(([cashPeriod, shelterPeriod, nfiPeriod]) => ({
      cashPeriod,
      shelterPeriod,
      nfiPeriod,
    }))
  })

  const fetcherAnswers = useFetcher(request)

  const answersIndex = useMemo(() => {
    return seq(fetcherAnswers.get).groupByFirst((_) => _.answers.id)
  }, [fetcherAnswers.get])

  useEffect(() => {
    fetcherPeriod.fetch()
  }, [])

  useEffect(() => {
    map(fetcherPeriod.get, setPeriodFilter)
  }, [fetcherPeriod.get])

  useEffect(() => {
    fetcherAnswers.fetch({force: true, clean: false})
  }, [periodFilter])

  return (
    <Context.Provider
      value={{
        fetcherAnswers,
        periodFilter,
        setPeriodFilter,
        fetcherPeriod,
        answersIndex,
      }}
    >
      {children}
    </Context.Provider>
  )
}
