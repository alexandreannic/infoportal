import {Box, BoxProps} from '@mui/material'
import React from 'react'

export const IpLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/ip-logo9.svg" height={height} alt="InfoPortal Logo" {...props} />
}
