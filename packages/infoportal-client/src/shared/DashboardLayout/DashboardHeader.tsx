import {alpha, Box, BoxProps, Typography, useTheme} from '@mui/material'
import {IpLogo} from '@/shared/logo/logo'
import React, {ReactNode} from 'react'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {AppHeaderContainer} from '@/core/layout/AppHeaderContainer'
import {IpIconBtn} from '../../../../infoportal-client-core/src/IconBtn.js'
import {alphaVar} from '@/core/theme.js'

export const DashboardHeader = ({
  title,
  subTitle,
  action,
  header,
  id,
  ...props
}: Omit<BoxProps, 'title'> & {
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
        sx={{
          transition: t => t.transitions.create('all'),
          pl: 2,
          zIndex: 2,
          background: t => t.vars.palette.background.default,
          pt: 2,
          width: '100%',
        }}
        {...props}
      >
        <Box className="header_content">
          <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
            {showSidebarButton && (
              <IpIconBtn
                size="small"
                sx={{
                  alignSelf: 'start',
                  mr: 2,
                  border: `2px solid ${t.vars.palette.primary.main}`,
                  background: sidebarOpen ? 'none' : alphaVar(t.vars.palette.primary.main, 0.1),
                  color: t.vars.palette.primary.main,
                  '&:hover': {
                    background: alphaVar(t.vars.palette.primary.main, 0.1),
                  },
                }}
                onClick={() => setSidebarOpen(_ => !_)}
                children="menu"
              />
            )}
            <Box className="header_title" sx={{mb: 1, flex: 1, whiteSpace: 'nowrap'}}>
              <Box sx={{display: 'flex', alignItems: 'center', mr: 2}}>
                <Typography className="header_title_main" variant="h1" sx={{flex: 1}}>
                  {title}
                </Typography>
                <Box sx={{ml: 'auto', mr: 2}}>{action}</Box>
                <IpLogo height={24} />
              </Box>
              <Typography className="header_title_sub" variant="subtitle1" sx={{color: t.vars.palette.text.secondary}}>
                {subTitle}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <AppHeaderContainer id={id}>{header}</AppHeaderContainer>
    </>
  )
}
