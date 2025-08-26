import * as React from 'react'
import {forwardRef, ReactNode} from 'react'
import {Box, Card, CardProps, LinearProgress} from '@mui/material'
import {PanelHead} from './PanelHead.js'
import {PanelFeatures} from 'packages/infoportal-client-core/src/Panel/PanelFeatures.js'

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
          // border: t => `1px solid ${t.vars.palette.divider}`,
          // boxShadow: t => t.vars.shadows[1],
          // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',

          position: 'relative',
          background: t => t.vars.palette.background.paper,
          borderRadius: t => t.vars.shape.borderRadius,
          mb: 1,
          ...(hoverable && {
            cursor: 'pointer',
            transition: t => t.transitions.create('all'),
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: t => t.vars.shadows[4],
            },
          }),
          ...(stretch && {
            display: 'flex',
            flexDirection: 'column',
            height: t => `calc(100% - ${`calc(${t.vars.spacing} * 2)`})`,
          }),
          ...(elevation &&
            elevation > 0 && {
              border: 'none',
            }),
          // '&:hover .panel-actions': {
          //   display: 'block',
          // },
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
