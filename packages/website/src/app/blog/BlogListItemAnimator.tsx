'use client'
import React, {ReactElement, useEffect, useState} from 'react'
import {keyframes, SxProps, useTheme} from '@mui/material'
import {blogListItemHeight} from '@/app/blog/BlogListItem'

let ignore = false
const animationDuration = 190
const offset = 70

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: none;
  }
  50% {
    transform: scale(1.07);
    box-shadow: var(--mui-shadows-7);
  }
  100% {
    transform: scale(1);
    box-shadow: none;
  }
`

export const BlogListItemAnimator = ({
  children,
  position,
}: {
  position: number
  children: ReactElement<{sx: SxProps; onClick: (e: any) => void}>
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [appeared, setAppeared] = useState(false)
  const t = useTheme()
  const duration = animationDuration + position * 30
  const top = offset + position * (blogListItemHeight + 16)

  useEffect(() => {
    setTimeout(() => {
      setAppeared(true)
    }, position * 50)
  }, [])

  return React.cloneElement(children, {
    sx: {
      position: 'absolute',
      left: 0,
      right: 0,
      transition: t.transitions.create('all', {duration}),
      top: appeared ? top : top + 100,
      blogListItemHeight,
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: t.shadows[3],
      },
      ...(isRedirecting
        ? {
            animation: `${pulse} ${animationDuration}ms ease-in-out`,
            top: 0,
          }
        : {}),
    },
    onClick: e => {
      if (ignore) return
      e.stopPropagation()
      e.preventDefault()
      setIsRedirecting(true)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      setTimeout(() => {
        console.log(e)
        ignore = true
        e.target.click()
        ignore = false
      }, duration)
    },
  })
}
