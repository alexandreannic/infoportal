'use client'
import {Button, ButtonProps, useTheme} from '@mui/material'
import Link from 'next/link'

export const MenuItem = ({href, sx, children}: ButtonProps & {href: string}) => {
  const t = useTheme()
  return (
    <Link href={href}>
      <Button
        size="small"
        variant="text"
        color="inherit"
        sx={{
          textTransform: 'none',
          color: t.vars.palette.text.primary,
          ...sx,
        }}
      >
        {children}
      </Button>
    </Link>
  )
}
