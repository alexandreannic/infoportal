import {
  Alert,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Icon,
  MenuItem,
  Popover,
  PopoverProps,
  Slider,
  Switch,
} from '@mui/material'
import {IpBtn, IpIconBtn, MultipleChoices} from '@/shared'
import {useI18n} from '@/core/i18n'
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState} from 'react'
import {IpInput} from '../../Input/Input'
import {PeriodPicker} from '../../PeriodPicker/PeriodPicker'
import {Txt} from '@/shared/Txt'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {PanelBody, PanelHead} from '@/shared/Panel'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {DatatableFilterTypeMapping, DatatableOptions, DatatableRow} from '@/shared/Datatable/util/datatableType'
import {type} from 'os'
import {seq} from '@axanc/ts-utils'
import {useDatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {endOfDay} from 'date-fns'

export type DatatableFilterDialogProps = Pick<PopoverProps, 'anchorEl'> & {
  orderBy?: OrderBy
  sortBy?: string
  onOrderByChange?: (_?: OrderBy) => void
  onClose?: () => void
  onClear?: () => void
  columnId: string
  filterActive?: boolean
  title: ReactNode
  data: DatatableRow[]
  options?: DatatableOptions[]
} & (
    | {
        renderValue: any
        onChange?: (columnName: string, value: DatatableFilterTypeMapping['number']) => void
        value: DatatableFilterTypeMapping['number']
        type: 'number'
      }
    | {
        renderValue: any
        onChange?: (columnName: string, value: DatatableFilterTypeMapping['date']) => void
        value: DatatableFilterTypeMapping['date']
        type: 'date'
      }
    | {
        renderValue: any
        onChange?: (columnName: string, value: DatatableFilterTypeMapping['select_multiple']) => void
        value: DatatableFilterTypeMapping['select_multiple']
        type: 'select_one' | 'select_multiple'
      }
    | {
        renderValue: any
        onChange?: (columnName: string, value: DatatableFilterTypeMapping['string']) => void
        value: DatatableFilterTypeMapping['string']
        type: 'string' | 'id'
      }
  )

export const DatatableFilterModal = ({
  data,
  orderBy,
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
}: DatatableFilterDialogProps) => {
  const {m} = useI18n()
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
          <IpIconBtn
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
        <Box sx={{display: 'flex', alignItems: 'center', borderBottom: (t) => `1px solid ${t.palette.divider}`, mb: 1}}>
          <Txt color="hint" sx={{flex: 1}}>
            {m.sort}
          </Txt>
          <MenuItem onClick={() => onOrderByChange?.(orderBy === 'desc' ? undefined : 'desc')}>
            <Icon
              fontSize="small"
              color={sortBy === columnId && orderBy === 'desc' ? 'primary' : undefined}
              children="south"
            />
          </MenuItem>
          <MenuItem onClick={() => onOrderByChange?.(orderBy === 'asc' ? undefined : 'asc')}>
            <Icon
              fontSize="small"
              color={sortBy === columnId && orderBy === 'asc' ? 'primary' : undefined}
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
                      {m._datatable.idFilterInfo}
                    </Alert>
                    <IpInput
                      value={innerValue}
                      onChange={(e) => setInnerValue(e.target.value)}
                      placeholder={m._datatable.idFilterPlaceholder}
                    />
                  </>
                )
              }
              case 'date':
                return (
                  <PeriodPicker
                    value={innerValue}
                    onChange={(_) => {
                      if (_[1]) _[1] = endOfDay(_[1])
                      setInnerValue(_)
                    }}
                  />
                )
              case 'select_one':
              case 'select_multiple':
                return <DatatableFilterDialogSelect options={options} value={innerValue} onChange={setInnerValue} />
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
                return <DatatableFilterDialogText value={innerValue} onChange={setInnerValue} />
            }
          })()}
      </PanelBody>
      <PanelFoot alignEnd>
        <IpBtn color="primary" onClick={onClose}>
          {m.close}
        </IpBtn>
        <IpBtn color="primary" onClick={() => onChange && onChange(columnId, innerValue)}>
          {m.filter}
        </IpBtn>
      </PanelFoot>
    </Popover>
  )
}

export const DatatableFilterDialogSelect = ({
  value,
  onChange,
  options,
}: {
  value: DatatableFilterTypeMapping['string']
  onChange: Dispatch<SetStateAction<DatatableFilterTypeMapping['select_multiple']>>
  options?: DatatableOptions[]
}) => {
  const {m} = useI18n()
  const [filter, setFilter] = useState<string>('')
  return (
    <MultipleChoices
      options={
        options?.filter(
          (_) =>
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
            sx={{display: 'block', fontWeight: (t) => t.typography.fontWeightBold}}
            onClick={toggleAll}
            control={<Checkbox size="small" checked={allChecked} indeterminate={!allChecked && someChecked} />}
            label={m.selectAll}
          />
          <IpInput
            label={m.filterPlaceholder}
            helperText={null}
            sx={{mb: 1}}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Divider />
          <Box sx={{maxHeight: 350, overflowY: 'auto'}}>
            {options.map((o) => (
              <FormControlLabel
                title={'' + o.label}
                sx={{display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                key={o.key}
                control={<Checkbox size="small" name={o.value} checked={o.checked} onChange={o.onChange} />}
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
  value: DatatableFilterTypeMapping['string']
  onChange: Dispatch<SetStateAction<DatatableFilterTypeMapping['string']>>
}) => {
  const {m} = useI18n()
  return (
    <>
      <FormControlLabel
        sx={{mb: 1}}
        label={m.filterBlanks}
        value={value?.filterBlank}
        control={
          <Switch
            checked={value?.filterBlank}
            onChange={(e) => onChange((prev) => ({...prev, filterBlank: e.target.checked}))}
          />
        }
      />
      <IpInput value={value?.value} onChange={(e) => onChange((prev) => ({...prev, value: e.target.value}))} />
    </>
  )
}

export const DatatableFilterDialogNumber = ({
  value,
  data,
  columnId,
  onChange,
}: Pick<DatatableFilterDialogProps, 'data' | 'columnId'> & {
  value: DatatableFilterTypeMapping['number']
  onChange: Dispatch<SetStateAction<DatatableFilterTypeMapping['number']>>
}) => {
  const ctx = useDatatableContext()
  const col = ctx.columnsIndex[columnId]
  if (!col.type) return
  const {min, max} = useMemo(() => {
    const values = seq(data)
      .map((_) => col.render(_).value as number | undefined)
      .compact()
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }, [type, data])

  const mappedValue = [value?.[0] ?? min, value?.[1] ?? max]

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <>
      <Slider min={min} max={max} value={mappedValue} onChange={(e, _) => onChange(_ as [number, number])} />
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <IpInput
          type="number"
          sx={{minWidth: 60, mr: 0.5}}
          value={mappedValue[0]}
          onChange={(e) => onChange((prev) => [+e.target.value, prev?.[1]])}
        />
        <IpInput
          type="number"
          sx={{minWidth: 60, ml: 0.5}}
          value={mappedValue[1]}
          onChange={(e) => onChange((prev) => [prev?.[0], +e.target.value])}
        />
      </Box>
    </>
  )
}
