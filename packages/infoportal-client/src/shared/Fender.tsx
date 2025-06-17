import {ReactNode} from 'react'
import {Box, BoxProps, CircularProgress, Icon, SxProps, Theme, useTheme} from '@mui/material'
import {sxUtils} from '@/core/theme'
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

const textSizes: Record<FenderSize, {title: SxProps<Theme>; description: SxProps<Theme>}> = {
  small: {
    title: sxUtils.fontNormal,
    description: sxUtils.fontSmall,
  },
  big: {
    title: sxUtils.fontBig,
    description: sxUtils.fontNormal,
  },
  normal: {
    title: sxUtils.fontBig,
    description: sxUtils.fontNormal,
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
  const getIcon = () => {
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
  }

  const renderIcon = (name: string) => <Icon sx={{fontSize: `${iconSize}px !important`}}>{name}</Icon>

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
            ...{
              error: {
                color: t.palette.error.main,
              },
              empty: {
                color: t.palette.text.disabled,
              },
              warning: {
                color: t.palette.warning.main,
              },
              loading: {},
              success: {
                color: t.palette.success.main,
              },
            }[type],
            ...sx,
          }}
        >
          {getIcon()}
        </Box>
        <Box sx={{mt: 0}}>
          {title && <Box sx={textSizes[size].title}>{title}</Box>}
          {description && <Box sx={textSizes[size].description}>{description}</Box>}
          {children}
        </Box>
      </div>
    </Box>
  )
}
