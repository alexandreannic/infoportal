import {Box, BoxProps, Typography, useTheme} from '@mui/material'
import {IpLogo} from '@/shared/logo/logo'
import React, {ReactNode} from 'react'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {AppHeaderContainer} from '@/core/layout/AppHeaderContainer'
import {Core} from '@/shared'
import {alphaVar} from '@infoportal/client-core'
import {ToggleSidebarButton} from '@/core/layout/ToggleSidebarButton'

export const DashboardHeader = ({
  title,
  subTitle,
  action,
  header,
  subHeaderHeight,
  id,
  height,
  ...props
}: Omit<BoxProps, 'title'> & {
  height?: number
  subHeaderHeight?: number
  title: ReactNode
  subTitle: ReactNode
  action?: ReactNode
  header?: ReactNode
}) => {
  const t = useTheme()
  const {sidebarOpen, showSidebarButton, setSidebarOpen} = useLayoutContext()

  return (
    <>
      <Box
        component="header"
        sx={{
          transition: t => t.transitions.create('all'),
          pl: 1,
          zIndex: 2,
          height,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          backdropFilter: 'blur(10px)',
          background: alphaVar(t.vars.palette.background.paper, 0.1),
        }}
        {...props}
      >
        <Box className="header_content" sx={{display: 'flex', alignItems: 'center'}}>
          {showSidebarButton && <ToggleSidebarButton sx={{mr: 2}} />}
          <Box className="header_title" sx={{flex: 1, whiteSpace: 'nowrap'}}>
            <Box sx={{display: 'flex', alignItems: 'center', mr: 2}}>
              <Typography className="header_title_main" variant="h1" sx={{flex: 1}}>
                {title}
              </Typography>
              <Box sx={{ml: 'auto', mr: 2}}>{action}</Box>
            </Box>
            <Typography className="header_title_sub" variant="subtitle1" sx={{color: t.vars.palette.text.secondary}}>
              {subTitle}
            </Typography>
          </Box>
        </Box>
      </Box>
      <AppHeaderContainer id={id} sx={{height: subHeaderHeight}}>
        {header}
      </AppHeaderContainer>
    </>
  )
}
