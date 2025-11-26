import {initGoogleMaps} from '@/core/initGoogleMaps'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {Core} from '@/shared'
import {Box, useTheme} from '@mui/material'
import {Api} from '@infoportal/api-sdk'
import {useEffect, useMemo} from 'react'

export const GeoPointWidget = ({
  widget,
  onEdit,
  isEditing,
}: {
  onEdit?: () => void
  isEditing?: boolean
  widget: Api.Dashboard.Widget
}) => {
  const t = useTheme()
  const config = widget.config as Api.Dashboard.Widget.Config['GeoPoint']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)

  const filteredData = useMemo(() => {
    return getFilteredData([
      filterFns.byPeriodCurrent,
      filterFns.byWidgetFilter(config.filter),
      filterFns.byDashboardFilter(),
    ])
  }, [getFilteredData, config.filter, filterFns.byDashboardFilter, filterFns.byPeriodCurrent, filterFns.byWidgetFilter])

  const bubbles = useMemo(() => {
    if (!config.questionName) return
    return filteredData.map(_ => {
      return {
        size: 10,
        label: _.id,
        desc: '',
        loc: _[config.questionName!],
      }
    })
  }, [filteredData])

  useEffect(() => {
    if (!bubbles) return
    initGoogleMaps({
      domSelector: '#widget-' + widget.id,
      color: t.palette.primary.main,
      bubbles,
    })
  }, [widget])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Box
      sx={{
        mb: -1,
        mx: -1,
        height: `calc(${t.vars.spacing} * 2 + 100%)`,
        width: `calc(${t.vars.spacing} * 2 + 100%)`,
      }}
    >
      <Box sx={{height: '100%', width: '100%'}} onClick={e => e.stopPropagation()} id={`widget-` + widget.id}></Box>
      {isEditing && (
        <Core.IconBtn
          children="edit"
          onClick={onEdit}
          size="large"
          sx={{background: 'rgba(0,0,0,.2)', position: 'absolute', top: 'calc(50% - 22px)', left: 'calc(50% - 22px)'}}
        />
      )}
    </Box>
  )
}
