import {Autocomplete, AutocompleteProps, Chip} from '@mui/material'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryUser} from '@/core/query/useQueryUser.js'
import {Core} from '@/shared'

export const DrcJobInputMultiple = ({
  workspaceId,
  ...props
}: Omit<AutocompleteProps<string, any, any, any>, 'renderInput' | 'options'> & {
  workspaceId: Ip.WorkspaceId
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const queryJobs = UseQueryUser.getJobs(workspaceId)

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
      // renderOption={(props, _) => <Core.Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Core.Txt>}
      renderInput={({InputProps, ...inputProps}) => (
        <Core.Input {...inputProps} {...InputProps} helperText={null} label={m.job} />
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
  const queryJobs = UseQueryUser.getJobs(workspaceId)

  return (
    <Autocomplete
      loading={queryJobs.isLoading}
      options={queryJobs.data ?? []}
      value={props.value ?? null}
      // renderOption={(props, _) => <Core.Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Core.Txt>}
      renderInput={({InputProps, ...inputProps}) => (
        <Core.Input {...inputProps} {...InputProps} helperText={null} label={m.job} />
      )}
      {...props}
    />
  )
}
