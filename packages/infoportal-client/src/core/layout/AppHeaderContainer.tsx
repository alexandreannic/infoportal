import {alpha, Box, BoxProps, GlobalStyles, useTheme} from '@mui/material'
import React, {forwardRef, useEffect, useState} from 'react'
import {map} from '@axanc/ts-utils'

let header$: HTMLElement | null = null
const headerStickyClass = 'sticky-header'

const redesignHeaderOnTop = (headerId: string) => {
  if (!header$) {
    header$ = document.getElementById(headerId)
  }
  if (header$) {
    if (header$.getBoundingClientRect().y === 0 && window.screenTop > 0) {
      header$.classList.add(headerStickyClass)
    } else {
      header$.classList.remove(headerStickyClass)
    }
  }
}

export const AppHeaderContainer = forwardRef(({children, sx, ...props}: BoxProps, ref) => {
  const t = useTheme()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true) // Prevents SSR mismatch
    header$ = null
    map(props.id, id => {
      const fn = () => redesignHeaderOnTop(id)
      window.addEventListener('scroll', fn)
      return () => window.removeEventListener('scroll', fn)
    })
  }, [])

  return (
    <>
      {/* Global styles moved inside component */}
      <GlobalStyles
        styles={{
          [`.${headerStickyClass}`]: {
            boxShadow: t.shadows[4],
            background: alpha(t.palette.background.paper, 0.5),
          },
        }}
      />

      <Box
        ref={ref}
        {...props}
        className={hydrated ? undefined : headerStickyClass} // Prevents hydration mismatch
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          px: 2,
          display: 'flex',
          backdropFilter: 'blur(12px)',
          alignItems: 'center',
          // Because on Windows, sticky-header is not working properly
          boxShadow: t.shadows[5],
          // mb: 2,
          pl: 2,
          ...sx,
        }}
      >
        {children}
      </Box>
      {/*</Slide>*/}
    </>
  )
})
