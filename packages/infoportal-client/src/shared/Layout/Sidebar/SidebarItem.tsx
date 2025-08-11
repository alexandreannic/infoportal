import * as React from 'react'
import {ReactNode} from 'react'
import {Box, ButtonBase, ButtonBaseProps, Icon, styled} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'
import {alphaVar, makeSx} from '@/core/theme'

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

const Root = styled(ButtonBase, {
  shouldForwardProp: prop => prop !== 'isClickable',
})<
  Pick<SidebarItemProps, 'size' | 'disabled' | 'large'> & {
    isClickable?: boolean
    active?: boolean
  }
>(({theme: t, isClickable, disabled, large, active, size}) => {
  const marginCoef = fnSwitch(
    size!,
    {
      normal: 2,
      small: 4,
      tiny: 8,
    },
    () => 2,
  )
  const my = `calc(${t.vars.spacing} / ${marginCoef})`
  return {
    width: `calc(100% - ${t.vars.spacing})`,
    transition: t.transitions.create('all'),
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
    color: t.vars.palette.text.primary,
    paddingRight: t.vars.spacing,
    paddingLeft: `calc(${t.vars.spacing} * 1.5)`,
    marginRight: `calc(${t.vars.spacing} * 0.5)`,
    marginLeft: `calc(${t.vars.spacing} * 0.5)`,
    marginTop: my,
    marginBottom: my,
    borderRadius: `calc(${t.vars.shape.borderRadius} - 2px)`,
    ...(disabled && {
      opacity: 0.5,
    }),
    '&:hover': {
      background: isClickable ? alphaVar(t.vars.palette.primary.main, 0.06) : undefined,
    },
    ...(large && {
      minHeight: 38,
    }),
    ...(active && {
      color: t.vars.palette.primary.main,
      background: alphaVar(t.vars.palette.primary.main, 0.16),
    }),
  }
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
  const isClickable = !!(props.onClick || props.href || active !== undefined)
  return (
    <Root component="div" role="link" disableRipple={!isClickable} isClickable={isClickable} sx={sx} {...props}>
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
    </Root>
  )
}
