import * as React from 'react'
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react'
import {Box, BoxProps, CircularProgress, Skeleton, SkeletonProps, SxProps, Theme, useTheme} from '@mui/material'
import {CenteredContent, Core} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'
import {CSSObject} from '@mui/styled-engine'

export interface PageProps extends BoxProps {
  width?: number | 'xxs' | 'xs' | 'md' | 'lg' | 'full'
  animation?: 'none' | 'default' | 'translateLeft'
  className?: any
  style?: object
  loading?: boolean
  children?: ReactNode
  animationDeps?: any[]
}

export const PagePlaceholder = ({sx, ...props}: BoxProps) => {
  return (
    <Box {...props} sx={{...sx, pb: 1, height: '100%'}}>
      <Skeleton variant="rounded" sx={{width: '100%', height: '100%', transform: 'none'}} />
    </Box>
  )
}

export function usePageAnimation({
  animation,
  animationDeps,
}: Required<Pick<PageProps, 'animation' | 'animationDeps'>>): CSSObject {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTheme()
  const [appeared, setAppeared] = useState(false)
  useEffect(() => {
    setAppeared(false)
    if (animation !== 'none') timeoutRef.current = setTimeout(() => setAppeared(true))
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, animationDeps)

  return useMemo(() => {
    return {
      transition: t.transitions.create('all', {easing: 'ease', duration: 160}),
      opacity: 0,
      transform: fnSwitch(animation, {
        none: 'none',
        translateLeft: 'translate(90px)',
        default: 'scale(.90)',
      }),
      ...((!animation || appeared) && {
        opacity: 1,
        transform: 'none',
      }),
    }
  }, [animation, appeared])
}

export function usePageWidthStyle(props: {width: PageProps['width']}): CSSObject {
  return useMemo(() => {
    const width = calculatePageWidth(props.width)
    return {
      width: '100%',
      margin: 'auto',
      maxWidth: width,
    }
  }, [props.width])
}

export const PageLoader = () => {
  return (
    <CenteredContent>
      <CircularProgress size={100} thickness={2} />
    </CenteredContent>
  )
}

export const Page = ({children, sx, loading, animation = 'default', animationDeps = [], ...props}: PageProps) => {
  const widthStyle = usePageWidthStyle({width: props.width})
  const animationStyle = usePageAnimation({animation, animationDeps})
  return (
    <>
      <Box
        className={'IpPage ' + (props.className ?? '')}
        {...props}
        sx={{
          ...widthStyle,
          ...animationStyle,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          position: 'relative',
          mt: 1,
          ...sx,
        }}
      >
        {loading ? <PagePlaceholder /> : children}
      </Box>
    </>
  )
}

export function calculatePageWidth(width?: string | number) {
  if (!width) return '100%'
  return typeof width === 'string'
    ? {
        xxs: 520,
        xs: 780,
        md: 1000,
        lg: 1240,
        full: 3000,
      }[width]
    : width
}
