import React, {ReactNode} from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {uppercaseHandlingAcronyms} from 'infoportal-common'
import {Core} from '@/shared'

export const PanelWidget = ({
  sx,
  children,
  title,
  icon,
  ...props
}: Omit<Core.PanelProps, 'title' | 'expendable' | 'savableAsImg'> & {
  icon?: string | ReactNode
  title: string
}) => {
  const t = useTheme()
  return (
    <Core.PanelWBody
      {...props}
      BodyProps={{
        sx: {
          px: 0.25,
          pb: t.vars.spacing + ' !important',
        },
      }}
      sx={{
        minHeight: 76,
        // minHeight: 82.52,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:last-child': {
          mr: 0,
        },
        ...sx,
      }}
    >
      <Box sx={{textAlign: 'center', width: '100%'}}>
        <Core.Txt block color="hint" bold sx={{lineHeight: 1, mb: 0.5, mt: -0.5}}>
          {uppercaseHandlingAcronyms(title)}
        </Core.Txt>
        <Box
          sx={{
            lineHeight: 1,
            fontWeight: t => t.typography.fontWeightBold,
            fontSize: '1.7em',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 32,
          }}
        >
          {icon &&
            (typeof icon === 'string' ? (
              <Icon color="disabled" sx={{mr: 1}} fontSize="large">
                {icon}
              </Icon>
            ) : (
              icon
            ))}
          {children}
        </Box>
      </Box>
    </Core.PanelWBody>
  )
}
