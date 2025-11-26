import React from 'react'
import {DateRange, DateRangePicker, PickersShortcutsItem, SingleInputDateRangeField} from '@mui/x-date-pickers-pro'
// import {unstable_useMultiInputDateRangeField as useMultiInputDateRangeField} from '@mui/x-date-pickers-pro/MultiInputDateRangeField'
import {endOfMonth, format, startOfMonth, subMonths} from 'date-fns'
import {PeriodPickerProps} from './PeriodPicker.js'
import {styleUtils} from '../../core/theme.js'
import {useTheme} from '@mui/material'

const shortcutsItems: PickersShortcutsItem<DateRange<Date>>[] = (() => {
  const today = new Date()
  const limit = 7
  const months = Array.from({length: limit}, (_, i) => {
    const currentDate = subMonths(today, limit - 1 - i)
    return {
      label: format(currentDate, 'MMMM yyyy'),
      getValue: () => [startOfMonth(currentDate), endOfMonth(currentDate)],
    }
  })
  return [...months, {label: 'Reset', getValue: () => [null, null] as any}]
})()

const toDateRange = (_?: [Date | null | undefined, Date | null | undefined]): DateRange<Date> => {
  const [start, end] = _ ?? []
  return [start ?? null, end ?? null]
}

// const revertNulls = (_?: [Date | null, Date | null]): [Date | undefined, Date | undefined] => {
//   const [start, end] = _ ?? []
//   return [start ?? undefined, end ?? undefined]
// }

type DateChangeHandler = (range: DateRange<Date>) => void

export const PeriodPickerMui = ({
  min,
  max,
  defaultValue,
  value,
  onChange,
  label,
  fullWidth = true,
  sx,
}: PeriodPickerProps) => {
  const handleChange: DateChangeHandler = (range: DateRange<Date>) => onChange(range)
  const t = useTheme()
  return (
    <DateRangePicker
      minDate={min}
      maxDate={max}
      localeText={{start: label?.[0], end: label?.[1]}}
      sx={{mb: -0.25, mt: -0.5, ...sx}}
      defaultValue={toDateRange(defaultValue)}
      value={toDateRange(value)}
      onChange={handleChange}
      slotProps={{
        textField: {
          size: 'small',
          variant: 'outlined',
          margin: 'dense',
          sx: {
            '& .MuiPickersOutlinedInput-notchedOutline': {
              borderRadius: '6px',
              borderColor: styleUtils(t).color.input.default.borderColor,
            },
            minWidth: 218,
            ...sx,
            borderRadius: 0,
          },
          fullWidth,
        },
        shortcuts: {items: shortcutsItems},
      }}
      slots={{field: SingleInputDateRangeField}}
    />
  )
}
//
// const BrowserMultiInputDateRangeField = React.forwardRef<HTMLDivElement, any>((props, ref) => {
//   const {
//     slotProps,
//     value,
//     defaultValue,
//     format,
//     onChange,
//     readOnly,
//     disabled,
//     onError,
//     fullWidth,
//     shouldDisableDate,
//     minDate,
//     maxDate,
//     disableFuture,
//     disablePast,
//     sx,
//     selectedSections,
//     onSelectedSectionsChange,
//     className,
//   } = props
//
//   const {inputRef: startInputRef, ...startTextFieldProps} = slotProps?.textField || {}
//   const {inputRef: endInputRef, ...endTextFieldProps} = slotProps?.textField || {}
//   const manager = useDateRangeManager(props)
//   const {
//     startTextField: {sectionListRef: startRef, ...startDateProps},
//     endTextField: {sectionListRef: endRef, ...endDateProps},
//   } = useMultiInputDateRangeField({
//     internalProps: {
//       value,
//       defaultValue,
//       format,
//       onChange,
//       readOnly,
//       disabled,
//       onError,
//       shouldDisableDate,
//       minDate,
//       maxDate,
//       disableFuture,
//       disablePast,
//       selectedSections,
//       onSelectedSectionsChange,
//     },
//     rootProps: {
//       startInputRef,
//       endInputRef,
//     },
//     manager,
//     startTextFieldProps,
//     endTextFieldProps,
//   })
//
//   return (
//     <Box
//       ref={ref}
//       className={className}
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         ...(fullWidth && {width: '100%'}),
//         ...sx,
//       }}
//     >
//       <TextField
//         module="text"
//         margin="dense"
//         variant="outlined"
//         fullWidth
//         size="small"
//         sx={{minWidth: 115, marginRight: '-1px'}}
//         slotProps={{
//           inputLabel: {shrink: true},
//           input: {
//             ...startDateProps.InputProps,
//             sx: {borderBottomRightRadius: 0, borderTopRightRadius: 0},
//           },
//         }}
//         {...startDateProps}
//         inputRef={startRef}
//       />
//       <TextField
//         module="text"
//         margin="dense"
//         variant="outlined"
//         fullWidth
//         size="small"
//         sx={{minWidth: 115}}
//         slotProps={{
//           inputLabel: {shrink: true},
//           input: {
//             ...endDateProps.InputProps,
//             sx: {borderBottomLeftRadius: 0, borderTopLeftRadius: 0},
//           },
//         }}
//         {...endDateProps}
//         inputRef={endRef}
//       />
//     </Box>
//   )
// })
//
// BrowserMultiInputDateRangeField.displayName = 'BrowserMultiInputDateRangeField'
