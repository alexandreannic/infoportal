import {Box, useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect, useMemo} from 'react'
import {initGoogleMaps} from '@/core/initGoogleMaps'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {map} from '@axanc/ts-utils'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {Core} from '@/shared'

export const GeoPointWidget = ({
  widget,
  onEdit,
  isEditing,
}: {
  onEdit?: () => void
  isEditing?: boolean
  widget: Ip.Dashboard.Widget
}) => {
  const t = useTheme()
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoPoint']

  const flatSubmissions = useDashboardContext(_ => _.flatSubmissions)
  const schema = useDashboardContext(_ => _.schema)

  const filteredData = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

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
