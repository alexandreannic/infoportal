import React, {useState} from 'react'
import {Box, Table, TableBody, TableCell, TableRow, TextField, useTheme} from '@mui/material'
import {Core} from '@/shared'
import {Label} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {useI18n} from '@infoportal/client-i18n'
import {styleUtils} from '@infoportal/client-core'

export type Range = {
  min: number
  max: number
}

type Props = {
  value?: Range[]
  onChange?: (ranges: Range[]) => void
}

export function RangeTableEditor({value = [], onChange}: Props) {
  const t = useTheme()
  const {m} = useI18n()
  const [ranges, setRanges] = useState<Range[]>(value)

  const update = (next: Range[]) => {
    setRanges(next)
    onChange?.(next)
  }

  const handleChange = (index: number, key: keyof Range, val: string) => {
    const num = Number(val)
    const next = ranges.map((r, i) => (i === index ? {...r, [key]: num} : r))
    update(next)
  }

  const handleAdd = () => {
    const last = ranges.at(-1)
    update([
      ...ranges,
      {
        min: last ? last.max + 1 : 0,
        max: last ? last.max + 10 : 10,
      },
    ])
  }

  const handleRemove = (index: number) => {
    update(ranges.filter((_, i) => i !== index))
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: t.vars.palette.divider,
        borderRadius: styleUtils(t).color.input.default.borderRadius,
      }}
    >
      <Label sx={{p: 1}}>{m._dashboard.ranges}</Label>
      <Table
        size="small"
        sx={{
          '&:last-child td, &:last-child th': {border: 0},
        }}
      >
        <TableBody>
          {ranges.map((range, i) => {
            return (
              <TableRow key={i}>
                <TableCell align="right">
                  <TextField
                    type="number"
                    size="small"
                    slotProps={{htmlInput: {min: i > 0 ? ranges[i - 1].max + 1 : undefined}}}
                    variant="standard"
                    value={range.min}
                    onChange={e => handleChange(i, 'min', e.target.value)}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    size="small"
                    variant="standard"
                    value={range.max}
                    slotProps={{htmlInput: {min: range.min + 1}}}
                    onChange={e => handleChange(i, 'max', e.target.value)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Core.IconBtn size="small" color="error" onClick={() => handleRemove(i)}>
                    delete
                  </Core.IconBtn>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Core.Btn size="small" icon="add" onClick={handleAdd} sx={{my: 0.5, ml: 0.5}}>
        {m._dashboard.addRange}
      </Core.Btn>
    </Box>
  )
}
