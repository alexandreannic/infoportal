import React, {ReactNode} from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {uppercaseHandlingAcronyms} from '@infoportal/common'
import {Core} from '@/shared'

type PanelWidgetProps = Omit<Core.PanelProps, 'title' | 'expendable' | 'savableAsImg'> & {
  icon?: string | ReactNode
  title: string
}

export const PanelWidget = ({sx, ...props}: PanelWidgetProps) => {
  const t = useTheme()
  return (
    <Core.Panel
      sx={{
        height: '100%',
        px: 0.25,
        // pb: t.vars.spacing + ' !important',
        '&:last-child': {
          mr: 0,
        },
        ...sx,
      }}
    >
      <PanelWidgetContent {...props} />
    </Core.Panel>
  )
}

export const PanelWidgetContent = ({sx, title, icon, children}: PanelWidgetProps) => {
  return (
    <Box
      className="PanelWidgetContent"
      sx={{
        minHeight: 76,
        height: '100%',
        // minHeight: 82.52,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
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
    </Box>
  )
}
