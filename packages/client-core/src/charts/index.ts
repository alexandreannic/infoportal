import {Theme} from '@mui/material'
import {alphaVar} from '../core/theme'

export const chartConfig = {
  defaultColors: (t: Theme) => [
    t.vars.palette.primary.main,
    alphaVar(t.vars.palette.primary.light, 0.3),
    '#008a09',
    'red',
    'orange',
  ],
}

export * from './ChartBar'
export * from './ChartBarBy'
export * from './ChartBarByKey'
export * from './ChartBarStacked'
export * from './ChartBarStackedSplit'
export * from './ChartBarVertical'
export * from './ChartGeo'
export * from './ChartBuilder'
export * from './ChartLine'
export * from './ChartLineBy'
export * from './ChartLineByDate'
export * from './ChartLineByProperty'
export * from './ChartPie'
export * from './ChartPieWidget'
export * from './ChartPieWidgetBy'
export * from './ChartLineByDateFiltered'
