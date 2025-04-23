import {alpha, Box, BoxProps, Checkbox, Icon, Radio} from '@mui/material'
import React, {ReactNode} from 'react'

const defaultMuiRadioPadding = 9

export interface ScRadioGroupItemProps<T> extends Omit<BoxProps, 'title'> {
  title?: string | ReactNode
  description?: string | ReactNode
  value: T
  disabled?: boolean
  icon?: string
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
  sx,
  ...rest
}: ScRadioGroupItemProps<T>) => {
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
        border: (t) => '1px solid ' + t.palette.divider,
        paddingBottom: '2px',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        ...(inline
          ? {
              borderRightColor: 'transparent',
              '&:last-of-type': {
                borderRight: (t) => '1px solid ' + t.palette.divider,
                borderBottomRightRadius: (t) => t.shape.borderRadius,
                borderTopRightRadius: (t) => t.shape.borderRadius,
              },
              '&:first-of-type': {
                borderBottomLeftRadius: (t) => t.shape.borderRadius,
                borderTopLeftRadius: (t) => t.shape.borderRadius,
              },
              '&:not(:first-of-type)': {
                marginLeft: '-1px',
              },
            }
          : {
              borderBottomColor: 'transparent',
              '&:last-of-type': {
                borderBottom: (t) => '1px solid ' + t.palette.divider,
                borderBottomRightRadius: (t) => t.shape.borderRadius,
                borderBottomLeftRadius: (t) => t.shape.borderRadius,
              },
              '&:first-of-type': {
                borderTopRightRadius: (t) => t.shape.borderRadius,
                borderTopLeftRadius: (t) => t.shape.borderRadius,
              },
              '&:not(:first-of-type)': {
                marginTop: '-2px',
              },
            }),
        '&:hover': disabled
          ? {}
          : {
              zIndex: 1,
              border: (t) => `1px solid ${t.palette.primary.main}`,
              background: 'rgba(0,0,0,.04)',
            },
        ...(disabled && {
          opacity: 0.8,
        }),
        ...(selected && {
          zIndex: 1,
          border: (t) => `1px solid ${t.palette.primary.main} !important`,
          background: (t) => alpha(t.palette.primary.main, 0.1),
          boxShadow: (t) => `inset 0 0 0 1px ${t.palette.primary.main}`,
        }),
        ...(error && {
          '&$rootSelected': {
            borderColor: (t) => t.palette.error.main + ' !important',
          },
          boxShadow: (t) => `inset 0 0 0 1px ${t.palette.error.main}`,
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
      {icon && (
        <Icon sx={{color: iconColor ?? ((t) => t.palette.text.disabled), mr: 1, alignSelf: 'center'}}>{icon}</Icon>
      )}
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
        {title && <Box>{title}</Box>}
        {description && (
          <Box sx={{color: (t) => t.palette.text.secondary, fontSize: (t) => t.typography.fontSize * 0.9}}>
            {description}
          </Box>
        )}
        {children && children}
      </Box>
    </Box>
  )
}
