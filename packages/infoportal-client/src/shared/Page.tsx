import * as React from 'react'
import {ReactNode, useEffect, useState} from 'react'
import {Box, BoxProps, LinearProgress, Skeleton} from '@mui/material'
import {Txt} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'

export interface PageProps extends BoxProps {
  width?: number | 'xs' | 'md' | 'lg' | 'full'
  animation?: 'none' | 'default' | 'translateLeft'
  className?: any
  style?: object
  loading?: boolean
  children: ReactNode
  animationDeps?: any[]
}

let timeout: NodeJS.Timeout | undefined

export const PageTitle = ({
  action,
  children,
  subTitle,
  sx,
  logo,
  ...props
}: BoxProps & {
  logo?: ReactNode
  subTitle?: ReactNode
  action?: ReactNode
}) => {
  return (
    <Box sx={{display: 'flex', mt: 0, mb: 2, alignItems: 'center', ...sx}}>
      {logo && <Box sx={{mr: 2}}>{logo}</Box>}
      <Box>
        <Box component="h2" sx={{m: 0, p: 0}}>
          {children}
        </Box>
        <Txt size="big" color="hint">
          {subTitle}
        </Txt>
      </Box>
      {action && <Box sx={{ml: 'auto'}}>{action}</Box>}
    </Box>
  )
}

export const PagePlaceholder = (props: Pick<PageProps, 'width'>) => {
  const width =
    typeof props.width === 'string'
      ? {
          xs: 780,
          md: 1000,
          lg: 1200,
          full: 3000,
        }[props.width]
      : props.width
  return (
    <Page {...props}>
      <Skeleton variant="rounded" sx={{width: '100%', height: 'calc(100vh - 100px)'}} />
    </Page>
  )
}

export const Page = ({children, sx, loading, animation = 'default', animationDeps = [], ...props}: PageProps) => {
  const [appeared, setAppeared] = useState(false)
  const width =
    typeof props.width === 'string'
      ? {
          xs: 780,
          md: 1000,
          lg: 1240,
          full: 3000,
        }[props.width]
      : props.width

  useEffect(() => {
    setAppeared(false)
    if (animation !== 'none') timeout = setTimeout(() => setAppeared(true))
    return () => clearTimeout(timeout)
  }, animationDeps)

  return (
    <>
      {loading && <LinearProgress />}
      <Box
        {...props}
        sx={{
          transition: (t) => t.transitions.create('all', {easing: 'ease', duration: 160}),
          margin: 'auto',
          opacity: 0,
          transform: fnSwitch(animation, {
            none: 'none',
            translateLeft: 'translate(50px)',
            default: 'scale(.90)',
          }),
          maxWidth: 932,
          mt: 1,
          width: '100%',
          ...((!animation || appeared) && {
            opacity: 1,
            transform: 'none',
          }),
          ...(width && {maxWidth: width}),
          ...sx,
        }}
      >
        {children}
      </Box>
    </>
  )
}
