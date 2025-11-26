import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {PanelWidgetContent} from '@/shared/PdfLayout/PanelWidget'
import {useI18n} from '@infoportal/client-i18n'
import {Api} from '@infoportal/api-sdk'
import {toInt} from '@infoportal/common'
import {useMemo} from 'react'

export function CardWidget({widget}: {widget: Api.Dashboard.Widget}) {
  const {formatLargeNumber} = useI18n()
  const config = widget.config as Api.Dashboard.Widget.Config['Card']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const flattenRepeatGroupData = useDashboardContext(_ => _.flattenRepeatGroupData)

  const data = useMemo(() => {
    const d = getFilteredData([
      filterFns.byPeriodCurrent,
      filterFns.byWidgetFilter(config.filter),
      filterFns.byDashboardFilter(),
    ])
    return flattenRepeatGroupData.flattenIfRepeatGroup(d, config.questionName)
  }, [
    getFilteredData,
    filterFns.byPeriodCurrent,
    filterFns.byWidgetFilter,
    filterFns.byDashboardFilter,
    config.questionName,
    config.filter,
  ])

  const value = useMemo(() => {
    if (config.operation === 'count') return data.length
    if (!config.questionName) return
    const mapped: number[] = data.map(_ => toInt(_[config.questionName!])).filter(_ => _ !== undefined)
    try {
      switch (config.operation) {
        case 'max': {
          return Math.max(...mapped)
        }
        case 'min': {
          return Math.min(...mapped)
        }
        case 'sum': {
          return mapped.reduce((acc, _) => acc + _, 0)
        }
        case 'avg': {
          return mapped.reduce((acc, _) => acc + _, 0) / data.length
        }
      }
    } catch (e) {
      return
    }
  }, [data, config.questionName, config.operation])

  if (value === undefined) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <PanelWidgetContent icon={config.icon} title={widget.i18n_title?.[langIndex] ?? ''} sx={{height: '100%'}}>
      {formatLargeNumber(value, {maximumFractionDigits: 2})}
    </PanelWidgetContent>
  )
}
