import {Box, Icon, Popover, Switch, useTheme} from '@mui/material'
import {Btn, lightenVar, Txt} from '@infoportal/client-core'
import React, {useEffect, useMemo, useState} from 'react'
import {useCtx} from '../core/DatatableContext'
import {useConfig} from '../DatatableConfig'

const dangerThreshold = 200

export const PopupSelectedCell = () => {
  const {engine, selectedCount, areAllColumnsSelected, selectedColumnsIds, selectedRowIds, selectedColumnUniq} = useCtx(
    _ => _.cellSelection,
  )
  const renderComponentOnRowSelected = useCtx(_ => _.module?.cellSelection?.renderComponentOnRowSelected)
  const {formatLargeNumber} = useConfig()
  const rowIds = useMemo(() => [...selectedRowIds], [selectedRowIds])

  if (selectedColumnUniq?.actionOnSelected === 'none') return
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
      <Box sx={{p: 1, maxWidth: 470}}>
        {selectedColumnUniq && (
          <Txt block size="big" bold>
            {selectedColumnUniq.head}
          </Txt>
        )}
        <Txt color="disabled" fontWeight="400" sx={{mb: 1, display: 'flex', alignItems: 'center'}}>
          <Icon fontSize="inherit">view_column</Icon>
          {formatLargeNumber(selectedColumnsIds.size)}
          <Box sx={{mx: 0.5}}>×</Box>
          <Icon fontSize="inherit">table_rows</Icon>
          {formatLargeNumber(selectedRowIds.size)}
          <Box sx={{mx: 0.5}}>=</Box>
          <Txt bold color={selectedCount > dangerThreshold ? 'error' : undefined}>
            {formatLargeNumber(selectedCount)}
          </Txt>
        </Txt>
        <Box sx={{display: 'flex', mb: 1}}>
          <Btn size="small" variant="outlined" onClick={engine.reset} color="primary" sx={{mr: 1, minWidth: 0}}>
            <Icon>clear</Icon>
          </Btn>
          <BtnCopyCells/>
        </Box>

        {selectedColumnUniq &&
          selectedColumnUniq.actionOnSelected &&
          React.cloneElement(selectedColumnUniq.actionOnSelected?.({rowIds}), {key: rowIds.join(',')})}
        {areAllColumnsSelected && renderComponentOnRowSelected && renderComponentOnRowSelected({rowIds})}
      </Box>
    </Popover>
  )
}

const BtnCopyCells = () => {
  const {m, formatLargeNumber} = useConfig()
  const t = useTheme()
  const getRowKey = useCtx(_ => _.getRowKey)
  const dataFilteredAndSorted = useCtx(_ => _.dataFilteredAndSorted)
  const cellSelection = useCtx(_ => _.cellSelection)
  const colsIndex = useCtx(_ => _.columns.indexMap)
  const [copiedCounter, setCopiedCounter] = useState(0)
  const [copyWithColName, setCopyWithColName] = useState(false)

  useEffect(() => {
    setCopiedCounter(0)
  }, [cellSelection.engine.isSelected])

  const buildClipboard = (): string => {
    const cols = [...cellSelection.selectedColumnsIds].map(colId => colsIndex[colId])
    const body = dataFilteredAndSorted
      .filter(_ => cellSelection.selectedRowIds.has(getRowKey(_)))
      .map(row => {
        return cols
          .map(c => c.render(row).export)
          .map(escapeTsv)
          .join('\t')
      })
      .join('\n')
    if (copyWithColName) {
      return (
        cols
          .map(_ => _.head)
          .map(escapeTsv)
          .join('\t') +
        '\n' +
        body
      )
    }
    return body
  }

  const animate = (target: number) => {
    const speed = 300
    let start: number | null = null

    const increment = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = timestamp - start
      const newValue = Math.min(Math.floor((progress / speed) * target), target)
      setCopiedCounter(newValue)

      if (newValue < target) {
        requestAnimationFrame(increment)
      }
    }
    requestAnimationFrame(increment)
  }

  const copy = async () => {
    const content = buildClipboard()
    await navigator.clipboard.writeText(content)
    animate(cellSelection.selectedCount + (copyWithColName ? cellSelection.selectedColumnsIds.size : 0))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selection = window.getSelection()
      const isSomethingSelected = !selection || selection.toString().trim() === ''
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && isSomethingSelected && cellSelection.selectedCount > 0) {
        e.preventDefault()
        copy()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cellSelection.engine.isSelected])

  return (
    <>
      <Btn size="small" variant="outlined" onClick={copy} sx={{minWidth: 0}}>
        <Icon>content_copy</Icon>
        <Txt textTransform="none" fontWeight="400" color="hint" sx={{ml: 1}}>
          {m.includeColumns}
        </Txt>
        <Switch
          size="small"
          value={copyWithColName}
          onClick={e => {
            e.stopPropagation()
          }}
          onChange={(e, checked) => {
            setCopyWithColName(checked)
          }}
        />{' '}
      </Btn>
      <Txt
        noWrap
        sx={{
          opacity: copiedCounter > 0 ? 1 : 0,
          transform: t.transitions.create('opacity'),
          py: 0.5,
          px: 1,
          ml: 1,
          borderRadius: t.vars.shape.borderRadius,
          // backdropFilter: 'blur(4px)',
          backgroundColor: lightenVar(t.vars.palette.success.light, 0.8),
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon sx={{mr: 1}} color="success" fontSize="small">
          check_circle
        </Icon>
        <span style={{color: t.vars.palette.success.main, fontWeight: t.typography.fontWeightBold}}>
          {formatLargeNumber(copiedCounter)} {m.copied.toLowerCase()}!
        </span>
      </Txt>
    </>
  )
}

function escapeTsv(value: unknown) {
  if (value == null) return ''
  const str = String(value)
  if (/[\t\n\r"]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}
