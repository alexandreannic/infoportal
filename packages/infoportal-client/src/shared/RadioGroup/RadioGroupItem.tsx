import {alpha, Box, BoxProps, Checkbox, Icon, Radio, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {styleUtils} from '@/core/theme'

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
  const borderColorActive = 'transparent'
  const minHeight = dense ? 34 : 50
  return (
    <Box
      role={multiple ? 'checkbox' : 'radio'}
      sx={{
        ...sx,
        minHeight,
        // paddingRight: '2px',
        px: dense ? 1.5 : 2,
        display: 'flex',
        alignItems: 'flex-start',
        border: '2px solid ' + 'transparent',
        ...styleUtils(t).color.inputBack,
        paddingBottom: '2px',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        borderRadius: '4px',
        ...(inline
          ? {
              borderRightColor: 'transparent',
              '&:last-of-type': {
                borderRight: '2px solid ' + 'transparent',
                borderBottomRightRadius: t.shape.borderRadius,
                borderTopRightRadius: t.shape.borderRadius,
              },
              '&:first-of-type': {
                borderBottomLeftRadius: t.shape.borderRadius,
                borderTopLeftRadius: t.shape.borderRadius,
              },
              '&:not(:first-of-type)': {
                marginLeft: '-1px',
              },
            }
          : {
              borderBottomColor: 'transparent',
              '&:last-of-type': {
                borderBottom: '2px solid ' + 'transparent',
                borderBottomRightRadius: t.shape.borderRadius,
                borderBottomLeftRadius: t.shape.borderRadius,
              },
              '&:first-of-type': {
                borderTopRightRadius: t.shape.borderRadius,
                borderTopLeftRadius: t.shape.borderRadius,
              },
              '&:not(:first-of-type)': {
                marginTop: '2px',
              },
            }),
        '&:hover':
          disabled || selected
            ? {}
            : {
                zIndex: 1,
                border: `2px solid ${borderColorActive}`,
                ...styleUtils(t).color.inputBackHover,
              },
        ...(disabled && {
          opacity: 0.8,
        }),
        ...(selected && {
          zIndex: 1,
          border: `2px solid ${borderColorActive} !important`,
          // background: alpha(t.palette.primary.main, 0.5),
          ...styleUtils(t).color.inputBackActive,
          // color: t.palette.primary.main,
          // boxShadow:`inset 0 0 0 1px ${t.palette.primary.main}`,
        }),
        ...(error && {
          '&$rootSelected': {
            borderColor: t.palette.error.main + ' !important',
          },
          // boxShadow:`inset 0 0 0 1px ${t.palette.error.main}`,
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
      {icon && <Icon sx={{color: iconColor ?? t.palette.text.disabled, mr: 1, alignSelf: 'center'}}>{icon}</Icon>}
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
          <Box sx={{color: t.palette.text.secondary, fontSize: t.typography.fontSize * 0.9}}>{description}</Box>
        )}
        {children && children}
      </Box>
      {endContent && <Box sx={{alignSelf: 'center'}}>{endContent}</Box>}
    </Box>
  )
}
