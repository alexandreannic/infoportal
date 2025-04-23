import {alpha, Box, BoxProps, GlobalStyles, Typography, useTheme} from '@mui/material'
import {DRCLogo, EULogo} from '@/shared/logo/logo'
import React, {ReactNode} from 'react'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {AppHeaderContainer} from '@/shared/Layout/Header/AppHeaderContainer'
import {IpIconBtn} from '@/shared/IconBtn'

export const DashboardHeader = ({
  title,
  subTitle,
  action,
  hideEuLogo,
  header,
  id,
  ...props
}: Omit<BoxProps, 'title'> & {
  hideEuLogo?: boolean
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
          transition: (t) => t.transitions.create('all'),
          pl: 2,
          zIndex: 2,
          background: (t) => t.palette.background.default,
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
                  border: `2px solid ${t.palette.primary.main}`,
                  background: sidebarOpen ? 'none' : alpha(t.palette.primary.main, 0.1),
                  color: t.palette.primary.main,
                  '&:hover': {
                    background: alpha(t.palette.primary.main, 0.1),
                  },
                }}
                onClick={() => setSidebarOpen((_) => !_)}
                children="menu"
              />
            )}
            <Box className="header_title" sx={{mb: 1, flex: 1, whiteSpace: 'nowrap'}}>
              <Box sx={{display: 'flex', alignItems: 'center', mr: 2}}>
                <Typography className="header_title_main" variant="h1" sx={{flex: 1}}>
                  {title}
                </Typography>
                <Box sx={{ml: 'auto', mr: 2}}>{action}</Box>
                {!hideEuLogo && <EULogo height={26} sx={{mr: 1}} />}
                <DRCLogo height={24} />
              </Box>
              <Typography className="header_title_sub" variant="subtitle1" sx={{color: t.palette.text.secondary}}>
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
