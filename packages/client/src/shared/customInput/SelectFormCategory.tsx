import {Autocomplete, AutocompleteProps, CircularProgress} from '@mui/material'
import {Ip} from '@infoportal/api-sdk'
import {UseQueryForm} from '@/core/query/form/useQueryForm.js'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '../index'
import {useState} from 'react'

export function SelectFormCategory({
  workspaceId,
  loading: _loading,
  value,
  onInputChange,
  ...props
}: Omit<AutocompleteProps<string, false, true, true>, 'renderInput' | 'options'> & {
  InputProps?: Core.InputProps
  loading?: boolean
  workspaceId: Ip.WorkspaceId
}) {
  const categories = UseQueryForm.categories(workspaceId)
  const {m} = useI18n()
  const loading = !categories || _loading
  const [inputValue, setInputValue] = useState('')

  return (
    <Autocomplete
      freeSolo
      disableClearable
      loading={loading}
      options={categories ?? []}
      onInputChange={(e, newInputValue, reason) => {
        setInputValue(newInputValue)
        onInputChange?.(e, newInputValue, reason)
      }}
      {...props}
      renderInput={params => (
        <Core.Input
          {...params.InputProps}
          inputProps={params.inputProps}
          helperText={null}
          label={m.category}
          ref={params.InputProps.ref}
          endAdornment={
            <>
              {loading && <CircularProgress size={20} />}
              {inputValue !== '' && categories && !categories.includes(inputValue) && (
                <Core.IconBtn size="small" color="primary" children="create_new_folder" />
              )}
            </>
          }
          {...props.InputProps}
        />
      )}
    />
  )
}
