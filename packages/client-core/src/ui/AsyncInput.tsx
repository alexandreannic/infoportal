import {useCallback, useEffect, useState} from 'react'
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

export type AsyncInputProps = {
  value?: string
  loading?: boolean
  originalValue?: string | null
  debounce?: number
  onChange?: (val: string | undefined) => void
  onSubmit?: (val: string | undefined) => Promise<void> | void
} & Omit<InputProps, 'onSubmit' | 'onChange' | 'value'>

export const AsyncInput = ({
  value: propValue,
  originalValue = null,
  debounce = 0,
  onChange,
  loading,
  onSubmit,
  ...props
}: AsyncInputProps) => {
  const [local, setLocal] = useState(propValue ?? '')
  const debounced = useDebouncedValue(local, debounce)

  useEffect(() => {
    if (debounce > 0) {
      onChange?.(debounced === '' || debounced === originalValue ? undefined : debounced)
    }
  }, [debounced])

  useEffect(() => {
    if (debounce === 0) {
      onChange?.(local === '' || local === originalValue ? undefined : local)
    }
  }, [local])

  const triggerSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(local === '' || local === originalValue ? undefined : local)
    }
  }, [local, originalValue, onSubmit])

  return (
    <Input
      {...props}
      value={local}
      onChange={e => setLocal(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          triggerSubmit()
        }
      }}
      endAdornment={
        <Box sx={{mr: -1}} display="flex" alignItems="center">
          <IconBtn color="success" size="small" onClick={triggerSubmit} disabled={local === originalValue}>
            check
          </IconBtn>

          {local !== (originalValue ?? '') && (
            <IconBtn
              color="error"
              size="small"
              onClick={() => {
                setLocal(originalValue ?? '')
                onChange?.(undefined)
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
