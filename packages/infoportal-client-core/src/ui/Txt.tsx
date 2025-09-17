import {Box, BoxProps, Skeleton, useTheme} from '@mui/material'
// import * as React from 'react'
import {forwardRef} from 'react'

export interface TxtProps extends BoxProps {
  bold?: boolean
  italic?: boolean
  gutterBottom?: boolean
  block?: boolean
  skeleton?: boolean | number | string
  size?: 'big' | 'title' | 'small'
  color?: 'primary' | 'secondary' | 'disabled' | 'hint' | 'default' | 'error' | 'success' | 'warning' | 'info'
  uppercase?: boolean
  truncate?: boolean
  noWrap?: boolean
  link?: boolean
}

export const Txt = forwardRef(
  (
    {
      skeleton,
      children,
      gutterBottom,
      block,
      bold,
      size,
      link,
      italic,
      color,
      uppercase,
      truncate,
      noWrap,
      sx,
      ...otherProps
    }: TxtProps,
    ref: any,
  ) => {
    const t = useTheme()
    return (
      <Box
        sx={{
          display: 'inline',
          lineHeight: '1.5',
          ...(size &&
            {
              title: {
                fontSize: '1.30em',
              },
              big: {
                fontSize: '1.10em',
              },
              small: {
                fontSize: '0.90em',
              },
            }[size]),
          ...(color &&
            {
              primary: {
                color: t.vars.palette.primary.main,
              },
              secondary: {
                color: t.vars.palette.secondary.main,
              },
              disabled: {
                color: t.vars.palette.text.disabled,
              },
              hint: {
                color: t.vars.palette.text.secondary,
              },
              error: {
                color: t.vars.palette.error.main,
              },
              default: {
                color: t.vars.palette.text.primary,
              },
              success: {
                color: t.vars.palette.success.main,
              },
              info: {
                color: t.vars.palette.info.main,
              },
              warning: {
                color: t.vars.palette.warning.main,
              },
            }[color]),
          ...(block && {
            display: 'block',
          }),
          ...(bold && {
            fontWeight: t.typography.fontWeightMedium,
          }),
          ...(italic && {
            fontStyle: 'italic',
          }),
          ...(gutterBottom && {
            mb: 1,
          }),
          ...(link && {
            color: t.vars.palette.primary.main,
          }),
          ...(uppercase && {
            textTransform: 'uppercase' as any,
          }),
          ...(noWrap && {
            whiteSpace: 'nowrap' as any,
          }),
          ...(truncate && {
            whiteSpace: 'nowrap' as any,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }),
          ...sx,
        }}
        {...otherProps}
        ref={ref}
      >
        {skeleton ? (
          <Skeleton sx={{display: 'inline-block'}} width={isNaN(skeleton as any) ? '80%' : (skeleton as number)} />
        ) : (
          children
        )}
      </Box>
    )
  },
)
