'use client'
import React, {ReactElement} from 'react'
import {keyframes, SxProps, Theme, useTheme} from '@mui/material'
import {alphaVar} from '@infoportal/client-core'

const fadeInSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = (t: Theme) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alphaVar(t.vars.palette.secondary.main, 0.7)};
  }
  70% {
    box-shadow: 0 0 0 14px ${alphaVar(t.vars.palette.secondary.main, 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alphaVar(t.vars.palette.secondary.main, 0)};
  }
`

export const Pulse = ({
  label,
  children,
  index = 0,
}: {
  children: ReactElement<{sx: SxProps}>
  label?: string
  index?: number
}) => {
  const animationDelay = `${1 + index * 0.1}s`
  const t = useTheme()
  return React.cloneElement(children, {
    sx: {
      opacity: 0,
      animation: `${fadeInSlide} 0.5s ease-out forwards, ${pulse(t)} 1.5s 1`,
      animationDelay: `${animationDelay}, ${animationDelay}`,
      transition: 'transform 0.2s, background-color 0.2s',
    },
  })
}
