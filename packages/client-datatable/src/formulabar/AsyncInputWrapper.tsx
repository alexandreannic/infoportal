import React, {ReactNode, useMemo, useState} from 'react'
import {Icon, Box, Tooltip} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import * as Core from '@infoportal/client-core'
import {Txt} from '@infoportal/client-core'

export const StartAdornmentLabel = ({label}: {label?: string}) => {
  return (
    <Txt bold sx={{mr: 1}} color="disabled">
      {label}:
    </Txt>
  )
}

export const AsyncInputWrapper = ({
  value,
  onConfirm,
  errorMsg,
  label,
  isPending,
  renderInput,
}: {
  value?: any
  label?: string
  onConfirm: (_: any) => Promise<{editedCount: number}>
  renderInput: (_: {value?: any; placeholder?: string; onChange: (_: any) => any}) => ReactNode
  isPending?: boolean
  isSuccess?: boolean
  errorMsg?: string
}) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<any>(value)

  const hasChanged = useMemo(() => {
    return innerValue !== value
  }, [innerValue, value])

  return (
    <>
      <Box sx={{flex: 1, display: 'flex', alignItems: 'center'}}>
        <StartAdornmentLabel label={label} />
        {renderInput({
          placeholder: '...',
          value: innerValue,
          onChange: setInnerValue,
        })}
      </Box>
      {errorMsg && (
        <Tooltip title={m.somethingWentWrong}>
          <Icon color="error">error</Icon>
        </Tooltip>
      )}
      <Core.Btn
        icon="check"
        size="small"
        color={errorMsg && !hasChanged ? 'error' : 'primary'}
        variant={hasChanged ? 'contained' : 'outlined'}
        loading={isPending}
        disabled={!hasChanged}
        onClick={() => onConfirm(innerValue)}
      >
        {m.save}
      </Core.Btn>
    </>
  )
}
