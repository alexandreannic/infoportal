import {Theme} from '@mui/material'
import {alphaVar} from '../core/theme.js'

export const chartConfig = {
  defaultColors: (t: Theme) => [
    t.vars.palette.primary.main,
    alphaVar(t.vars.palette.primary.light, 0.3),
    '#008a09',
    'red',
    'orange',
  ],
}
