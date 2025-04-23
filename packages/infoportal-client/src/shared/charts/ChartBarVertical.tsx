import React from 'react'
import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import {Box, BoxProps, Theme, useTheme} from '@mui/material'
import {chartConfig} from '@/shared/charts/chartConfig'
import {commonLegendProps} from '@/shared/charts/ChartBarStacked'

export interface ChartBarVerticalProps extends BoxProps {
  colors?: (t: Theme) => string[]
  height?: number | string
  width?: number | string
  data: ({name: string} | Record<string, number>)[]
  hideYTicks?: boolean
  hideLegends?: boolean
}

export const ChartBarVertical = ({
  width,
  height,
  hideYTicks,
  hideLegends,
  sx,
  data,
  colors = chartConfig.defaultColors,
  ...props
}: ChartBarVerticalProps) => {
  const theme = useTheme()
  height = height ?? width ?? 340
  width = width ?? '100%'
  const bars = Object.keys(data[0] ?? {}).filter((_) => _ !== 'name')
  return (
    <Box sx={{position: 'relative', height, width, ...sx}} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          // margin={{
          //   top: 5,
          //   right: 30,
          //   left: 20,
          //   bottom: 5,
          // }}
        >
          {/*<CartesianGrid strokeDasharray="3 3"/>*/}
          <XAxis dataKey="name" />
          <YAxis hide={hideYTicks} />
          <Tooltip />
          {!hideLegends && <Legend {...commonLegendProps} />}
          {bars.map((_, i) => (
            <Bar key={_} dataKey={_} fill={colors(theme)[i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
