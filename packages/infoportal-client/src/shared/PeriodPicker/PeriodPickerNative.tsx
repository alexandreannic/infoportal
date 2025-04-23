import {addDays, subDays} from 'date-fns'
import React, {useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Box, BoxProps} from '@mui/material'
import {IpDatepicker} from '../Datepicker/IpDatepicker'

export interface PeriodPickerProps extends Omit<BoxProps, 'defaultValue' | 'onChange'> {
  min?: Date
  max?: Date
  value?: [Date | undefined, Date | undefined]
  defaultValue?: [Date | undefined, Date | undefined]
  onChange: (_: [Date | undefined, Date | undefined]) => void
  label?: [string, string]
  fullWidth?: boolean
}

export const PeriodPickerNative = ({min, max, value, onChange, label, fullWidth, sx, ...props}: PeriodPickerProps) => {
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const {m} = useI18n()

  useEffect(() => {
    if (value) {
      if (value[0] && value[0].getTime() !== start?.getTime()) setStart(value[0])
      if (value[1] && value[1].getTime() !== end?.getTime()) setEnd(value[1])
    }
  }, [value])

  const handleStartChange = (newStart?: Date) => {
    const newEnd = end && newStart ? (newStart.getTime() > end.getTime() ? addDays(newStart, 1) : end) : undefined
    setStart(newStart)
    setEnd(newEnd)
    onChange([newStart, newEnd])
  }
  const handleEndChange = (newEnd?: Date) => {
    const newStart = start && newEnd ? (newEnd.getTime() < start.getTime() ? subDays(newEnd, 1) : start) : undefined
    setStart(newStart)
    setEnd(newEnd)
    onChange([newStart, newEnd])
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...(fullWidth && {width: '100%'}),
        ...sx,
      }}
    >
      <IpDatepicker
        min={min}
        max={max}
        label={label?.[0] ?? m.start}
        fullWidth={fullWidth}
        value={start}
        onChange={handleStartChange}
        sx={{marginRight: '-1px'}}
        inputProps={{
          className: 'aa-datepicker-min',
        }}
        InputProps={{
          sx: (_) => ({
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
          }),
        }}
        timeOfDay="startOfDay"
      />

      <IpDatepicker
        min={min}
        max={max}
        label={label?.[1] ?? m.end}
        fullWidth={fullWidth}
        value={end}
        onChange={handleEndChange}
        InputProps={{
          sx: (_) => ({
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          }),
        }}
        timeOfDay="endOfDay"
      />
    </Box>
  )
}
