import * as React from 'react'
import {forwardRef, ReactNode} from 'react'
import {alpha, Button, CircularProgress, Icon, Tooltip} from '@mui/material'
import {ButtonProps} from '@mui/material/Button'
import {makeStyles} from 'tss-react/mui'
import {fnSwitch} from '@axanc/ts-utils'
import {styleUtils} from '../core'

const useStyles = makeStyles<{loading?: boolean; variant?: BtnVariant}>()((t, {loading, variant}) => ({
  icon: {
    height: '22px !important',
    lineHeight: '22px !important',
    fontSize: '22px !important',
    marginRight: t.spacing(1),
  },
  root: {
    ...fnSwitch(
      variant!,
      {
        light: {
          border: 'none',
          fontWeight: 500,
          background: alpha(t.palette.primary.main, 0.12),
          textTransform: 'inherit',
          '&:hover': {
            background: alpha(t.palette.primary.main, 0.2),
          },
        },
        input: {
          fontWeight: 500,
          ...styleUtils(t).color.input.default,
          textTransform: 'inherit',
          '&:hover': {
            ...styleUtils(t).color.input.hover,
          },
        },
      },
      () => undefined,
    ),
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    ...(loading && {
      visibility: 'hidden',
    }),
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: t.spacing(-1.5),
    marginLeft: t.spacing(-1.5),
  },
  iconEnd: {
    marginRight: 0,
    marginLeft: t.spacing(1),
  },
}))

export type BtnVariant = ButtonProps['variant'] | 'light' | 'input'

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

export const Btn = forwardRef(
  (
    {
      tooltip,
      loading,
      children,
      disabled,
      before,
      icon,
      variant,
      iconAfter,
      color,
      className,
      iconSx,
      ...props
    }: BtnProps,
    ref: any,
  ) => {
    const {classes, cx} = useStyles({loading, variant})
    const btn = (
      <Button
        {...props}
        variant={variant === 'light' || variant === 'input' ? 'outlined' : variant}
        color={color}
        disabled={disabled || loading}
        ref={ref}
        className={cx(className, classes.root)}
      >
        <div className={classes.content}>
          {before}
          {icon && (
            <Icon fontSize={props.size} className={classes.icon} sx={iconSx}>
              {icon}
            </Icon>
          )}
          {children}
          {iconAfter && (
            <Icon className={cx(classes.iconEnd, classes.icon)} fontSize={props.size} sx={iconSx}>
              {iconAfter}
            </Icon>
          )}
        </div>
        {loading && <CircularProgress size={24} className={classes.progress} />}
      </Button>
    )
    return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn
  },
)
