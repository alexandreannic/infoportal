import {useI18n} from '@/core/i18n/index.js'
import React, {ReactNode, useEffect, useState} from 'react'
import {Alert, Box, Icon, MenuItem, Popover, PopoverProps} from '@mui/material'
import {PanelBody, PanelHead} from '../../../../../infoportal-client-core/src/Panel/index.js'
import {IpBtn, IpIconBtn, Txt} from '@/shared/index.js'
import {IpInput} from '../../../../../infoportal-client-core/src/Input/Input.js'
import {PeriodPicker} from '../../../../../infoportal-client-core/src/PeriodPicker/PeriodPicker.js'
import {endOfDay} from 'date-fns'
import {PanelFoot} from '../../../../../infoportal-client-core/src/Panel/PanelFoot.js'
import {
  DatatableFilterDialogNumber,
  DatatableFilterDialogSelect,
  DatatableFilterDialogText,
} from '@/shared/Datatable/popover/DatatableFilterModal.js'
import {Datatable} from '@/shared/Datatable3/state/types.js'
import {useDatatable3Context} from '@/shared/Datatable3/state/DatatableContext.js'
import {OrderBy} from '@axanc/react-hooks'
import {DatatableFilterTypeMapping, DatatableOptions, DatatableRow} from '@/shared/Datatable/util/datatableType.js'
import {Core} from '@/shared'

export type DatatableFilterDialogProps = Pick<PopoverProps, 'anchorEl'> & {
  sortBy?: Datatable.SortBy
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
          <Core.IconBtn
            children="filter_alt_off"
            color={filterActive ? 'primary' : undefined}
            onClick={() => {
              onClear?.()
              setInnerValue(undefined)
            }}
          />
        }
      >
        <Core.Txt block truncate>
          {title}
        </Core.Txt>
      </PanelHead>
      <PanelBody sx={{maxWidth: 500}}>
        <Box
          sx={{display: 'flex', alignItems: 'center', borderBottom: t => `1px solid ${t.vars.palette.divider}`, mb: 1}}
        >
          <Core.Txt color="hint" sx={{flex: 1}}>
            {m.sort}
          </Core.Txt>
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
                    <Core.Input
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
        <Core.Btn color="primary" onClick={onClose}>
          {m.close}
        </CoreBtn>
        <Core.Btn color="primary" onClick={() => onChange && onChange(columnId, innerValue)}>
          {m.filter}
        </CoreBtn>
      </PanelFoot>
    </Popover>
  )
}
