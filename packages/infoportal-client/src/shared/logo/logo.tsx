import {Box, BoxProps, useTheme} from '@mui/material'
import React from 'react'

export const EULogo = ({
  height = 28,
  sx,
  ...props
}: {
  height?: number
} & BoxProps) => {
  const theme = useTheme()
  return (
    <>
      <Box
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'none',
          },
          ...sx,
        }}
        component="img"
        src="/static/eu.png"
        height={height}
        alt="EU Logo"
        {...props}
      />
      <Box
        component="img"
        sx={{
          [theme.breakpoints.up('sm')]: {
            display: 'none',
          },
          ...sx,
        }}
        src="/static/eu-mobile.png"
        height={height}
        alt="EU Logo"
        {...props}
      />
    </>
  )
}

export const DRCLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/static/drc-logo.png" height={height} alt="DRC Logo" {...props} />
}

export const UhfLogo = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/static/logo-uhf.png" height={height} alt="UHF Logo" {...props} />
}
export const UsaidLogo = ({
  height = 28,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/static/logo-usaid.png" height={height} alt="USAID Logo" {...props} />
}
export const SdcLogo = ({
  height = 28,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/static/sdc.png" height={height} alt="Sdc Logo" {...props} />
}

export const DRCLogoLarge = ({
  height = 24,
  ...props
}: {
  height?: number
} & BoxProps) => {
  return <Box component="img" src="/static/drc-logo-large.png" height={height} alt="DRC Logo" {...props} />
}
