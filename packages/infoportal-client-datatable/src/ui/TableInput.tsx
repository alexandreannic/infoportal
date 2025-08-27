import React from 'react'
import {StateStatus} from 'infoportal-common'
import {styled} from '@mui/system'
import {DebouncedInput, IconBtn, InputProps} from '@infoportal/client-core'
import {TableIcon} from '@/ui/TableIcon.js'
import {useI18n} from '@/Translation.js'

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
} & Omit<InputProps, 'helperText' | 'onChange' | 'value'>) => {
  const {muiIcons} = useI18n()
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
          {muiIcons[helper.status]}
        </TableIcon>
      )}
      {value !== originalValue && originalValue !== null && (
        <IconBtn
          disabled={props.disabled}
          size="small"
          sx={{mr: -2, mt: 0.25}}
          onClick={() => onChange(originalValue ?? '')}
        >
          clear
        </IconBtn>
      )}
    </Root>
  )
}
