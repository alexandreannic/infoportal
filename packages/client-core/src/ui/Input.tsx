import {FormControl, FormHelperText, InputLabel, OutlinedInput, OutlinedInputProps, TextFieldProps} from '@mui/material'
import React, {ReactNode, useEffect, useRef} from 'react'

export interface InputProps extends OutlinedInputProps, Pick<TextFieldProps, 'InputProps' | 'InputLabelProps'> {
  label?: string
  helperText?: ReactNode
  disableBrowserAutocomplete?: boolean
}

export const Input = React.forwardRef(
  (
    {
      size = 'small',
      label,
      sx,
      error,
      disableBrowserAutocomplete,
      required,
      InputLabelProps,
      id,
      helperText = '',
      ...props
    }: InputProps,
    ref,
  ) => {
    // const id = useMemo(() => Math.random() + '', [])
    const inputElement = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
      if (props.autoFocus) inputElement?.current?.focus()
    }, [])

    if (label) label = label + (label && required ? ' *' : '')
    // const notch = !!props.value

    return (
      <FormControl size={size} sx={{width: '100%', ...sx}} error={error} variant="outlined">
        {label && (
          <InputLabel htmlFor={id} {...InputLabelProps}>
            {label}
          </InputLabel>
        )}
        <OutlinedInput
          id={id}
          label={label}
          inputRef={inputElement}
          required={required}
          size={size}
          error={error}
          ref={ref}
          {...props}
          inputProps={{
            ...props.inputProps,
            ...(disableBrowserAutocomplete && {
              ...props.inputProps,
              autoComplete: 'nope',
              form: {
                autoComplete: 'off',
              },
            }),
          }}
        />

        {helperText !== null && <FormHelperText>{helperText}&nbsp;</FormHelperText>}
      </FormControl>
    )
  },
)
