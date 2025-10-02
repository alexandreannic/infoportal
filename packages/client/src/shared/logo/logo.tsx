import {Box, BoxProps, useColorScheme} from '@mui/material'
import React from 'react'

export const IpLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  const {mode} = useColorScheme()
  return (
    <Box
      component="img"
      src={mode === 'dark' ? '/ip-logo-light.svg' : '/ip-logo.svg'}
      height={height}
      alt="InfoPortal Logo"
      {...props}
    />
  )
}
