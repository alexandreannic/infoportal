import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {
  DrcOffice,
  DrcProject,
  DrcProjectHelper, KoboSubmissionFlat,
  KoboIndex, KoboMealPdm,
  Meal_cashPdm,
  OblastIndex,
  OblastName,
  Period, PersonDetails
} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {fnSwitch, map, seq, Seq} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher, UseFetcher} from '@/shared/hook/useFetcher'
import {Meal_shelterPdm} from 'infoportal-common'

export enum PdmType {
  Cash = 'Cash',
  Shelter = 'Shelter',
}

export type PdmForm = Meal_cashPdm.T | Meal_shelterPdm.T

export type PdmData<T extends PdmForm> = {
  type: PdmType;
  oblast: OblastName;
  project: DrcProject | undefined;
  office: DrcOffice | undefined;
  persons: PersonDetails[]
  answers: KoboSubmissionFlat<T>;
}

export interface MealPdmDashboardContext {
  fetcherAnswers: UseFetcher<(filter: Partial<Period>) => Promise<Seq<PdmData<PdmForm>>>>;
  fetcherPeriod: UseFetcher<() => Promise<Period>>;
  periodFilter: Partial<Period>;
  setPeriodFilter: Dispatch<SetStateAction<Partial<Period>>>;
  answersIndex?: Record<Kobo.SubmissionId, PdmData<PdmForm>>;
}

const Context = React.createContext({} as MealPdmDashboardContext)

export const useMealPdmContext = () => useContext<MealPdmDashboardContext>(Context)

export const MealPdmProvider = (
  {
    children,
  }: {
    children: ReactNode,
  }) => {
  const {api} = useAppSettings()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const request = (): Promise<Seq<PdmData<PdmForm>>> => {
    return Promise.all([
      api.kobo.typedAnswers.search.meal_cashPdm().then(_ =>
        seq(_.data).map(record => ({
          type: PdmType.Cash,
          oblast: OblastIndex.byKoboName(record.ben_det_oblast!)!.name,
          project: DrcProjectHelper.search(record.donor),
          office: fnSwitch(record.office!, {
            dnipro: DrcOffice.Dnipro,
            kharkiv: DrcOffice.Kharkiv,
            chernihiv: DrcOffice.Chernihiv,
            sumy: DrcOffice.Sumy,
            mykolaiv: DrcOffice.Mykolaiv,
            lviv: DrcOffice.Lviv,
            zaporizhzhya: DrcOffice.Zaporizhzhya,
            slovyansk: DrcOffice.Sloviansk
          }, () => undefined),
          persons: KoboMealPdm.mapCashPersons(record),
          answers: record
        }))
      ),
      api.kobo.typedAnswers.search.meal_shelterPdm().then(_ =>
        seq(_.data).map(record => ({
          type: PdmType.Shelter,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          project: DrcProjectHelper.search(record.Donor),
          office: fnSwitch(record.office!, {
            dnk: DrcOffice.Dnipro,
            hrk: DrcOffice.Kharkiv,
            cej: DrcOffice.Chernihiv,
            lwo: DrcOffice.Lviv,
            umy: DrcOffice.Sumy,
            nlv: DrcOffice.Mykolaiv,
          }, () => undefined),
          persons: KoboMealPdm.mapShelterPersons(record),
          answers: record
        }))
      ),
    ]).then(results => seq(results.flat()))
  }

  const fetcherPeriod = useFetcher(() => {
    return Promise.all([
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_cashPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_shelterPdm').id),
    ]).then(([cashPeriod, shelterPeriod]) => ({
      cashPeriod,
      shelterPeriod
    }))
  })

  const fetcherAnswers = useFetcher(request)

  const answersIndex = useMemo(() => {
    return seq(fetcherAnswers.get).groupByFirst(_ => _.answers.id)
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
    <Context.Provider value={{
      fetcherAnswers,
      periodFilter,
      setPeriodFilter,
      fetcherPeriod,
      answersIndex
    }}>
      {children}
    </Context.Provider>
  )
}
