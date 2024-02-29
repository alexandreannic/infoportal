import {useCallback, useMemo} from 'react'
import {ChartHelperOld} from '@/shared/charts/chartHelperOld'
import {chain, KoboProtection_hhs3, OblastISO, Person} from '@infoportal-common'
import {Enum, Seq} from '@alexandreannic/ts-utils'
import {ukraineSvgPath} from '@/shared/UkraineMap/ukraineSvgPath'
import {subDays} from 'date-fns'

export type UseProtHHS2Data = ReturnType<typeof useProtectionDashboardMonitoData>

export const previousPeriodDeltaDays = 90

export const useProtectionDashboardMonitoData = ({
  data,
}: {
  data?: Seq<KoboProtection_hhs3.T>
}) => {
  const ageGroup = useCallback((ageGroup: Person.AgeGroup, hideOther?: boolean) => {
    const gb = Person.groupByGenderAndGroup(ageGroup)(data?.flatMap(_ => _.persons)!)
    return new Enum(gb).entries().map(([k, v]) => ({key: k, ...v}))
  }, [data])

  return useMemo(() => {
    if (!data || data.length === 0) return
    const sorted = data.sort((a, b) => a.end.getTime() - b.end.getTime())
    const start = sorted[0].end
    const end = sorted[sorted.length - 1].end
    // const currentMonth = data.filter(_ => _.end >= startOfMonth(end))
    const lastMonth = data.filter(_ => _.end < subDays(end, previousPeriodDeltaDays))

    const flatData = data.flatMap(_ => _.persons.map(p => ({..._, ...p})))

    const idps = data.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')

    const categoryOblasts = (
      column: 'where_are_you_current_living_oblast' | 'what_is_your_area_of_origin_oblast' = 'where_are_you_current_living_oblast'
    ) => Enum.keys(ukraineSvgPath)
      .reduce(
        (acc, isoCode) => ({...acc, [isoCode]: (_: KoboProtection_hhs3.T): boolean => _[column] === isoCode}),
        {} as Record<OblastISO, (_: KoboProtection_hhs3.T) => boolean>
      )

    const byCurrentOblast = ChartHelperOld.byCategory({
      categories: categoryOblasts('where_are_you_current_living_oblast'),
      data: data,
      filter: _ => true,
    })

    const byOriginOblast = ChartHelperOld.byCategory({
      categories: categoryOblasts('what_is_your_area_of_origin_oblast'),
      data: data,
      filter: _ => true,
    })

    const idpsByCurrentOblast = ChartHelperOld.byCategory({
      categories: categoryOblasts('where_are_you_current_living_oblast'),
      data: idps,
      filter: _ => true,
    })

    const idpsByOriginOblast = ChartHelperOld.byCategory({
      categories: categoryOblasts('what_is_your_area_of_origin_oblast'),
      data: idps,
      filter: _ => true,
    })

    return {
      start,
      end,
      // currentMonth,
      lastMonth,
      flatData,
      individualsCount: data.sum(_ => _.persons.length),
      categoryOblasts,
      ageGroup: ageGroup,
      byGender: chain(ChartHelperOld.single({
        data: data.flatMap(_ => _.persons.map(_ => (_.gender === undefined || _.gender === 'Other') ? 'other' : _.gender)),
      }))
        .map(x => Enum.transform(x, (k, v) => [k, v.value]))
        .get(),
      idps,
      byCurrentOblast,
      byOriginOblast,
      idpsByOriginOblast,
      idpsByCurrentOblast,
    }
  }, [data])
}