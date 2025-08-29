import {DatatableContext, useDatatableContext} from '@/core/DatatableContext'
import {useConfig} from '@/DatatableConfig'
import {Box, Icon, Popover} from '@mui/material'
import {Btn, Txt} from '@infoportal/client-core'
import React from 'react'

export const PopupSelectedCell = () => {
  const cellSelection = useDatatableContext(_ => _.cellSelection)
  const renderComponentOnRowSelected = useDatatableContext(_ => _.module?.cellSelection?.renderComponentOnRowSelected)
  const {formatLargeNumber} = useConfig()
  return (
    <Popover
      onClose={cellSelection.engine.reset}
      open={!!cellSelection.engine.anchorEl && cellSelection.selectedCount > 0}
      anchorEl={cellSelection.engine.anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        root: {
          disableEnforceFocus: true,
          disableAutoFocus: true,
          disableRestoreFocus: true,
          keepMounted: true,
          sx: {
            pointerEvents: 'none', // prevent root modal layer from intercepting
          },
        },
        paper: {
          sx: {
            pointerEvents: 'auto', // allow interactions inside popover
            px: 1,
            py: 0.5,
          },
        },
        backdrop: {
          sx: {
            display: 'none',
          },
        },
      }}
    >
      <Box sx={{p: 1, maxWidth: 400}}>
        <Btn variant="outlined" icon="clear" onClick={cellSelection.engine.reset} color="primary" sx={{mb: 1}}>
          {formatLargeNumber(cellSelection.selectedCount)}
          <Txt color="hint" fontWeight="400" sx={{ml: 2, display: 'flex', alignItems: 'center'}}>
            <Icon fontSize="inherit">view_column</Icon>
            {formatLargeNumber(cellSelection.selectedColumnsIds.size)}
            <Box sx={{mx: 0.5}}>×</Box>
            <Icon fontSize="inherit">table_rows</Icon>
            {formatLargeNumber(cellSelection.selectedRowIds.size)}
          </Txt>
        </Btn>
        <Txt block color="hint"></Txt>
        {cellSelection.selectedColumnUniq && (
          <>
            <Txt block bold>
              {cellSelection.selectedColumnUniq.head}
            </Txt>
          </>
        )}
        {cellSelection.areAllColumnsSelected &&
          renderComponentOnRowSelected &&
          renderComponentOnRowSelected({rowIds: [...cellSelection.selectedRowIds]})}
      </Box>
    </Popover>
  )
}
