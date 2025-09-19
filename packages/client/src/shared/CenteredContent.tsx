import {ReactNode} from 'react'
import {Box} from '@mui/material'

interface Props {
  children: ReactNode
  offset?: number
  xCenter?: boolean
}

export const CenteredContent = ({xCenter = true, children, offset = 48}: Props) => {
  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${offset}px)`,
        position: 'relative',
        display: 'flex',
        alignItems: xCenter ? 'center' : undefined,
        flexDirection: 'column',
        '&:before, &:after': {
          content: '" "',
          display: 'block',
          flexGrow: 1,
          height: 24,
        },
      }}
    >
      {children}
    </Box>
  )
}
