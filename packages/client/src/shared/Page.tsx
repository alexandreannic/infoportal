import * as React from 'react'
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react'
import {Box, BoxProps, CircularProgress, Skeleton, useTheme} from '@mui/material'
import {CenteredContent} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'
import {CSSObject} from '@mui/styled-engine'

export interface PageProps extends BoxProps {
  width?: number | 'xxs' | 'xs' | 'md' | 'lg' | 'full'
  animation?: 'none' | 'default' | 'translateLeft'
  className?: any
  fullHeight?: boolean
  style?: object
  loading?: boolean
  pending?: boolean
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

const Progress = ({sx, ...props}: BoxProps) => {
  const t = useTheme()
  return (
    <Box
      sx={{
        background: t.palette.primary.main,
        boxShadow: t => `0 0 10px ${t.palette.primary.main}, 0 0 5px ${t.palette.primary.main}`,
        height: 2,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        transition: t => t.transitions.create('all', {duration: 400}),
        animation: 'grow 5s linear forwards', // duration=3s, adjust as needed
        '@keyframes grow': {
          from: {width: '0%'},
          to: {width: '98%'},
        },
        // ...(!started && {
        //   height: '0px !important',
        // }),
        ...sx,
      }}
      style={{width: 40 + '%'}}
    />
  )
}

export const Page = ({
  children,
  sx,
  pending,
  loading,
  fullHeight,
  animation = 'default',
  animationDeps = [],
  ...props
}: PageProps) => {
  const t = useTheme()
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
          height: fullHeight ? `calc(100% - ${t.vars.spacing})` : undefined,
          // borderRadius: t.shape.borderRadius + 'px',
          // overflow: 'hidden', // I removed this so WidgetSettingsPanel can be sticky
          ...sx,
        }}
      >
        {(loading || pending) && <Progress />}
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
