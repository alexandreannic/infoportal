import * as React from 'react'
import {forwardRef, ReactNode} from 'react'
import {Button, CircularProgress, Icon, styled, Tooltip} from '@mui/material'
import {ButtonProps} from '@mui/material/Button'
import {fnSwitch} from '@axanc/ts-utils'
import {alphaVar, styleUtils} from '../core/theme'

export type BtnVariant = 'light' | 'input' | 'text' | 'outlined' | 'contained'

export interface BtnProps extends Omit<ButtonProps, 'variant'> {
  variant?: BtnVariant
  tooltip?: ReactNode
  loading?: boolean
  icon?: string
  /** @deprecated use native endIcon props */
  iconAfter?: string
  before?: ReactNode
  iconSx?: ButtonProps['sx']
  target?: '_blank'
}

const StyledButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'variant',
})<{
  variant?: BtnVariant
}>(({theme, variant}) => {
  return {
    position: 'relative',
    ...fnSwitch(
      variant as unknown as BtnVariant,
      {
        light: {
          border: 'none',
          fontWeight: 500,
          background: alphaVar(theme.vars.palette.primary.main, 0.12),
          textTransform: 'inherit',
          '&:hover': {
            background: alphaVar(theme.vars.palette.primary.main, 0.2),
          },
        },
        input: {
          fontWeight: 500,
          ...styleUtils(theme).color.input.default,
          textTransform: 'inherit',
          '&:hover': {
            ...styleUtils(theme).color.input.hover,
          },
        },
      },
      () => ({}),
    ),
  }
})

const Content = styled('div')<{loading?: boolean}>(({loading}) => ({
  display: 'flex',
  alignItems: 'center',
  ...(loading && {
    visibility: 'hidden',
  }),
}))

const Progress = styled(CircularProgress)(({theme}) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: `calc(${theme.vars.spacing} * 1.5)`,
  marginLeft: `calc(${theme.vars.spacing} * 1.5)`,
}))

const StyledIcon = styled(Icon)(({theme}) => ({
  height: '22px !important',
  lineHeight: '22px !important',
  fontSize: '22px !important',
  marginRight: theme.vars.spacing,
}))

const StyledIconEnd = styled(StyledIcon)(({theme}) => ({
  marginRight: 0,
  marginLeft: theme.vars.spacing,
}))

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  (
    {tooltip, loading, children, disabled, before, icon, variant, iconAfter, color, className, iconSx, ...props},
    ref,
  ) => {
    const btn = (
      <StyledButton
        {...props}
        ref={ref}
        variant={variant === 'light' || variant === 'input' ? 'outlined' : variant}
        color={color}
        disabled={disabled || loading}
        loading={loading}
        className={className}
      >
        <Content loading={loading}>
          {before}
          {icon && (
            <StyledIcon fontSize={props.size} sx={iconSx}>
              {icon}
            </StyledIcon>
          )}
          {children}
          {iconAfter && (
            <StyledIconEnd fontSize={props.size} sx={iconSx}>
              {iconAfter}
            </StyledIconEnd>
          )}
        </Content>
        {loading && <Progress size={24} />}
      </StyledButton>
    )
    return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn
  },
)
