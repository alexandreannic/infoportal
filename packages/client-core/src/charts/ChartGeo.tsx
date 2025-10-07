import {Chart, ChartWrapperOptions} from 'react-google-charts'
import {useMemo, useState, useEffect} from 'react'
import {Box, lighten, useColorScheme, useTheme} from '@mui/material'
import {IconBtn} from '../ui'
import json from '../core/chartGeoData.json'

export type CountryCode = keyof typeof json

const headers = ['Location', 'Submissions']

function groupGeoData(data: {iso: string; count: number}[]) {
  const countries = new Map<CountryCode, number>()
  const regions = new Map<string, Map<string, number>>()
  for (const {iso, count} of data) {
    const [country] = iso.split('-') as [CountryCode]
    if (!country) continue
    countries.set(country, (countries.get(country) ?? 0) + count)
    const regionMap = regions.get(country) ?? new Map()
    regionMap.set(iso, (regionMap.get(iso) ?? 0) + count)
    regions.set(country, regionMap)
  }
  return {countries, regions}
}

export const ChartGeo = ({
  fixCountry,
  data = [],
}: {
  fixCountry?: CountryCode
  data?: {iso: string; count: number}[]
}) => {
  const {mode} = useColorScheme()
  const t = useTheme()
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null)
  const datalessRegionColor = selectedCountry ? 'transparent' : mode === 'dark' ? '#2b3c4f' : '#e0e0e0'

  useEffect(() => {
    if (fixCountry) setSelectedCountry(fixCountry)
  }, [fixCountry])

  const {countries, regions} = useMemo(() => {
    const grouped = groupGeoData(data)
    if (selectedCountry) {
      const regionData = json[selectedCountry]?.regions
      if (regionData) {
        const old = grouped.regions.get(selectedCountry) ?? new Map()
        const newRegionMap = new Map(old)
        for (const key of Object.keys(regionData)) {
          if (!newRegionMap.has(key)) newRegionMap.set(key, 0)
        }
        const newRegions = new Map(grouped.regions)
        newRegions.set(selectedCountry, newRegionMap)
        grouped.regions = newRegions
      }
    }
    return grouped
  }, [data])

  useEffect(() => {
    if (!fixCountry && countries.size === 1) setSelectedCountry([...countries.keys()][0])
  }, [countries, fixCountry])

  const formattedData = useMemo(() => {
    const source = selectedCountry ? regions.get(selectedCountry) : countries
    return [headers, ...(source ? Array.from(source.entries()) : [])]
  }, [selectedCountry, countries, regions])

  const options: ChartWrapperOptions['options'] = useMemo(
    () => ({
      backgroundColor: 'transparent',
      datalessRegionColor,
      legend: 'none',
      enableRegionInteractivity: true,
      chartArea: {width: '100%', height: '10%', top: 10, bottom: 10, left: 10, right: 10},
      colorAxis: {colors: [lighten(t.palette.primary.light, 0.65), t.palette.primary.dark]},
      ...(selectedCountry && {
        displayMode: 'regions',
        region: selectedCountry,
        resolution: 'provinces',
      }),
    }),
    [datalessRegionColor, selectedCountry, t],
  )

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '& svg path': {stroke: t.vars.palette.background.paper, strokeWidth: 1.2},
        // [`& svg path[fill^="${datalessRegionColor}"]`]: {stroke: t.vars.palette.background.paper, strokeWidth: 1},
        '& svg path[fill^="none"]': {strokeWidth: 0},
      }}
    >
      <Chart
        chartType="GeoChart"
        width="100%"
        height="100%"
        data={formattedData}
        options={options}
        chartEvents={[
          {
            eventName: 'select',
            callback: ({chartWrapper}) => {
              if (fixCountry) return
              const chart = chartWrapper?.getChart()
              const sel = chart?.getSelection?.()
              if (sel?.length) {
                const row = sel[0].row
                const code = formattedData[row + 1][0] as CountryCode | undefined
                setSelectedCountry(code || null)
              }
            },
          },
        ]}
      />
      {!fixCountry && (
        <IconBtn
          color="primary"
          onClick={() => setSelectedCountry(null)}
          sx={{visibility: selectedCountry ? undefined : 'hidden', position: 'absolute', top: 12, left: 12}}
        >
          arrow_back
        </IconBtn>
      )}
    </Box>
  )
}
