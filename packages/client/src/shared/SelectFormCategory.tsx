import {Autocomplete, AutocompleteProps, CircularProgress} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryForm} from '@/core/query/useQueryForm.js'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '.'

export function SelectFormCategory({
  workspaceId,
  loading: _loading,
  ...props
}: Omit<AutocompleteProps<string, false, true, true>, 'renderInput' | 'options'> & {
  InputProps?: Core.InputProps
  loading?: boolean
  workspaceId: Ip.WorkspaceId
}) {
  const categories = UseQueryForm.categories(workspaceId)
  const {m} = useI18n()
  const loading = !categories || _loading
  return (
    <Autocomplete
      freeSolo
      disableClearable
      loading={loading}
      options={categories ?? []}
      {...props}
      renderInput={params => (
        <Core.Input
          {...params.InputProps}
          inputProps={params.inputProps}
          helperText={null}
          label={m.category}
          ref={params.InputProps.ref}
          endAdornment={<>{loading ? <CircularProgress size={20} /> : null}</>}
          {...props.InputProps}
        />
      )}
    />
  )
}
