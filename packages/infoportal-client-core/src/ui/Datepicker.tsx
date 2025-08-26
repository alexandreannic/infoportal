import {
  FormControl,
  InputLabel,
  InputProps as StandardInputProps,
  OutlinedInput,
  OutlinedInputProps,
  TextFieldProps,
} from '@mui/material'
import {fromZonedTime} from 'date-fns-tz'
import React, {useEffect, useState} from 'react'

export interface DatepickerProps
  extends Omit<OutlinedInputProps, 'onChange' | 'value'>,
    Pick<TextFieldProps, 'InputProps' | 'InputLabelProps'> {
  min?: Date
  max?: Date
  value?: Date
  onChange: (_: Date | undefined) => void
  label?: string
  InputProps?: Partial<StandardInputProps>
  fullWidth?: boolean
  timeOfDay?: // when picking a date, the Date returned will be at 00:00:000 in the user timezone
  | 'startOfDay'
    // with this, it will be at 23:59:999 in the user timezone
    | 'endOfDay'
}

const date2string = (_: Date) => {
  return [
    _.getFullYear(),
    (_.getMonth() + 1).toString().padStart(2, '0'),
    _.getDate().toString().padStart(2, '0'),
  ].join('-')
}

const safeDate2string = (_?: string | Date) => {
  if (_ === undefined || _ === null) return
  try {
    return date2string(_ as any)
  } catch (e) {
    try {
      return date2string(new Date(_))
    } catch (e) {}
  }
}

export const IpDatepicker = ({
  value,
  min,
  max,
  onChange,
  label,
  fullWidth,
  InputLabelProps,
  id,
  timeOfDay = 'startOfDay',
  sx,
  ...props
}: DatepickerProps) => {
  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // it is either an empty string or yyyy-mm-dd
    if (newValue.length) {
      const dateAndTime = `${newValue}T${timeOfDay === 'startOfDay' ? '00:00:00.000' : '23:59:59.999'}`
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const utcDate = fromZonedTime(dateAndTime, userTimeZone)
      onChange(utcDate)
    } else {
      onChange(undefined)
    }
  }

  const [displayedDate, setDisplayedDate] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (value) {
      const yyyymmdd = safeDate2string(value)
      setDisplayedDate(yyyymmdd)
    } else {
      setDisplayedDate(undefined)
    }
  }, [setDisplayedDate, value])

  return (
    <FormControl size="small" sx={{...sx}}>
      <InputLabel {...InputLabelProps} shrink={true} htmlFor={id}>
        {label}
      </InputLabel>
      <OutlinedInput
        {...props}
        id={id}
        type="date"
        inputProps={{
          min: safeDate2string(min),
          max: safeDate2string(max),
        }}
        margin="dense"
        size="small"
        label={label}
        value={displayedDate}
        onChange={onChangeDate}
        fullWidth={fullWidth}
      />
    </FormControl>
  )
}
