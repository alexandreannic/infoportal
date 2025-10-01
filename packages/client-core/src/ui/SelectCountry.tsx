import * as React from 'react'
import {Autocomplete} from '@mui/material'
import countries from '../core/chartGeoData.json'
import {CountryFlag} from './CountryFlag'
import {Input} from './Input'
import {Country} from '../charts'

const countryOptions = Object.entries(countries).map(([code, {name}]) => ({
  code,
  name,
})) as {code: Country; name: string}[]

export function SelectCountry({
  value,
  label,
  onChange,
}: {
  label?: string
  value?: Country
  onChange: (_: Country | null) => void
}) {
  return (
    <Autocomplete
      options={countryOptions}
      value={countryOptions.find(c => c.code === value) ?? null}
      onChange={(_, newValue) => onChange(newValue?.code ?? null)}
      getOptionLabel={option => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.code}>
          <CountryFlag code={option.code} />
          {option.name}
        </li>
      )}
      renderInput={params => (
        <Input
          {...params.InputProps}
          inputProps={params.inputProps}
          helperText={null}
          ref={params.InputProps.ref}
          label={label}
        />
      )}
    />
  )
}
