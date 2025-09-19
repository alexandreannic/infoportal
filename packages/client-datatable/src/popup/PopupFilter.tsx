import React, {Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState} from 'react'
import {Alert, Box, Checkbox, Divider, FormControlLabel, Icon, MenuItem, Popover, PopoverProps, Slider, Switch,} from '@mui/material'
import {Btn, IconBtn, Input, MultipleChoices, PanelBody, PanelFoot, PanelHead, PeriodPicker, Txt,} from '@infoportal/client-core'
import {endOfDay} from 'date-fns'
import {OrderBy} from '@axanc/react-hooks'
import {seq} from '@axanc/ts-utils'
import {FilterTypeMapping, Option, Row, SortBy} from '../core/types'
import {useConfig} from '../DatatableConfig'
import {useCtx} from '../core/DatatableContext'

export type PopupFilterProps = Pick<PopoverProps, 'anchorEl'> & {
  sortBy?: SortBy
  onOrderByChange?: (_?: OrderBy) => void
  onClose?: () => void
  onClear?: () => void
  columnId: string
  filterActive?: boolean
  title: ReactNode
  data: Row[]
  options?: Option[]
} & (
  | {
  renderValue: any
  onChange?: (columnName: string, value: FilterTypeMapping['number']) => void
  value: FilterTypeMapping['number']
  type: 'number'
}
  | {
  renderValue: any
  onChange?: (columnName: string, value: FilterTypeMapping['date']) => void
  value: FilterTypeMapping['date']
  type: 'date'
}
  | {
  renderValue: any
  onChange?: (columnName: string, value: FilterTypeMapping['select_multiple']) => void
  value: FilterTypeMapping['select_multiple']
  type: 'select_one' | 'select_multiple'
}
  | {
  renderValue: any
  onChange?: (columnName: string, value: FilterTypeMapping['string']) => void
  value: FilterTypeMapping['string']
  type: 'string' | 'id'
}
  )

export const PopupFilter = ({
  data,
  sortBy,
  onOrderByChange,
  value,
  onChange,
  onClear,
  onClose,
  anchorEl,
  // schema,
  columnId,
  title,
  options,
  filterActive,
  type,
}: PopupFilterProps) => {
  const {m} = useConfig()

  const [innerValue, setInnerValue] = useState<any>(value)
  useEffect(() => {
    value && setInnerValue(value)
  }, [value])

  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead
        PanelTitleProps={{overflow: 'hidden'}}
        sx={{maxWidth: 500}}
        action={
          <IconBtn
            children="filter_alt_off"
            color={filterActive ? 'primary' : undefined}
            onClick={() => {
              onClear?.()
              setInnerValue(undefined)
            }}
          />
        }
      >
        <Txt block truncate>
          {title}
        </Txt>
      </PanelHead>
      <PanelBody sx={{maxWidth: 500}}>
        <Box
          sx={{display: 'flex', alignItems: 'center', borderBottom: t => `1px solid ${t.vars?.palette.divider}`, mb: 1}}
        >
          <Txt color="hint" sx={{flex: 1}}>
            {m.sort}
          </Txt>
          <MenuItem onClick={() => onOrderByChange?.(sortBy?.orderBy === 'desc' ? undefined : 'desc')}>
            <Icon
              fontSize="small"
              color={sortBy && sortBy.column === columnId && sortBy.orderBy === 'desc' ? 'primary' : undefined}
              children="south"
            />
          </MenuItem>
          <MenuItem onClick={() => onOrderByChange?.(sortBy?.orderBy === 'asc' ? undefined : 'asc')}>
            <Icon
              fontSize="small"
              color={sortBy && sortBy.column === columnId && sortBy.orderBy === 'asc' ? 'primary' : undefined}
              children="north"
            />
          </MenuItem>
        </Box>
        {type &&
          (() => {
            switch (type) {
              case 'id': {
                return (
                  <>
                    <Alert color="info" sx={{py: 0, mb: 1}}>
                      {m.idFilterInfo}
                    </Alert>
                    <Input
                      value={innerValue}
                      onChange={e => setInnerValue(e.target.value)}
                      placeholder={m.idFilterPlaceholder}
                    />
                  </>
                )
              }
              case 'date':
                return (
                  <PeriodPicker
                    value={innerValue}
                    onChange={_ => {
                      if (_[1]) _[1] = endOfDay(_[1])
                      setInnerValue(_)
                    }}
                  />
                )
              case 'select_one':
              case 'select_multiple':
                return <DatatableFilterDialogSelect options={options} value={innerValue} onChange={setInnerValue}/>
              case 'number': {
                return (
                  <DatatableFilterDialogNumber
                    data={data}
                    columnId={columnId}
                    value={innerValue}
                    onChange={setInnerValue}
                  />
                )
              }
              default:
                return <DatatableFilterDialogText value={innerValue} onChange={setInnerValue}/>
            }
          })()}
      </PanelBody>
      <PanelFoot alignEnd>
        <Btn color="primary" onClick={onClose}>
          {m.close}
        </Btn>
        <Btn color="primary" onClick={() => onChange && onChange(columnId, innerValue)}>
          {m.filter}
        </Btn>
      </PanelFoot>
    </Popover>
  )
}

export const DatatableFilterDialogSelect = ({
  value,
  onChange,
  options,
}: {
  value: FilterTypeMapping['string']
  onChange: Dispatch<SetStateAction<FilterTypeMapping['select_multiple']>>
  options?: Option[]
}) => {
  const {m} = useConfig()
  const [filter, setFilter] = useState<string>('')
  return (
    <MultipleChoices
      options={
        options?.filter(
          _ =>
            filter === '' ||
            ((typeof _.label === 'string' ? _.label : _.value).toLowerCase() ?? '').includes(filter.toLowerCase()),
        ) ?? []
      }
      value={value as any}
      onChange={onChange}
    >
      {({options, toggleAll, allChecked, someChecked}) => (
        <>
          <FormControlLabel
            sx={{display: 'block', fontWeight: t => t.typography.fontWeightBold}}
            onClick={toggleAll}
            control={<Checkbox size="small" checked={allChecked} indeterminate={!allChecked && someChecked}/>}
            label={m.selectAll}
          />
          <Input label={m.filterPlaceholder} helperText={null} sx={{mb: 1}} onChange={e => setFilter(e.target.value)}/>
          <Divider/>
          <Box sx={{maxHeight: 350, overflowY: 'auto'}}>
            {options.map(o => (
              <FormControlLabel
                title={'' + o.label}
                sx={{display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                key={o.key}
                control={<Checkbox size="small" name={o.value} checked={o.checked} onChange={o.onChange}/>}
                label={o.label}
              />
            ))}
          </Box>
        </>
      )}
    </MultipleChoices>
  )
}

export const DatatableFilterDialogText = ({
  value,
  onChange,
}: {
  value: FilterTypeMapping['string']
  onChange: Dispatch<SetStateAction<FilterTypeMapping['string']>>
}) => {
  const {m} = useConfig()
  return (
    <>
      <FormControlLabel
        sx={{mb: 1}}
        label={m.filterBlanks}
        value={value?.filterBlank}
        control={
          <Switch
            checked={value?.filterBlank}
            onChange={e => onChange(prev => ({...prev, filterBlank: e.target.checked}))}
          />
        }
      />
      <Input value={value?.value} onChange={e => onChange(prev => ({...prev, value: e.target.value}))}/>
    </>
  )
}

export const DatatableFilterDialogNumber = ({
  value,
  data,
  columnId,
  onChange,
}: Pick<PopupFilterProps, 'data' | 'columnId'> & {
  value: FilterTypeMapping['number']
  onChange: Dispatch<SetStateAction<FilterTypeMapping['number']>>
}) => {
  const columnsIndex = useCtx(_ => _.columns.indexMap)
  const col = columnsIndex[columnId]
  if (!col.type) return
  const {min, max} = useMemo(() => {
    const values = seq(data)
      .map(_ => col.render(_).value as number | undefined)
      .compact()
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }, [col.type, data])

  const mappedValue = [value?.[0] ?? min, value?.[1] ?? max]

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <>
      <Slider min={min} max={max} value={mappedValue} onChange={(e, _) => onChange(_ as [number, number])}/>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Input
          type="number"
          sx={{minWidth: 60, mr: 0.5}}
          value={mappedValue[0]}
          onChange={e => onChange(prev => [+e.target.value, prev?.[1]])}
        />
        <Input
          type="number"
          sx={{minWidth: 60, ml: 0.5}}
          value={mappedValue[1]}
          onChange={e => onChange(prev => [prev?.[0], +e.target.value])}
        />
      </Box>
    </>
  )
}
