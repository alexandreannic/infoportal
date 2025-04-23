import {ReactNode} from 'react'
import {Box, BoxProps, CircularProgress, Icon, useTheme} from '@mui/material'

type State = 'loading' | 'error' | 'empty' | 'success' | 'warning'

export interface FenderProps extends Omit<BoxProps, 'title'> {
  type?: State
  icon?: string
  iconSize?: number
  title?: ReactNode
  description?: ReactNode
}

export const Fender = ({
  children,
  icon,
  iconSize = 100,
  type = 'empty',
  title,
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
        return <CircularProgress size={iconSize - 10} />
    }
  }

  const renderIcon = (name: string) => <Icon sx={{fontSize: `${iconSize}px !important`}}>{name}</Icon>

  return (
    <Box
      {...props}
      sx={{
        transition: (t) => t.transitions.create('all'),
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
            height: iconSize + 10,
            mt: 1,
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
          }}
        >
          {getIcon()}
        </Box>
        <Box sx={{mt: 1}}>
          {title && <Box sx={{fontSize: 24}}>{title}</Box>}
          {description && <Box>{description}</Box>}
          {children}
        </Box>
      </div>
    </Box>
  )
}
