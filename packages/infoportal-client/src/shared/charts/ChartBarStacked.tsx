import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import React from 'react'
import {Box, BoxProps, Theme, useTheme} from '@mui/material'
import {chartConfig} from './chartConfig'

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({x, y, stroke, value, ...rest}: any) => {
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {value}
    </text>
  )
}

export const commonLegendProps = {
  formatter: (_: any) => (
    <Box component="span" sx={{verticalAlign: 'middle', color: (t) => t.palette.text.primary}}>
      {_}
    </Box>
  ),
  iconType: 'circle',
} as const

export const ChartBarStacker = ({
  data,
  height: _height,
  width: _width,
  sx,
  colors = chartConfig.defaultColors,
  layout = 'vertical',
  hideLegend,
  hideYTicks,
  hideXTicks,
  ...props
}: {
  hideLegend?: boolean
  hideYTicks?: boolean
  hideXTicks?: boolean
  layout?: 'horizontal' | 'vertical'
  colors?: (t: Theme) => string[]
  height?: number | string
  width?: number | string
  data: any[]
} & BoxProps) => {
  const theme = useTheme()
  const {key, ...first} = data[0] ?? {key: undefined}
  const height = _height ?? _width ?? 340
  const width = _width ?? '100%'
  return (
    <Box sx={{position: 'relative', height, width, ...sx}} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout={layout}
          // width={width}
          // height={height}
          data={data}
          margin={{
            // top: 20,
            // right: 30,
            left: layout === 'vertical' ? -40 : undefined,
            // bottom: 5,
          }}
        >
          {/*<CartesianGrid strokeDasharray="3 3"/>*/}
          {layout === 'vertical' ? (
            <>
              <XAxis type="number" domain={[0, 10]} hide={hideXTicks} />
              <YAxis dataKey="key" type="category" width={110} hide={hideYTicks} />
            </>
          ) : (
            <>
              <YAxis type="number" domain={[0, 10]} hide={hideYTicks} />
              <XAxis dataKey="key" type="category" width={110} hide={hideXTicks} />
            </>
          )}
          <Tooltip />
          {!hideLegend && <Legend {...commonLegendProps} />}
          {Object.keys(first).map((k, i) => (
            <Bar key={k} dataKey={k} stackId="a" fill={colors(theme)[i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
