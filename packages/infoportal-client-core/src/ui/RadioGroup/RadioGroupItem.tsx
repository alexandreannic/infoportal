import {Box, BoxProps, Checkbox, Icon, Radio, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {styleUtils} from 'infoportal-client/src/core/theme.js'

const defaultMuiRadioPadding = 9

export interface ScRadioGroupItemProps<T> extends Omit<BoxProps, 'title'> {
  title?: string | ReactNode
  description?: string | ReactNode
  value: T
  disabled?: boolean
  icon?: string
  endContent?: ReactNode
  iconColor?: string
  selected?: boolean
  before?: ReactNode
  children?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  dense?: boolean
  inline?: boolean
  error?: boolean
  hideRadio?: boolean
  multiple?: boolean
}

export const ScRadioGroupItem = <T,>({
  title,
  description,
  error,
  icon,
  iconColor,
  dense,
  inline,
  disabled,
  value,
  children,
  selected,
  onClick,
  hideRadio,
  className,
  before,
  multiple,
  endContent,
  sx,
  ...rest
}: ScRadioGroupItemProps<T>) => {
  const t = useTheme()
  const borderColorActive = t.vars.palette.primary.main
  const minHeight = dense ? 34 : 50
  return (
    <Box
      role={multiple ? 'checkbox' : 'radio'}
      sx={{
        ...sx,
        ...styleUtils(t).color.input.default,
        minHeight,
        // paddingRight: '2px',
        px: dense ? 1.5 : 2,
        display: 'flex',
        alignItems: 'flex-start',
        // border: '2px solid ' + 'transparent',
        paddingBottom: '2px',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        borderRadius: 0,
        ...(inline
          ? {
              borderRightColor: 'transparent',
              '&:last-of-type': {
                borderRight: '2px solid ' + 'transparent',
                borderBottomRightRadius: styleUtils(t).color.input.default.borderRadius,
                borderTopRightRadius: styleUtils(t).color.input.default.borderRadius,
              },
              '&:first-of-type': {
                borderBottomLeftRadius: styleUtils(t).color.input.default.borderRadius,
                borderTopLeftRadius: styleUtils(t).color.input.default.borderRadius,
              },
              '&:not(:first-of-type)': {
                marginLeft: '-1px',
              },
            }
          : {
              // borderBottomColor: 'transparent',
              '&:last-of-type': {
                // borderBottom: '2px solid ' + 'transparent',
                borderBottomRightRadius: styleUtils(t).color.input.default.borderRadius,
                borderBottomLeftRadius: styleUtils(t).color.input.default.borderRadius,
              },
              '&:first-of-type': {
                borderTopRightRadius: styleUtils(t).color.input.default.borderRadius,
                borderTopLeftRadius: styleUtils(t).color.input.default.borderRadius,
              },
              '&:not(:first-of-type)': {
                borderTop: 'none',
                marginTop: '-1px',
              },
            }),
        '&:hover':
          disabled || selected
            ? {}
            : {
                ...styleUtils(t).color.toolbar.hover,
                zIndex: 1,
                // border: `2px solid ${borderColorActive}`,
              },
        ...(disabled && {
          opacity: 0.8,
        }),
        ...(selected && {
          ...styleUtils(t).color.toolbar.active,
          zIndex: 1,
          border: `1px solid ${borderColorActive} !important`,
          // background: alpha(t.vars.palette.primary.main, 0.5),
          color: t.vars.palette.primary.main,
          boxShadow: `inset 0 0 0 1px ${borderColorActive}`,
        }),
        ...(error && {
          '&$rootSelected': {
            borderColor: t.vars.palette.error.main + ' !important',
          },
          boxShadow: `inset 0 0 0 1px ${t.vars.palette.error.main}`,
        }),
      }}
      // className={classes(css.root, selected && css.rootSelected, error && css.rootError, className)}
      onClick={onClick}
      {...rest}
    >
      {!hideRadio &&
        (multiple ? (
          <Checkbox
            disabled={disabled}
            size={dense ? 'small' : undefined}
            checked={selected}
            sx={{
              marginLeft: -1,
              marginRight: 0,
              minHeight: minHeight,
            }}
          />
        ) : (
          <Radio
            size="small"
            disabled={disabled}
            // size={dense ? 'small' : undefined}
            checked={selected}
            sx={{
              marginLeft: -1,
              marginRight: 0,
              minHeight: minHeight,
            }}
          />
        ))}
      {before}
      {icon && <Icon sx={{color: iconColor ?? t.vars.palette.text.disabled, mr: 1, alignSelf: 'center'}}>{icon}</Icon>}
      <Box
        sx={{
          alignSelf: 'center',
          display: 'flex',
          justifyContent: 'center',
          pt: 1.5,
          pb: 1.5,
          flexDirection: 'column',
          width: '100%',
          ...(dense && {
            pt: 0.5,
            pb: 0.5,
          }),
        }}
      >
        {title && title}
        {description && (
          <Box sx={{color: t.vars.palette.text.secondary, fontSize: t.typography.fontSize * 0.9}}>{description}</Box>
        )}
        {children && children}
      </Box>
      {endContent && <Box sx={{alignSelf: 'center'}}>{endContent}</Box>}
    </Box>
  )
}
