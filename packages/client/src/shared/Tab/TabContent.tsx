import {Box, BoxProps} from '@mui/material'
import * as React from 'react'
import {PagePlaceholder, PageProps, usePageAnimation, usePageWidthStyle,} from '@/shared/index.js'

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
      sx={{...widthStyle, ...animationStyle, minHeight: 0, flex: 1, mt: 1, ...sx}}
      {...props}
      children={loading ? <PagePlaceholder /> : children}
    />
  )
}
