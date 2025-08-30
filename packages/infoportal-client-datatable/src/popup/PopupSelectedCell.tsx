import {DatatableContext, useDatatableContext} from '@/core/DatatableContext'
import {useConfig} from '@/DatatableConfig'
import {Box, Icon, Popover} from '@mui/material'
import {Btn, Txt} from '@infoportal/client-core'
import React from 'react'

export const PopupSelectedCell = () => {
  const {engine, selectedCount, areAllColumnsSelected, selectedColumnsIds, selectedRowIds, selectedColumnUniq} =
    useDatatableContext(_ => _.cellSelection)
  const renderComponentOnRowSelected = useDatatableContext(_ => _.module?.cellSelection?.renderComponentOnRowSelected)
  const {formatLargeNumber} = useConfig()

  const rowIds = [...selectedRowIds]
  return (
    <Popover
      onClose={engine.reset}
      open={!!engine.anchorEl && selectedCount > 0}
      anchorEl={engine.anchorEl}
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

        <Btn variant="outlined" icon="clear" onClick={engine.reset} color="primary" sx={{mb: 1}}>
          {formatLargeNumber(selectedCount)}
          <Txt color="hint" fontWeight="400" sx={{ml: 2, display: 'flex', alignItems: 'center'}}>
            <Icon fontSize="inherit">view_column</Icon>
            {formatLargeNumber(selectedColumnsIds.size)}
            <Box sx={{mx: 0.5}}>×</Box>
            <Icon fontSize="inherit">table_rows</Icon>
            {formatLargeNumber(selectedRowIds.size)}
          </Txt>
        </Btn>

        <Txt block color="hint"></Txt>
        {selectedColumnUniq && (
          <Box sx={{mt: 1}}>
            <Txt block bold sx={{mb: 1}}>
              {selectedColumnUniq.head}
            </Txt>
            {selectedColumnUniq.actionOnSelected?.({rowIds})}
          </Box>
        )}
        {areAllColumnsSelected && renderComponentOnRowSelected && renderComponentOnRowSelected({rowIds})}
      </Box>
    </Popover>
  )
}
