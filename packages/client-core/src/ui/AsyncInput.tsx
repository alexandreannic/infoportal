import {forwardRef, JSX, useCallback, useEffect, useState} from 'react'
import {IconBtn, Input, InputProps} from '.'
import {Box} from '@mui/material'

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

type AsyncInputBase<T extends string | number = string | number> = {
  loading?: boolean
  debounce?: number
  value?: T
  originalValue?: T | null
  onChange?: (val: T | undefined) => void
  onSubmit?: (val: T | undefined) => Promise<void> | void
} & Omit<InputProps, 'onSubmit' | 'onChange' | 'type' | 'value'>

export function AsyncInput(props: AsyncInputBase<number> & {type: 'number'}): JSX.Element
export function AsyncInput(props: AsyncInputBase<string> & {type?: Exclude<InputProps['type'], 'number'>}): JSX.Element

export function AsyncInput({
  value: propValue,
  originalValue = null,
  debounce = 0,
  onChange,
  loading,
  onSubmit,
  type,
  ...props
}: AsyncInputBase<any> & {type?: string}) {
  const [local, setLocal] = useState(propValue === undefined || propValue === null ? '' : String(propValue))
  const debounced = useDebouncedValue(local, debounce)

  const convert = useCallback(
    (raw: string): string | number | undefined => {
      if (type === 'number') {
        return raw === '' || raw === String(originalValue) ? undefined : Number(raw)
      }
      return raw === '' || raw === String(originalValue) ? undefined : raw
    },
    [type, originalValue],
  )

  useEffect(() => {
    if (debounce > 0) {
      onChange?.(convert(debounced) as any)
    }
  }, [debounced])

  useEffect(() => {
    if (debounce === 0) {
      onChange?.(convert(local) as any)
    }
  }, [local])

  const triggerSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(convert(local) as any)
    }
  }, [local, convert, onSubmit])

  return (
    <Input
      {...props}
      type={type}
      value={local}
      onChange={e => setLocal(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          triggerSubmit()
        }
      }}
      endAdornment={
        <Box sx={{mr: -1}} display="flex" alignItems="center">
          {local !== String(originalValue ?? '') && (
            <IconBtn color="success" size="small" onClick={triggerSubmit} disabled={local === String(originalValue)}>
              check
            </IconBtn>
          )}

          {local !== String(originalValue ?? '') && (
            <IconBtn
              color="error"
              size="small"
              onClick={() => {
                setLocal(originalValue == null ? '' : String(originalValue))
                onChange?.(undefined as any)
              }}
            >
              clear
            </IconBtn>
          )}
        </Box>
      }
    />
  )
}
