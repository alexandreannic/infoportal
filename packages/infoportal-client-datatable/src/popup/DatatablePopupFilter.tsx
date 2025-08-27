import {useI18n} from '@/Translation.js'
import React, {ReactNode, useEffect, useState} from 'react'
import {Alert, Box, Icon, MenuItem, Popover, PopoverProps} from '@mui/material'
import {PanelBody, PanelHead} from '@infoportal/client-core'
import {Btn, IconBtn, Txt} from '@infoportal/client-core'
import {Input} from '@infoportal/client-core'
import {PeriodPicker} from '@infoportal/client-core'
import {endOfDay} from 'date-fns'
import {PanelFoot} from '@infoportal/client-core'
import {useDatatable3Context} from '@/state/DatatableContext.js'
import {OrderBy} from '@axanc/react-hooks'
import {DatatableFilterTypeMapping, DatatableOptions, Row, SortBy} from '@/state/types.js'
import {
  DatatableFilterDialogNumber,
  DatatableFilterDialogSelect,
  DatatableFilterDialogText,
} from './DatatableFilterModal'

export type DatatableFilterDialogProps = Pick<PopoverProps, 'anchorEl'> & {
  sortBy?: SortBy
  onOrderByChange?: (_?: OrderBy) => void
  onClose?: () => void
  onClear?: () => void
  columnId: string
  filterActive?: boolean
  title: ReactNode
  data: Row[]
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

export const DatatableFilterModal3 = ({
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
}: DatatableFilterDialogProps) => {
  const {m} = useI18n()
  const dispatch = useDatatable3Context(_ => _.dispatch)

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
                      {m._datatable.idFilterInfo}
                    </Alert>
                    <Input
                      value={innerValue}
                      onChange={e => setInnerValue(e.target.value)}
                      placeholder={m._datatable.idFilterPlaceholder}
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
