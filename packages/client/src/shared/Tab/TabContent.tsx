import {Box, BoxProps} from '@mui/material'
import * as React from 'react'
import {PagePlaceholder, PageProps, usePageAnimation, usePageWidthStyle} from '@/shared/index.js'

export const TabContent = ({
  sx,
  // animation = 'default',
  animationDeps = [],
  className,
  children,
  loading,
  ...props
}: BoxProps & {
  loading?: boolean
  animationDeps?: PageProps['animationDeps']
  // animation: PageProps['animation']
  width?: PageProps['width']
}) => {
  const animationStyle = usePageAnimation({animation: 'translateLeft', animationDeps})
  const widthStyle = usePageWidthStyle({width: props.width})

  return (
    <Box
      className={'IpTabContent ' + (className ?? '')}
      sx={{
        ...animationStyle,
        // overflowY: 'scroll', // I removed this so WidgetSettingsPanel can be sticky
        flex: 1,
        minHeight: 0,
        mt: .25,
        pt: .75,
      }}
    >
      <Box sx={{...widthStyle, ...sx}} {...props} children={loading ? <PagePlaceholder /> : children} />
    </Box>
  )
}
