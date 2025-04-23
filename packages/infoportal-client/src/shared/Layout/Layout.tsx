import * as React from 'react'
import {ReactElement, ReactNode} from 'react'
import {LayoutProvider, useLayoutContext} from './LayoutContext'
import {Box, LinearProgress} from '@mui/material'
import {layoutConfig} from './index'
import {defaultSpacing} from '../../core/theme'
import {AppHeader} from './Header/AppHeader'

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
  header = <AppHeader id="app-header" />,
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
  const {sidebarOpen, sidebarPinned, isMobileWidth} = useLayoutContext()
  return (
    <>
      {header}
      {sidebar}
      <Box
        component="main"
        sx={{
          transition: (t) => t.transitions.create('all'),
          paddingLeft:
            (sidebar && sidebarOpen && sidebarPinned && !isMobileWidth
              ? layoutConfig.sidebarWith + defaultSpacing
              : 0) + 'px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </>
  )
}
