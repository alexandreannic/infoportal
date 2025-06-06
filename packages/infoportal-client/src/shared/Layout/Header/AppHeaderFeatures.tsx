import {IpIconBtn, IpIconBtnProps} from '@/shared/IconBtn'
import React from 'react'
import {useSession} from '@/core/Session/SessionContext'
import {Box, Popover, useTheme} from '@mui/material'

const iconSize = 94

export const AppHeaderFeatures = (props: Omit<IpIconBtnProps, 'children'>) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = !!anchorEl
  const t = useTheme()
  return (
    <>
      <IpIconBtn children="apps" onClick={e => setAnchorEl(e.currentTarget)} {...props} />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={open}
      >
        <Box sx={{width: (iconSize + 8) * 4 + 16, p: 0.5, pb: 0}}></Box>

        {/*<Box sx={{width: (iconSize + 8) * 3, p: .5}}>*/}
        {/*  {features.map(_ =>*/}
        {/*    <FeatureLogo iconSize={40} key={_.id} feature={_} sx={{*/}
        {/*      display: 'inline-block',*/}
        {/*      height: iconSize,*/}
        {/*      width: iconSize,*/}
        {/*      maxWidth: iconSize,*/}
        {/*      margin: .25,*/}
        {/*      py: 1,*/}
        {/*      px: .5,*/}
        {/*    }}/>*/}
        {/*  )}*/}
        {/*</Box>*/}
      </Popover>
    </>
  )
}
