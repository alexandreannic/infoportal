import React, {ReactElement, ReactNode, useEffect, useState} from 'react'
import {ScRadioGroupItemProps} from './RadioGroupItem'
import {Box, FormHelperText} from '@mui/material'
import {SxProps} from '@mui/system'
import {Theme} from '@mui/material/styles'

interface BaseProps<T> {
  dense?: boolean
  inline?: boolean
  children: React.ReactNode //ReactElement<ScRadioGroupItemProps>[]
  error?: boolean
  className?: string
  sx?: SxProps<Theme>
  helperText?: ReactNode
  disabled?: boolean
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

export type ScRadioGroupProps<T> = SingleProps<T> | MultipleProps<T>

const isMultiple = <T,>(multiple: boolean | undefined, t: T | T[]): t is T[] => {
  return !!multiple
}

const _ScRadioGroup = <T,>(
  {
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
  }: ScRadioGroupProps<T>,
  ref: any,
) => {
  const [innerValue, setInnerValue] = useState<T | T[]>()

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value)
    } else if (multiple) {
      setInnerValue([])
    }
  }, [value])

  return (
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
        children as ReactElement<ScRadioGroupItemProps<T>>[],
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
              if (child.props.disabled) return
              if (child.props.onClick) child.props.onClick(event)
              if (!disabled) {
                const value = child.props.value
                setInnerValue((currentValue) => {
                  const newValue = (() => {
                    if (isMultiple(multiple, currentValue)) {
                      if (currentValue.includes(value)) {
                        return currentValue.filter((_) => _ !== value)
                      } else {
                        return [...currentValue, value]
                      }
                    }
                    return value
                  })()
                  if (onChange) onChange(newValue as any)
                  return newValue
                })
              }
            },
          }),
      )}
      {helperText && (
        <FormHelperText error={error} sx={{marginLeft: '14px'}}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}

/**
 * Workaround because forwardRef break the generic type of ScSelect.
 */
export const ScRadioGroup = React.forwardRef(_ScRadioGroup as any) as <T>(
  props: ScRadioGroupProps<T> & {ref?: React.ForwardedRef<any>},
) => ReturnType<typeof _ScRadioGroup>
