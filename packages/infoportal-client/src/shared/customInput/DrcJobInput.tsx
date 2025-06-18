import {Autocomplete, AutocompleteProps, Chip} from '@mui/material'
import {IpInput} from '@/shared/Input/Input'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@/shared/hook/useFetcher'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'

export const DrcJobInputMultiple = (
  props: Omit<AutocompleteProps<string, any, any, any>, 'renderInput' | 'options'>,
) => {
  const {workspaceId} = useWorkspaceRouter()
  const {m} = useI18n()
  const {api} = useAppSettings()
  const drcJobsFetcher = useFetcher(api.user.fetchDrcJobs)

  useEffect(() => {
    drcJobsFetcher.fetch({}, {workspaceId})
  }, [])

  return (
    <Autocomplete
      multiple
      loading={drcJobsFetcher.loading}
      options={drcJobsFetcher.get ?? []}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip size="small" variant="outlined" label={option} {...getTagProps({index})} />
        ))
      }
      value={props.value ?? []}
      // renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
      renderInput={({InputProps, ...inputProps}) => (
        <IpInput {...inputProps} {...InputProps} helperText={null} label={m.drcJob} />
      )}
      {...props}
    />
  )
}

export const DrcJobInputSingle = (props: Omit<AutocompleteProps<string, any, any, any>, 'renderInput' | 'options'>) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const {workspaceId} = useWorkspaceRouter()
  const drcJobsFetcher = useFetcher(api.user.fetchDrcJobs)

  useEffect(() => {
    drcJobsFetcher.fetch({}, {workspaceId})
  }, [])

  return (
    <Autocomplete
      loading={drcJobsFetcher.loading}
      options={drcJobsFetcher.get ?? []}
      value={props.value ?? null}
      // renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
      renderInput={({InputProps, ...inputProps}) => (
        <IpInput {...inputProps} {...InputProps} helperText={null} label={m.drcJob} />
      )}
      {...props}
    />
  )
}
