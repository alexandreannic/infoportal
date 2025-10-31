import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Core} from '@/shared'
import {Obj, seq} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import {useCallback, useMemo} from 'react'
import {normalizeIsoRegion} from '@infoportal/client-core'

export const GeoChartWidget = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filters = useDashboardContext(_ => _.filter.get)
  const updateQuestion = useDashboardContext(_ => _.filter.updateQuestion)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const schema = useDashboardContext(_ => _.schema)

  const choices = useMemo(() => {
    if (!config.questionName) return
    return schema.helper.getOptionsByQuestionName(config.questionName)
  }, [config.questionName])

  const filteredData = useMemo(() => {
    return getFilteredData([
      filterFns.byPeriodCurrent,
      filterFns.byWidgetFilter(config.filter),
      filterFns.byDashboardFilter({excludedQuestion: config.questionName}),
    ])
  }, [getFilteredData, filterFns.byDashboardFilter, config.filter, filterFns.byPeriodCurrent, filterFns.byWidgetFilter])

  const data = useMemo(() => {
    if (!config.questionName) return []
    const record = filteredData.groupByAndApply(
      _ => {
        const value = _[config.questionName!]
        const mappedValue = config.mapping?.[value]
        if (mappedValue && mappedValue !== '') return mappedValue
        return value
      },
      _ => _.length,
    )
    return Obj.entries(record).map(([iso, count]) => ({iso, count}))
  }, [config, filteredData])

  const handleChoiceClick = useCallback(
    (iso: string) => {
      const allMappedChoices: Record<string, undefined | string> = {
        ...seq(choices).reduceObject<Record<string, undefined>>(_ => [_.name, undefined]),
        ...(config.mapping ?? {}),
      }
      const values = new Obj(allMappedChoices)
        .mapKeys(normalizeIsoRegion)
        .filter((key, value) => value === iso || key === iso)
        .keys()
        .map(mapped => choices?.find(_ => normalizeIsoRegion(_.name) === normalizeIsoRegion(mapped))?.name)
        .filter(_ => _ !== undefined && _ !== null)
      updateQuestion(config.questionName!, values)
    },
    [config.questionName!, config.mapping],
  )

  const selectedRegions = useMemo(() => {
    if (!config.questionName) return
    const filteredChoices = filters.questions[config.questionName]
    return filteredChoices?.map(_ => {
      return config.mapping?.[_] ?? _
    })
  }, [filters])
  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <>
      <WidgetTitle sx={{mx: 1, mt: 1}}>{widget.i18n_title?.[langIndex]}</WidgetTitle>
      <Core.ChartGeo
        data={data}
        country={config.countryIsoCode as any}
        onRegionClick={handleChoiceClick}
        selected={selectedRegions}
      />
    </>
  )
}
