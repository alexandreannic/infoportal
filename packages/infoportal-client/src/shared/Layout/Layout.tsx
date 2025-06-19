import * as React from 'react'
import {ReactElement, ReactNode} from 'react'
import {LayoutProvider} from './LayoutContext'
import {Box, LinearProgress} from '@mui/material'

export interface LayoutProps {
  sidebar?: ReactElement<any>
  header?: ReactElement<any>
  title?: string
  children?: ReactNode
  loading?: boolean
  mobileBreakpoint?: number
  // loading?: boolean
}

export const Layout = ({
  // loading,
  sidebar,
  loading,
  header,
  title,
  mobileBreakpoint,
  children,
}: LayoutProps) => {
  return (
    <LayoutProvider title={title} mobileBreakpoint={mobileBreakpoint} showSidebarButton={!!sidebar}>
      <LayoutUsingContext sidebar={sidebar} header={header}>
        {loading && <LinearProgress />}
        {children}
      </LayoutUsingContext>
    </LayoutProvider>
  )
}

const LayoutUsingContext = ({sidebar, header, children}: Pick<LayoutProps, 'sidebar' | 'header' | 'children'>) => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', maxHeight: '100vh'}}>
      {header}
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          minHeight: 0,
        }}
      >
        {sidebar}
        <Box
          component="main"
          sx={{
            overflowY: 'scroll',
            flex: 1,
            px: 1,
            transition: t => t.transitions.create('all'),
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            marginTop: -5,
            paddingTop: 6,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
