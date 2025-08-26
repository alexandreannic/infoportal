import {Autocomplete, AutocompleteProps, Chip} from '@mui/material'
import {IpInput} from '../../../../infoportal-client-core/src/Input/Input'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Ip} from 'infoportal-api-sdk'
import {useQueryUser} from '@/core/query/useQueryUser.js'

export const DrcJobInputMultiple = ({
  workspaceId,
  ...props
}: Omit<AutocompleteProps<string, any, any, any>, 'renderInput' | 'options'> & {
  workspaceId: Ip.WorkspaceId
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const queryJobs = useQueryUser.getJobs(workspaceId)

  return (
    <Autocomplete
      multiple
      loading={queryJobs.isLoading}
      options={queryJobs.data ?? []}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip size="small" variant="outlined" label={option} {...getTagProps({index})} />
        ))
      }
      value={props.value ?? []}
      // renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
      renderInput={({InputProps, ...inputProps}) => (
        <IpInput {...inputProps} {...InputProps} helperText={null} label={m.job} />
      )}
      {...props}
    />
  )
}

export const DrcJobInputSingle = ({
  workspaceId,
  ...props
}: Omit<AutocompleteProps<string, any, any, any>, 'renderInput' | 'options'> & {
  workspaceId: Ip.WorkspaceId
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const queryJobs = useQueryUser.getJobs(workspaceId)

  return (
    <Autocomplete
      loading={queryJobs.isLoading}
      options={queryJobs.data ?? []}
      value={props.value ?? null}
      // renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
      renderInput={({InputProps, ...inputProps}) => (
        <IpInput {...inputProps} {...InputProps} helperText={null} label={m.job} />
      )}
      {...props}
    />
  )
}
