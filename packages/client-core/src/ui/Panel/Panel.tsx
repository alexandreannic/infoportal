import * as React from 'react'
import {forwardRef, ReactNode} from 'react'
import {Box, Card, CardProps, LinearProgress, useTheme} from '@mui/material'
import {PanelHead} from './PanelHead.js'
import {PanelOutsideTitle} from './PanelOutsideTitle.js'
export interface PanelProps extends Omit<CardProps, 'title'> {
  loading?: boolean
  hoverable?: boolean
  stretch?: boolean
  elevation?: number
  title?: ReactNode
  outsideTitle?: ReactNode
}

export const Panel = forwardRef(
  ({elevation, outsideTitle, hoverable, loading, children, stretch, sx, title, ...other}: PanelProps, ref: any) => {
    const t = useTheme()
    const content = (
      <Card
        ref={ref}
        elevation={elevation}
        sx={{
          position: 'relative',
          background: t.vars.palette.background.paper,
          borderRadius: t.vars.shape.borderRadius,
          mb: 1,
          ...(hoverable && {
            cursor: 'pointer',
            transition: t.transitions.create('all'),
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: t.vars.shadows[4],
            },
          }),
          ...(stretch && {
            display: 'flex',
            flexDirection: 'column',
            height: `calc(100% - calc(${t.vars.spacing} * 2))`,
          }),
          ...sx,
        }}
        {...other}
      >
        {title && (
          <PanelHead>
            <Box sx={{display: 'flex', alignItems: 'center'}}>{title}</Box>
          </PanelHead>
        )}
        {loading && <LinearProgress sx={{mb: '-4px'}} />}
        {children}
      </Card>
    )
    if (outsideTitle)
      return (
        <>
          <PanelOutsideTitle>{outsideTitle}</PanelOutsideTitle>
          {content}
        </>
      )
    return content
  },
)
