import {IpIconBtn} from '@/shared/IconBtn'
import {DebouncedInput} from '@/shared/DebouncedInput'
import React from 'react'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {StateStatus} from '@infoportal-common'
import {appConfig} from '@/conf/AppConfig'
import {makeStyles} from 'tss-react/mui'

const useStyles = makeStyles()((t) => ({
  input: {
    border: 'none',
    fontFamily: t.typography.fontFamily,
    background: 'transparent',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    background: 'rgba(0,0,0,.02)',
  }
}))

export const TableInput = ({
  debounce = 1250,
  value,
  className,
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
} & Omit<HTMLInputElement, 'onChange' | 'value'>) => {
  const {classes, cx} = useStyles()
  return (
    <div className={'input-table ' + classes.root}>
      <DebouncedInput<string>
        debounce={debounce}
        value={value}
        onChange={_ => onChange(_ === '' || _ === originalValue ? undefined : _)}
      >
        {(value, onChange) => (
          <input
            className={(className ?? '') + classes.input}
            value={value}
            onChange={e => onChange(e.target.value)}
            {...props}
          />
        )}
      </DebouncedInput>
      {helper && (
        <TableIcon tooltip={helper.text ?? undefined} color={helper.status}>{appConfig.iconStatus[helper.status]}</TableIcon>
      )}
      {value !== originalValue && originalValue !== null &&
        <IpIconBtn
          size="small"
          sx={{mr: -2, mt: .25}}
          onClick={() => onChange(originalValue ?? '')}
        >
          clear
        </IpIconBtn>
      }
    </div>
  )
}