import {ReactNode, useCallback, useMemo} from 'react'
import {Box, BoxProps, CircularProgress, Icon, useTheme} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'

type State = 'loading' | 'error' | 'empty' | 'success' | 'warning'

type FenderSize = 'normal' | 'small' | 'big'

export interface FenderProps extends Omit<BoxProps, 'title'> {
  type?: State
  icon?: string
  iconSize?: number
  title?: ReactNode
  size?: FenderSize
  description?: ReactNode
}

const textSizes: Record<FenderSize, {title: string; description: string}> = {
  small: {
    title: '1em',
    description: '0.85em',
  },
  big: {
    title: '1.3em',
    description: '1.15em',
  },
  normal: {
    title: '1.15em',
    description: '1em',
  },
}

export const Fender = ({
  children,
  icon,
  type = 'empty',
  title,
  size = 'normal',
  iconSize = fnSwitch(size, {
    normal: 44,
    small: 32,
    big: 100,
  }),
  description,
  sx,
  ...props
}: FenderProps) => {
  const t = useTheme()

  const renderIcon = useCallback(
    (name: string) => <Icon sx={{fontSize: `${iconSize}px !important`}}>{name}</Icon>,
    [iconSize],
  )

  const getIcon = useMemo(() => {
    if (icon) return renderIcon(icon)
    switch (type) {
      case 'empty':
        return renderIcon('do_not_disturb')
      case 'error':
        return renderIcon('error_outline')
      case 'success':
        return renderIcon('check_circle_outline')
      case 'warning':
        return renderIcon('warning')
      case 'loading':
        return <CircularProgress size={iconSize} />
    }
  }, [type, renderIcon])

  const color = useCallback(() => {
    return fnSwitch(type, {
      loading: {},
      error: {
        color: t.vars.palette.error.main,
      },
      empty: {
        color: t.vars.palette.text.disabled,
      },
      warning: {
        color: t.vars.palette.warning.main,
      },
      success: {
        color: t.vars.palette.success.main,
      },
    })
  }, [type])

  return (
    <Box
      {...props}
      sx={{
        transition: t => t.transitions.create('all'),
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <div>
        <Box
          sx={{
            height: iconSize,
            lineHeight: 1,
            color,
            ...sx,
          }}
        >
          {getIcon}
        </Box>
        <Box sx={{mt: 0, color}}>
          {title && <Box sx={{fontSize: textSizes[size].title}}>{title}</Box>}
          {description && <Box sx={{fontSize: textSizes[size].description}}>{description}</Box>}
          {children}
        </Box>
      </div>
    </Box>
  )
}
