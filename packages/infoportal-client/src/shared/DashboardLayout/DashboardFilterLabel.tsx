import {Box, BoxProps, Icon, Popover} from '@mui/material'
import React, {ReactNode} from 'react'
import {combineSx, makeSx} from '@/core/theme'

const css = makeSx({
  button: {
    py: 0.75,
    px: 1.25,
    fontWeight: t => t.typography.fontWeightBold,
    display: 'inline-flex',
    alignItems: 'center',
    background: t => t.vars.palette.background.paper,
    border: t => `1px solid ${t.vars.palette.divider}`,
    borderRadius: 20,
    color: t => t.vars.palette.text.primary,
    transition: t => t.transitions.create('all'),
    '&:active': {
      boxShadow: t => t.vars.shadows[3],
    },
    '&:hover': {
      background: t => t.vars.palette.action.hover,
    },
  },
  active: {
    color: t => t.vars.palette.primary.main,
    background: t => t.vars.palette.action.focus,
    // borderColor: t => alpha(t.vars.palette.primary.light, .8),
  },
})

export const DashboardFilterLabel = ({
  label,
  children,
  icon,
  active,
  sx,
}: {
  active?: boolean
  icon?: string
  children: (opened: boolean, close: () => void) => any
  label: ReactNode
} & Omit<BoxProps, 'children'>) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const opened = !!anchorEl

  return (
    <Box sx={{position: 'relative', display: 'inline-block', ...sx}}>
      <Box
        component="button"
        sx={combineSx(css.button, active && css.active)}
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        {icon && (
          <Icon fontSize="small" sx={{mr: 0.75}}>
            {icon}
          </Icon>
        )}
        {label}
        <Icon color="disabled" sx={{ml: 0.25, mr: -0.25}} fontSize="small">
          {opened ? 'expand_less' : 'expand_more'}
        </Icon>
      </Box>
      <Popover
        disableScrollLock={true}
        open={opened}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{
          boxShadow: t => t.vars.shadows[4],
          overflow: 'hidden',
          // border: 'none',
          // position: 'absolute',
          // top: 46,
        }}
      >
        <Box
          sx={{
            overflowY: 'auto',
            maxHeight: '50vh',
          }}
        >
          {children(opened, () => setAnchorEl(null))}
        </Box>
      </Popover>
    </Box>
  )
}
