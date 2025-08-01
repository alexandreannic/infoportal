import * as React from 'react'
import {ReactNode} from 'react'
import {Box, ButtonBase, ButtonBaseProps, Icon} from '@mui/material'
import {alpha, useTheme} from '@mui/material/styles'
import {fnSwitch} from '@axanc/ts-utils'
import {makeSx} from '@/core/theme'

const css = makeSx({
  iStart: {
    textAlign: 'center',
    mr: 1.5,
    ml: -0.5,
  },
  iEnd: {
    textAlign: 'center',
    ml: 1.5,
    // mr: -0.5,
  },
})

export interface SidebarItemProps extends ButtonBaseProps {
  icon?: string | ReactNode
  iconEnd?: string | ReactNode
  disabled?: boolean
  large?: boolean
  href?: string
  target?: string
  active?: boolean
  size?: 'normal' | 'small' | 'tiny'
  to?: string
}

export const SidebarItem = ({
  children,
  icon,
  size,
  iconEnd,
  className,
  active,
  large,
  sx,
  ...props
}: SidebarItemProps) => {
  const t = useTheme()
  return (
    <ButtonBase
      disableRipple={!props.onClick && !props.href}
      sx={{
        width: `calc(100% - ${t.spacing(1)})`,
        transition: t => t.transitions.create('all'),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'inherit',
        minHeight: fnSwitch(
          size!,
          {
            normal: 36,
            small: 30,
            tiny: 28,
          },
          () => 36,
        ),
        overflow: 'hidden',
        minWidth: 0,
        whiteSpace: 'nowrap',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        color: t => t.palette.text.primary,
        pr: 1,
        pl: 1.5,
        mx: 0.5,
        my:
          1 /
          fnSwitch(
            size!,
            {
              normal: 2,
              small: 4,
              tiny: 8,
            },
            () => 2,
          ),
        borderRadius: parseInt('' + t.shape.borderRadius) - 2 + 'px',
        // borderTopRightRadius: 42,
        // borderBottomRightRadius: 42,
        ...(props.disabled && {
          opacity: 0.5,
        }),
        '&:hover': {
          background: t => alpha(t.palette.primary.main, 0.06),
        },
        ...(large && {
          minHeight: 38,
        }),
        ...(active && {
          color: t => t.palette.primary.main,
          background: t => alpha(t.palette.primary.main, 0.16),
        }),
        ...sx,
      }}
      {...props}
    >
      {icon &&
        (typeof icon === 'string' ? (
          <Icon fontSize={size === 'small' ? 'small' : 'medium'} sx={css.iStart}>
            {icon}
          </Icon>
        ) : (
          <Box sx={css.iStart}>{icon}</Box>
        ))}
      <Box
        sx={{
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          fontWeight: t => t.typography.fontWeightMedium,
        }}
      >
        {children}
      </Box>
      {iconEnd &&
        (typeof iconEnd === 'string' ? (
          <Icon sx={css.iEnd} color="disabled">
            {iconEnd}
          </Icon>
        ) : (
          <Box sx={css.iEnd}>{iconEnd}</Box>
        ))}
    </ButtonBase>
  )
}
