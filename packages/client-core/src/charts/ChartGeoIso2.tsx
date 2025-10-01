import {Chart, ChartWrapperOptions} from 'react-google-charts'
import {useMemo, useState} from 'react'
import {Box, Icon, lighten, Tooltip, useTheme} from '@mui/material'
import {Obj, seq} from '@axanc/ts-utils'
import json from '../core/chartGeoData.json'

const headers = ['Location', 'Submissions']

export const ChartGeoIso2 = ({country, data}: {country?: Country; data?: {iso: string; count: number}[]}) => {
  const t = useTheme()
  const [invalidIso, setInvalidIso] = useState<string[]>([])

  const autoCountry = useMemo(() => {
    if (country) return country
    if (!data) return 'CO' as Country
    const gp = seq(data).groupByAndApply(
      _ => _.iso.split('-')?.[0],
      _ => _.length,
    )
    const mainCountry = seq(Obj.entries(gp))
      .sortByNumber(_ => _[1], '9-0')
      .head()?.[0]
    return (mainCountry ?? 'CO') as Country
  }, [country])

  const formattedData = useMemo(() => {
    if (!data) return
    const invalid = new Set<string>()
    const countryRegions = (json as any)[autoCountry]?.regions
    if (!countryRegions) return [headers]
    const regions = Obj.mapValues(countryRegions, _ => 0)
    data.forEach(_ => {
      if (_.iso.startsWith(autoCountry)) regions[_.iso] = regions[_.iso] + _.count
      else invalid.add(_.iso)
    })
    setInvalidIso([...invalid])
    return [headers, ...Obj.entries(regions)]
  }, [data])

  const options: ChartWrapperOptions['options'] = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      datalessRegionColor: 'transparent',
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
      colorAxis: {colors: [lighten(t.palette.primary.light, 0.8), t.palette.primary.dark]},
      displayMode: 'regions',
      region: autoCountry,
      resolution: 'provinces',
    }
  }, [autoCountry, data])

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '& svg path[fill^="none"]': {
          strokeWidth: 0,
        },
      }}
    >
      <Chart
        style={{border: '1x solid silver'}}
        // style={{marginTop: -40, marginBottom: -40}}
        chartType="GeoChart"
        width="100%"
        height="100%"
        data={formattedData ?? [headers]}
        options={options}
        // mapsApiKey=""
      />
      <Tooltip
        title={
          <div>
            {invalidIso.map(_ => (
              <div>{_}</div>
            ))}
          </div>
        }
      >
        <Icon color="error" sx={{position: 'absolute', left: t.vars.spacing, top: t.vars.spacing}}>
          error
        </Icon>
      </Tooltip>
    </Box>
  )
}

export type Country =
  | 'AF'
  | 'AL'
  | 'DZ'
  | 'AS'
  | 'AD'
  | 'AO'
  | 'AI'
  | 'AQ'
  | 'AG'
  | 'AR'
  | 'AM'
  | 'AW'
  | 'AU'
  | 'AT'
  | 'AZ'
  | 'BS'
  | 'BH'
  | 'BD'
  | 'BB'
  | 'BY'
  | 'BE'
  | 'BZ'
  | 'BJ'
  | 'BM'
  | 'BT'
  | 'Ha'
  | 'BO'
  | 'BA'
  | 'BW'
  | 'BV'
  | 'BR'
  | 'IO'
  | 'BN'
  | 'BG'
  | 'BF'
  | 'BI'
  | 'KH'
  | 'CM'
  | 'CA'
  | 'CV'
  | 'KY'
  | 'CF'
  | 'TD'
  | 'CL'
  | 'CN'
  | 'CX'
  | 'CC'
  | 'CO'
  | 'KM'
  | 'CG'
  | 'CD'
  | 'CK'
  | 'CR'
  | 'CI'
  | 'HR'
  | 'CU'
  | 'CY'
  | 'CZ'
  | 'DK'
  | 'DJ'
  | 'DM'
  | 'DO'
  | 'TP'
  | 'EC'
  | 'EG'
  | 'SV'
  | 'GQ'
  | 'ER'
  | 'EE'
  | 'ET'
  | 'FK'
  | 'FO'
  | 'FJ'
  | 'FI'
  | 'FR'
  | 'GF'
  | 'PF'
  | 'TF'
  | 'GA'
  | 'GM'
  | 'GE'
  | 'DE'
  | 'GH'
  | 'GI'
  | 'GB'
  | 'GR'
  | 'GL'
  | 'GD'
  | 'GP'
  | 'GU'
  | 'GT'
  | 'GN'
  | 'GW'
  | 'GY'
  | 'HT'
  | 'HM'
  | 'VA'
  | 'HN'
  | 'HK'
  | 'HU'
  | 'IS'
  | 'IN'
  | 'ID'
  | 'IR'
  | 'IQ'
  | 'IE'
  | 'IL'
  | 'IT'
  | 'JM'
  | 'JP'
  | 'JO'
  | 'KZ'
  | 'KE'
  | 'KI'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KG'
  | 'LA'
  | 'LV'
  | 'LB'
  | 'LS'
  | 'LR'
  | 'LY'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'MO'
  | 'MK'
  | 'MG'
  | 'MW'
  | 'MY'
  | 'MV'
  | 'ML'
  | 'MT'
  | 'MH'
  | 'MQ'
  | 'MR'
  | 'MU'
  | 'YT'
  | 'MX'
  | 'FM'
  | 'MD'
  | 'MC'
  | 'MN'
  | 'MS'
  | 'MA'
  | 'MZ'
  | 'MM'
  | 'NA'
  | 'NR'
  | 'NP'
  | 'NL'
  | 'AN'
  | 'NC'
  | 'NZ'
  | 'NI'
  | 'NE'
  | 'NG'
  | 'NU'
  | 'NF'
  | 'MP'
  | 'NO'
  | 'OM'
  | 'PK'
  | 'PW'
  | 'PA'
  | 'PG'
  | 'PY'
  | 'PE'
  | 'PH'
  | 'PN'
  | 'PL'
  | 'PT'
  | 'PR'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RU'
  | 'RW'
  | 'SH'
  | 'KN'
  | 'LC'
  | 'PM'
  | 'VC'
  | 'WS'
  | 'SM'
  | 'ST'
  | 'SA'
  | 'SN'
  | 'SC'
  | 'SL'
  | 'SG'
  | 'SK'
  | 'SI'
  | 'SB'
  | 'SO'
  | 'ZA'
  | 'GS'
  | 'ES'
  | 'LK'
  | 'SD'
  | 'SR'
  | 'SJ'
  | 'SZ'
  | 'SE'
  | 'CH'
  | 'SY'
  | 'TW'
  | 'TJ'
  | 'TZ'
  | 'TH'
  | 'TG'
  | 'TK'
  | 'TO'
  | 'TT'
  | 'TN'
  | 'TR'
  | 'TM'
  | 'TC'
  | 'TV'
  | 'UG'
  | 'UA'
  | 'AE'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VU'
  | 'VE'
  | 'VN'
  | 'VG'
  | 'VI'
  | 'WF'
  | 'EH'
  | 'YE'
  | 'YU'
  | 'ZM'
  | 'ZW'
