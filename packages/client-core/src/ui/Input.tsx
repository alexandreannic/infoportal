import {FormControl, FormHelperText, InputLabel, OutlinedInput, OutlinedInputProps, TextFieldProps} from '@mui/material'
import React, {ReactNode, useEffect, useMemo, useRef} from 'react'

export type InputProps = Omit<OutlinedInputProps, 'size'> &
  Pick<TextFieldProps, 'InputProps' | 'InputLabelProps'> & {
    label?: string
    size?: 'tiny' | 'small' | 'medium'
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

    const muiSize = useMemo(() => (size === 'tiny' ? 'small' : size), [size])

    return (
      <FormControl size={muiSize} sx={{width: '100%', ...sx}} error={error} variant="outlined">
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
          size={muiSize}
          error={error}
          ref={ref}
          {...props}
          slotProps={
            size === 'tiny'
              ? {
                  ...props.slotProps,
                  input: {
                    ...props.slotProps?.input,
                    sx: {
                      ...props.slotProps?.input?.sx,
                      paddingTop: '6px',
                      paddingBottom: '6px',
                    },
                  },
                }
              : {}
          }
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
