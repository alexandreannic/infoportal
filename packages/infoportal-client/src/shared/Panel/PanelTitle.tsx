import {Box, Typography, TypographyProps} from '@mui/material'
import {ReactNode} from 'react'

export interface PanelTitleProps extends TypographyProps {
  action?: ReactNode
}

export const PanelTitle = ({sx, children, action, ...props}: PanelTitleProps) => {
  return (
    <Typography
      variant="h3"
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        my: 0,
        mx: 0,
        ...sx,
      }}
    >
      <Box sx={{flex: 1}}>{children}</Box>
      {action}
    </Typography>
  )
}
