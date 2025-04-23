import {Box, BoxProps, GlobalStyles} from '@mui/material'
import React, {useContext} from 'react'
import {defaultSpacing} from '../../core/theme'

const generalStyles = (
  <GlobalStyles
    styles={{
      sup: {
        verticalAlign: 'top',
        fontSize: '0.75em',
      },
      p: {
        fontSize: 'inherit',
        lineHeight: 1.6,
        marginTop: 0,
        marginBottom: 0,
        '&:not(:last-of-type)': {
          marginBottom: defaultSpacing,
        },
      },
      '@media print': {
        '.gm-fullscreen-control': {
          display: 'none',
        },
        '.noprint': {
          display: 'none',
        },
        '[role="tooltip"]': {
          display: 'none',
        },
      },
    }}
  />
)

const PdfContext = React.createContext({
  pdfTheme: {
    slidePadding: 2,
    slideRadius: 2,
    fontSize: 15,
  },
})

export const usePdfContext = () => useContext(PdfContext)

export const Pdf = ({children, ...props}: BoxProps) => {
  return (
    <>
      {generalStyles}
      <Box
        sx={{
          overflow: 'hidden',
          background: (t) => '#fff', //'#f6f7f9',
          '@media screen': {
            background: (t) => t.palette.background.paper, //'#f6f7f9',
            padding: 2,
          },
        }}
      >
        <Box
          {...props}
          sx={{
            size: 'landscape',
            overflow: 'hidden',
            width: '29.7cm',
            p: 0,
            m: 0,
            // height: '21.0cm',
            '@media screen': {
              my: 2,
              mx: 'auto',
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
