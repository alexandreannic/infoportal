import {FormControl, FormHelperText, InputLabel, OutlinedInput, OutlinedInputProps, TextFieldProps} from '@mui/material'
import React, {ReactNode, useEffect, useRef} from 'react'

export interface IpInputProps extends OutlinedInputProps, Pick<TextFieldProps, 'InputProps' | 'InputLabelProps'> {
  label?: string
  helperText?: ReactNode
}

export const IpInput = React.forwardRef(
  ({size = 'small', label, sx, error, required, InputLabelProps, id, helperText = '', ...props}: IpInputProps, ref) => {
    // const id = useMemo(() => Math.random() + '', [])
    const inputElement = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
      if (props.autoFocus) inputElement?.current?.focus()
    }, [])

    if (label) label = label + (label && required ? ' *' : '')

    return (
      <FormControl size={size} sx={{width: '100%', ...sx}} error={error}>
        <InputLabel {...InputLabelProps} htmlFor={id} shrink={!!props.value}>
          {label}
        </InputLabel>
        <OutlinedInput
          notched={!!props.value}
          slotProps={{}}
          error={error}
          label={label}
          inputRef={inputElement}
          id={id}
          required={required}
          ref={ref}
          size={size}
          margin="dense"
          {...props}
        />
        {helperText !== null && <FormHelperText>{helperText}&nbsp;</FormHelperText>}
      </FormControl>
    )
  },
)
