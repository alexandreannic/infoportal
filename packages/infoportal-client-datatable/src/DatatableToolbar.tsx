import {Badge, Box, useTheme} from '@mui/material'
import {IconBtn} from '@infoportal/client-core'
import React from 'react'
import {useMemoFn} from '@axanc/react-hooks'
import {Obj} from '@axanc/ts-utils'
import {Virtualizer} from '@tanstack/virtual-core'
import {useConfig} from './DatatableConfig'
import {useCtx} from './core/DatatableContext'
import {DatatableColumnToggle} from './DatatableColumnsToggle'

export const DatatableToolbar = ({rowVirtualizer}: {rowVirtualizer: Virtualizer<HTMLDivElement, Element>}) => {
  const {m, formatLargeNumber} = useConfig()
  const t = useTheme()

  const header = useCtx(_ => _.header)
  const columns = useCtx(_ => _.columns)
  const dispatch = useCtx(_ => _.dispatch)
  const filters = useCtx(_ => _.state.filters)
  const data = useCtx(_ => _.data)
  const dataFilteredAndSorted = useCtx(_ => _.dataFilteredAndSorted)
  const filterCount = useMemoFn(filters, _ => Obj.keys(_).length)

  return (
    <Box
      sx={{
        padding: `calc(${t.vars.spacing} * 0.5)`,
        display: 'flex',
        pl: 2,
        alignItems: 'center',
        // borderBottom: `1px solid ${t.vars.palette.divider}`,
      }}
    >
      <Box sx={{flex: 1, display: 'flex', alignItems: 'center'}}>
        {typeof header === 'function'
          ? header({
            data: data ?? [],
            filteredAndSortedData: dataFilteredAndSorted ?? [],
          })
          : header}
      </Box>
      <Box sx={{marginLeft: 'auto'}}>
        <DatatableColumnToggle
          columns={columns.all}
          hiddenColumns={columns.all.map(_ => _.id).filter(_ => !columns.visible.map(_ => _.id).includes(_))}
          onChange={hiddenColumns => dispatch({type: 'SET_HIDDEN_COLUMNS', hiddenColumns})}
        />
        <Badge
          badgeContent={filterCount}
          color="primary"
          overlap="circular"
          onClick={() => {
            dispatch({type: 'FILTER_CLEAR'})
            rowVirtualizer.scrollToIndex(0)
          }}
        >
          <IconBtn children="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount}/>
        </Badge>
        {/*<Txt bold color="hint" sx={{mr: 0.5}}>*/}
        {/*  {formatLargeNumber(dataFilteredAndSorted.length)}*/}
        {/*</Txt>*/}
      </Box>
    </Box>
  )
}
