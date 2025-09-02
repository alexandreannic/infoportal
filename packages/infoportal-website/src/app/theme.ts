'use client'
import {createTheme} from '@mui/material'
import {Open_Sans} from 'next/font/google'
import {alphaVar, colorPrimary, lightShadows} from '@infoportal/client-core'
import {green, orange, red} from '@mui/material/colors'

export const openSansFont = Open_Sans({
  variable: '--font-open_sans',
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const theme = createTheme({
  cssVariables: true,
  shadows: lightShadows as any,
  // defaultColorScheme: 'light',
  spacing: 16,
  shape: {
    borderRadius: 20,
  },
  colorSchemes: {
    light: {
      palette: {
        warning: orange,
        success: green,
        primary: colorPrimary,
        secondary: colorPrimary,
        error: red,
        action: {
          focus: alphaVar(colorPrimary['500'], 0.1),
          focusOpacity: 0.1,
        },
        background: {
          // paper: '#fff',
          // default: '#f5f5f7',
          default: '#fff',
          paper: '#f5f5f7',

          // default: 'rgba(221, 231, 248, 0.6)',
          // default: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
    // dark: {
    //   palette: {
    //     warning: orange,
    //     success: green,
    //     primary: colorPrimary,
    //     secondary: colorPrimary,
    //     error: red,
    //     action: {
    //       focus: alphaVar(colorPrimary['500'], 0.1),
    //       focusOpacity: 0.1,
    //     },
    //     background: {
    //       default: '#031525',
    //       paper: '#0d2136',
    //     },
    //   },
    // },
  },
  typography: {
    fontFamily: openSansFont.style.fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {},
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          borderRadius: 20,
        },
        outlinedPrimary: ({theme}) => ({
          borderColor: theme.vars.palette.divider,
        }),
      },
    },
  },
})
