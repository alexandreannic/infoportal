import {FormControl, FormHelperText, InputLabel, OutlinedInput, OutlinedInputProps, TextFieldProps} from '@mui/material'
import React, {ReactNode, useEffect, useRef} from 'react'

export interface InputProps extends OutlinedInputProps, Pick<TextFieldProps, 'InputProps' | 'InputLabelProps'> {
  label?: string
  helperText?: ReactNode
}

export const Input = React.forwardRef(
  ({size = 'small', label, sx, error, required, InputLabelProps, id, helperText = '', ...props}: InputProps, ref) => {
    // const id = useMemo(() => Math.random() + '', [])
    const inputElement = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
      if (props.autoFocus) inputElement?.current?.focus()
    }, [])

    if (label) label = label + (label && required ? ' *' : '')
    const notch = !!props.value

    return (
      <FormControl size={size} sx={{width: '100%', ...sx}} error={error}>
        {label && (
          <InputLabel {...InputLabelProps} htmlFor={id} shrink={notch}>
            {label}
          </InputLabel>
        )}
        <OutlinedInput
          error={error}
          label={label}
          inputRef={inputElement}
          id={id}
          required={required}
          ref={ref}
          size={size}
          notched={notch}
          margin="dense"
          {...props}
        />
        {helperText !== null && <FormHelperText>{helperText}&nbsp;</FormHelperText>}
      </FormControl>
    )
  },
)
