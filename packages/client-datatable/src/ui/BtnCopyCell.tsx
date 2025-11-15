import {Icon, Switch, Tooltip, useTheme} from '@mui/material'
import {alphaVar, Btn, lightenVar, Txt} from '@infoportal/client-core'
import React, {useEffect, useState} from 'react'
import {useCtx} from '../core/DatatableContext'
import {useConfig} from '../DatatableConfig'

export const BtnCopyCells = () => {
  const {m, formatLargeNumber} = useConfig()
  const t = useTheme()
  const getRowKey = useCtx(_ => _.getRowKey)
  const dataFilteredAndSorted = useCtx(_ => _.dataFilteredAndSorted)
  const selectedColumnIds = useCtx(_ => _.state.selectedColumnIds)
  const selectedRowIds = useCtx(_ => _.state.selectedRowIds)
  const selectedCount = useCtx(_ => _.cellSelection.selectedCount)
  const colsIndex = useCtx(_ => _.columns.indexMap)
  const [copiedCounter, setCopiedCounter] = useState(0)
  const [copyWithColName, setCopyWithColName] = useState(false)

  useEffect(() => {
    setCopiedCounter(0)
  }, [selectedColumnIds, selectedRowIds])

  const buildClipboard = (): string => {
    const cols = selectedColumnIds ? [...selectedColumnIds].map(colId => colsIndex[colId]) : []
    const body = dataFilteredAndSorted
      .filter(_ => selectedRowIds?.has(getRowKey(_)))
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
    animate(selectedCount + (copyWithColName && selectedColumnIds ? selectedColumnIds.size : 0))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selection = window.getSelection()
      const isSomethingSelected = !selection || selection.toString().trim() === ''
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && isSomethingSelected && selectedCount > 0) {
        e.preventDefault()
        copy()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedColumnIds, selectedRowIds])

  return (
    <Tooltip
      slotProps={{
        popper: {
          sx: {
            background: 'none',
          },
        },
        tooltip: {
          sx: {
            py: 1,
            px: 2,
            backdropFilter: 'blur(4px)',
            backgroundColor: alphaVar(lightenVar(t.vars.palette.success.light, 0.6), 0.6),
            boxShadow: t.vars.shadows[2],
          },
        },
      }}
      sx={{}}
      title={
        copiedCounter > 0 && (
          <Txt
            noWrap
            sx={{
              // opacity: copiedCounter > 0 ? 1 : 0,
              transform: t.transitions.create('opacity'),
              // py: 0.5,
              // px: 1,
              // ml: 1,
              // borderRadius: t.vars.shape.borderRadius,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon sx={{mr: 1}} color="success" fontSize="small">
              check_circle
            </Icon>
            <span
              style={{
                color: t.vars.palette.success.main,
                fontWeight: t.typography.fontWeightBold,
              }}
            >
              {formatLargeNumber(copiedCounter)} {m.copied.toLowerCase()}!
            </span>
          </Txt>
        )
      }
    >
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
    </Tooltip>
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