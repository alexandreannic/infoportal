import {IpInput, IpInputProps} from '@/shared/Input/Input'
import {IpIconBtn} from '@/shared/IconBtn'
import {DebouncedInput} from '@/shared/DebouncedInput'
import React from 'react'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {StateStatus} from 'infoportal-common'
import {appConfig} from '@/conf/AppConfig'

export const TableInput = ({
  debounce = 1250,
  value,
  originalValue,
  onChange,
  helper,
  ...props
}: {
  helper?: {
    text?: string
    status: StateStatus
  }
  onChange: (_: string | undefined) => void
  originalValue?: string | null
  value?: string
  debounce?: number
} & Omit<IpInputProps, 'helperText' | 'onChange' | 'value'>) => {
  return (
    <DebouncedInput<string>
      debounce={debounce}
      value={value}
      onChange={(_) => onChange(_ === '' || _ === originalValue ? undefined : _)}
    >
      {(value, onChange) => (
        <IpInput
          helperText={null}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          endAdornment={
            <>
              {helper && (
                <TableIcon tooltip={helper.text ?? undefined} color={helper.status}>
                  {appConfig.iconStatus[helper.status]}
                </TableIcon>
              )}
              {value !== originalValue && originalValue !== null && (
                <IpIconBtn
                  disabled={props.disabled}
                  size="small"
                  sx={{mr: -2, mt: 0.25}}
                  onClick={() => onChange(originalValue ?? '')}
                >
                  clear
                </IpIconBtn>
              )}
            </>
          }
          {...props}
        />
      )}
    </DebouncedInput>
  )
}
