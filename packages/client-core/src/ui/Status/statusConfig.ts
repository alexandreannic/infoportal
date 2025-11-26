import {StateStatus} from '@infoportal/common'
import {Theme} from '@mui/material'

export const statusConfig: Record<
  StateStatus,
  {color: (t: Theme) => string; colorContrast: (t: Theme) => string; iconOutlined: string; icon: string}
> = {
  error: {
    color: t => t.vars.palette.error.main,
    colorContrast: t => t.vars.palette.error.contrastText,
    icon: 'error',
    iconOutlined: 'error_outline',
  },
  warning: {
    color: t => t.vars.palette.warning.main,
    colorContrast: t => t.vars.palette.warning.contrastText,
    icon: 'access_time_filled',
    iconOutlined: 'schedule',
  },
  info: {
    color: t => t.vars.palette.info.main,
    colorContrast: t => t.vars.palette.info.contrastText,
    icon: 'info',
    iconOutlined: 'info',
  },
  success: {
    color: t => t.vars.palette.success.main,
    colorContrast: t => t.vars.palette.success.contrastText,
    icon: 'check_circle',
    iconOutlined: 'check_circle_outline',
  },
  disabled: {
    color: t => t.vars.palette.text.disabled,
    colorContrast: t => t.vars.palette.divider,
    icon: 'remove_circle',
    iconOutlined: 'remove_circle_outline',
  },
}

