import React, {ReactElement, ReactNode, useEffect, useState} from 'react'
import {RadioGroupItemProps} from './RadioGroupItem.js'
import {Box, FormHelperText, styled, SxProps, Theme} from '@mui/material'
import {styleUtils} from '../../core/theme.js'
interface BaseProps<T> {
  dense?: boolean
  inline?: boolean
  children: React.ReactNode //ReactElement<Core.RadioGroupItemProps>[]
  error?: boolean
  className?: string
  sx?: SxProps<Theme>
  helperText?: ReactNode
  disabled?: boolean
  label?: string
}

interface SingleProps<T> extends BaseProps<T> {
  defaultValue?: T
  value?: T
  onChange?: (_: T) => void
  multiple?: false
}

interface MultipleProps<T> extends BaseProps<T> {
  defaultValue?: T[]
  value?: T[]
  onChange?: (_: T[]) => void
  multiple: true
}

export type RadioGroupProps<T> = SingleProps<T> | MultipleProps<T>

const isMultiple = <T,>(multiple: boolean | undefined, t: T | T[]): t is T[] => {
  return !!multiple
}

const Label = styled('div')(({theme}) => ({
  color: theme.vars.palette.text.secondary,
  fontSize: styleUtils(theme as Theme).fontSize.small,
  marginBottom: theme.spacing(0.5),
}))

const _RadioGroup = <T,>(
  {
    label,
    inline,
    disabled,
    error,
    children,
    dense,
    value,
    onChange,
    multiple,
    helperText,
    defaultValue,
    sx,
    ...props
  }: RadioGroupProps<T>,
  ref: any,
) => {
  const [innerValue, setInnerValue] = useState<T | T[]>()

  // useEffect(() => {
  //   onChange?.(innerValue as any)
  // }, [innerValue])

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value)
    } else if (multiple) {
      setInnerValue([])
    }
  }, [value])

  return (
    <>
      {label && <Label>{label}</Label>}
      <Box
        ref={ref}
        {...props}
        role="listbox"
        sx={{
          ...(inline && {
            display: 'flex',
          }),
          ...sx,
        }}
      >
        {React.Children.map(
          children as ReactElement<RadioGroupItemProps<T>>[],
          (child, i) =>
            child &&
            React.cloneElement(child, {
              ...child.props,
              key: child.key ?? i,
              dense,
              error,
              disabled: child.props.disabled ?? disabled,
              multiple,
              inline,
              selected:
                innerValue && isMultiple(multiple, innerValue)
                  ? innerValue.includes(child.props.value)
                  : innerValue === child.props.value,
              onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (child.props.disabled || disabled) return
                if (child.props.onClick) child.props.onClick(event)
                const value = child.props.value
                const newValue = (() => {
                  if (isMultiple(multiple, innerValue)) {
                    if (innerValue.includes(value)) {
                      return innerValue.filter(_ => _ !== value)
                    } else {
                      return [...innerValue, value]
                    }
                  }
                  return value
                })()
                setInnerValue(newValue)
                if (onChange) onChange(newValue as any)
              },
            }),
        )}
        {helperText && (
          <FormHelperText error={error} sx={{marginLeft: '14px'}}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </>
  )
}

/**
 * Workaround because forwardRef break the generic module of ScSelect.
 */
export const RadioGroup = React.forwardRef(_RadioGroup as any) as <T>(
  props: RadioGroupProps<T> & {ref?: React.ForwardedRef<any>},
) => ReturnType<typeof _RadioGroup>
