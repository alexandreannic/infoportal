import React, {useMemo, useRef, useState} from 'react'
import {DateRange, PickersShortcutsItem, StaticDateRangePicker} from '@mui/x-date-pickers-pro'
import {Box, Popover, TextField} from '@mui/material'
import {mapFor} from '@axanc/ts-utils'
import {endOfMonth, format, startOfMonth, subMonths} from 'date-fns'
import {useI18n} from '@/core/i18n'
import {PeriodPickerProps} from '@/shared/PeriodPicker/PeriodPicker'

/** @deprecated Not used, keep it in case I got issue with the native MUI behavior*/
export const PeriodPickerMui2 = ({min, max, value, onChange, label, fullWidth, sx, ...props}: PeriodPickerProps) => {
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const {m} = useI18n()
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLDivElement | null>(null)
  // const [rangePosition, setRangePosition] = useState<'start' | 'end' | undefined>(undefined)

  const shortcutsItems: PickersShortcutsItem<DateRange<Date>>[] = useMemo(() => {
    const today = new Date()
    const limit = 7
    const months: PickersShortcutsItem<DateRange<Date>>[] = mapFor(limit, (i) => {
      const currentDate = subMonths(today, limit - 1 - i)
      return {
        label: format(currentDate, 'MMMM yyyy'),
        getValue: () => [startOfMonth(currentDate), endOfMonth(currentDate)],
      }
    })
    return [...months, {label: 'Reset', getValue: () => [null, null]}]
  }, [])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ...(fullWidth && {width: '100%'}),
          ...sx,
        }}
      >
        <TextField
          margin="dense"
          variant="outlined"
          size="small"
          fullWidth={fullWidth}
          InputLabelProps={{shrink: true}}
          ref={anchor as any}
          label={label?.[0] ?? m.start}
          value={start}
          onClick={() => setOpen((_) => !_)}
          onChange={console.log}
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
          // timeOfDay="startOfDay"
          type="date"
        />

        <TextField
          type="date"
          margin="dense"
          variant="outlined"
          size="small"
          fullWidth={fullWidth}
          InputLabelProps={{shrink: true}}
          onClick={() => setOpen((_) => !_)}
          label={label?.[1] ?? m.end}
          value={end}
          onChange={console.log}
          InputProps={{
            sx: (_) => ({
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            }),
          }}
          // timeOfDay="endOfDay"
        />
      </Box>

      <Popover open={open} anchorEl={anchor.current} onClose={() => setOpen(false)}>
        <StaticDateRangePicker
          minDate={min}
          maxDate={max}
          // rangePosition={rangePosition}
          onChange={(_: DateRange<Date>) => console.log(_)}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
            actionBar: {actions: []},
          }}
          calendars={2}
        />
      </Popover>
    </>
  )
}
