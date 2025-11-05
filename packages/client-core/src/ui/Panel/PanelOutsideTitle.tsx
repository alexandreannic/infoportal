import {Box, Typography, TypographyProps, useTheme} from '@mui/material'
import {ReactNode} from 'react'
import {styleUtils} from '../../core/theme.js'
export interface PanelOutsideTitleProps extends TypographyProps {
  action?: ReactNode
}

export const PanelOutsideTitle = ({sx, children, action, ...props}: PanelOutsideTitleProps) => {
  const t = useTheme()
  return (
    <Box
      {...props}
      sx={{
        fontWeight: t.typography.fontWeightBold,
        fontSize: styleUtils(t).fontSize.big,
        mb: 1,
        mt: 1,
        '&:not(:first-of-type)': {
          mt: 2,
        },
        pl: 1,
        color: t.vars.palette.text.secondary,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Box sx={{flex: 1}}>{children}</Box>
      {action}
    </Box>
  )
}
