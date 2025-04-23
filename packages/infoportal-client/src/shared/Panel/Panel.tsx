import * as React from 'react'
import {forwardRef, ReactNode} from 'react'
import {Box, Card, CardProps, LinearProgress} from '@mui/material'
import {PanelHead} from './PanelHead'
import {PanelFeatures} from '@/shared/Panel/PanelFeatures'

export interface PanelProps extends Omit<CardProps, 'title'> {
  loading?: boolean
  hoverable?: boolean
  stretch?: boolean
  elevation?: number
  title?: ReactNode
  expendable?: boolean
  savableAsImg?: boolean
}

export const Panel = forwardRef(
  (
    {elevation, hoverable, loading, children, stretch, sx, title, expendable, savableAsImg, ...other}: PanelProps,
    ref: any,
  ) => {
    return (
      <Card
        ref={ref}
        elevation={elevation}
        sx={{
          position: 'relative',
          background: (t) => t.palette.background.paper,
          borderRadius: (t) => t.shape.borderRadius + 'px',
          mb: 2,
          ...(hoverable && {
            cursor: 'pointer',
            transition: (t) => t.transitions.create('all'),
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: (t) => t.shadows[4],
            },
          }),
          ...(stretch && {
            display: 'flex',
            flexDirection: 'column',
            height: (t) => `calc(100% - ${t.spacing(2)})`,
          }),
          ...(elevation &&
            elevation > 0 && {
              border: 'none',
            }),
          '&:hover .panel-actions': {
            display: 'block',
          },
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
        {expendable || savableAsImg ? (
          <PanelFeatures expendable={expendable} savableAsImg={savableAsImg}>
            {children}
          </PanelFeatures>
        ) : (
          children
        )}
      </Card>
    )
  },
)
