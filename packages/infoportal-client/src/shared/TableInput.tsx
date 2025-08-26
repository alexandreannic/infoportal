import {DebouncedInput} from '@/shared/DebouncedInput'
import React from 'react'
import {TableIcon} from '@/shared/TableIcon'
import {StateStatus} from 'infoportal-common'
import {appConfig} from '@/conf/AppConfig'
import {styled} from '@mui/system'

const Input = styled('input')(({theme: t}) => ({
  height: '100%',
  margin: 0,
  border: 'none',
  background: 'none',
  paddingTop: '0 !important',
  paddingBottom: '0 !important',
}))

const Root = styled('div')(({theme: t}) => ({
  // transition: (t as Theme).transitions.create('all'),
  // border: '1px solid',
  // borderColor: 'transparent',
  height: '100%',
  // '&:hover': {
  //   borderColor: t.palette.divider,
  // },
  // '&:focus': {
  //   borderColor: t.palette.primary.main,
  // },
}))

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
} & Omit<Core.InputProps, 'helperText' | 'onChange' | 'value'>) => {
  return (
    <Root className="table-input">
      <DebouncedInput<string>
        debounce={debounce}
        value={value}
        onChange={_ => onChange(_ === '' || _ === originalValue ? undefined : _)}
      >
        {(value, onChange) => <Input value={value} onChange={e => onChange(e.target.value)} />}
      </DebouncedInput>
      {helper && (
        <TableIcon tooltip={helper.text ?? undefined} color={helper.status}>
          {appConfig.iconStatus[helper.status]}
        </TableIcon>
      )}
      {value !== originalValue && originalValue !== null && (
        <Core.IconBtn
          disabled={props.disabled}
          size="small"
          sx={{mr: -2, mt: 0.25}}
          onClick={() => onChange(originalValue ?? '')}
        >
          clear
        </Core.IconBtn>
      )}
    </Root>
  )
}
