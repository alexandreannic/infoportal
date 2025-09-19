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

export * from './ChartBar.jsx'
export * from './ChartBarMultipleBy.jsx'
export * from './ChartBarMultipleByKey.jsx'
export * from './ChartBarSingleBy.jsx'
export * from './ChartBarStacked.jsx'
export * from './ChartBarStackedSplit.jsx'
export * from './ChartBarVertical.jsx'
export * from './ChartGeo.jsx'
export * from './chartHelper'
export * from './ChartLine.jsx'
export * from './ChartLineBy.jsx'
export * from './ChartLineByDate.jsx'
export * from './ChartLineByProperty.jsx'
export * from './ChartPie.jsx'
export * from './ChartPieWidget.jsx'
export * from './ChartPieWidgetBy.jsx'
export * from './ChartPieWidgetByKey.jsx'
