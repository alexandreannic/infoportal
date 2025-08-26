import {Chart, ChartWrapperOptions} from 'react-google-charts'
import {useMemo, useState} from 'react'
import {Box, useTheme} from '@mui/material'
import {lightenVar} from 'infoportal-client/src/core/theme.js'
import {Panel, PanelHead} from '../ui/Panel/index.js'
import {IpIconBtn} from '../ui/IconBtn.js'

const headers = ['Location', 'Submissions']

export const ChartGeo = ({panelTitle, data}: {panelTitle: string; data?: {iso: string; count: number}[]}) => {
  const t = useTheme()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const {countries, regions} = useMemo(() => {
    const countries: Map<string, number> = new Map()
    const regions: Map<string, Map<string, number>> = new Map()
    data?.forEach(_ => {
      const country = _.iso.split('-')[0]
      if (!country) return

      if (!countries.has(country)) countries.set(country, 0)
      countries.set(country, countries.get(country)! + _.count)

      if (!regions.has(country)) regions.set(country, new Map())
      const regionMap = regions.get(country)!

      if (!regionMap.has(_.iso)) regionMap.set(_.iso, 0)
      regionMap.set(_.iso, regionMap.get(_.iso)! + _.count)
    })
    if (countries.size === 1) {
      setSelectedCountry(countries.keys().toArray()[0])
    }
    return {countries, regions}
  }, [data])

  const formattedData = useMemo(() => {
    if (!data) return
    if (selectedCountry) {
      const regionsData = regions.get(selectedCountry)!
      return [headers, ...regionsData.entries()]
    }
    return [headers, ...countries.entries()]
  }, [selectedCountry, data])

  const options: ChartWrapperOptions['options'] = useMemo(() => {
    const defaultOptions: ChartWrapperOptions['options'] = {
      backgroundColor: 'transparent',
      datalessRegionColor:
        t.palette.mode === 'dark' ? lightenVar(t.vars.palette.background.default, 0.4) : t.vars.palette.divider,
      legend: 'none',
      enableRegionInteractivity: true,
      chartArea: {
        height: '10%',
        width: '100%',
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
      colorAxis: {colors: [t.vars.palette.primary.light, t.vars.palette.primary.dark]},
    }
    if (selectedCountry) {
      defaultOptions.displayMode = 'regions'
      defaultOptions.region = selectedCountry
      defaultOptions.resolution = 'provinces'
    }
    return defaultOptions
  }, [selectedCountry, data])

  return (
    <Panel>
      <PanelHead>{panelTitle}</PanelHead>
      <Box sx={{overflow: 'hidden', position: 'relative'}}>
        <Chart
          style={{marginTop: -40, marginBottom: -40}}
          chartType="GeoChart"
          width="100%"
          height="500px"
          data={formattedData ?? [headers]}
          options={options}
          chartEvents={[
            {
              eventName: 'select',
              callback: ({chartWrapper}) => {
                if (!chartWrapper) return
                const chart = chartWrapper.getChart()
                const selection = chart.getSelection()
                if (selection.length > 0) {
                  const selectedRow = selection[0].row
                  const countryCode = formattedData![selectedRow + 1][0]
                  setSelectedCountry(countryCode ? countryCode + '' : null)
                }
              },
            },
          ]}
          // mapsApiKey=""
        />
        <IpIconBtn
          color="primary"
          onClick={() => setSelectedCountry(null)}
          sx={{visibility: selectedCountry ? undefined : 'hidden', position: 'absolute', top: 12, left: 12}}
        >
          arrow_back
        </IpIconBtn>
      </Box>
    </Panel>
  )
}
