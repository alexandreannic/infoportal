import {Box, BoxProps} from '@mui/material'
import React from 'react'

export const IpLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/ip-logo7.svg" height={height} alt="DRC Logo" {...props} />
}
