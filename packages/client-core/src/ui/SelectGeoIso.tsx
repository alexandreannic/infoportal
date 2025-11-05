import {Autocomplete, AutocompleteProps} from '@mui/material'
import {Input} from './Input.js'
import {CountryFlag} from './CountryFlag.js'
import geoData from '../core/chartGeoData.json'

type GeoOption = {
  code: string
  name: string
}

type SelectGeoIsoProps = Omit<
  AutocompleteProps<GeoOption, false, false, false>,
  'onChange' | 'options' | 'value' | 'renderOption'
> & {
  label?: string
  value?: string | null
  countryCode?: string
  onChange: (value: string | null) => void
}

export function SelectGeoIso({label, value, renderInput, onChange, countryCode, ...props}: SelectGeoIsoProps) {
  const options: GeoOption[] = (() => {
    if (countryCode) {
      // Only show regions of the given country
      const country = geoData[countryCode as keyof typeof geoData]
      if (!country) return []
      return Object.entries(country.regions ?? {}).map(([code, name]) => ({
        code,
        name,
      }))
    }

    // Otherwise, show all countries and all regions
    return Object.entries(geoData).flatMap(([countryCode, country]) => {
      const regions = Object.entries(country.regions ?? {}).map(([rCode, rName]) => ({
        code: rCode,
        name: `${rName} (${rCode})`,
      }))
      return [{code: countryCode, name: country.name}, ...regions]
    })
  })()

  const selectedOption = options.find(opt => opt.code === value) ?? null

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => onChange(newValue?.code ?? null)}
      getOptionLabel={option => option.name}
      renderOption={(params, option) => (
        <li {...params} key={option.code}>
          {!countryCode && option.code.length === 2 && <CountryFlag code={option.code} />}
          {option.name}
        </li>
      )}
      renderInput={
        renderInput ??
        (params => (
          <Input
            {...params.InputProps}
            inputProps={params.inputProps}
            ref={params.InputProps.ref}
            helperText={null}
            label={label}
          />
        ))
      }
      {...props}
    />
  )
}
