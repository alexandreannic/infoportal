import {Box, BoxProps, useTheme} from '@mui/material'
import {seq} from '@axanc/ts-utils'
import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import React from 'react'
import {commonLegendProps} from '@/shared/charts/ChartBarStacked'

export const ChartBarStackedSplit = ({
  data,
  height,
  width,
  sx,
  ...props
}: {
  height?: number | string
  width?: number | string
  data: any[]
} & BoxProps) => {
  const theme = useTheme()
  const colors = [
    '#FF4136',
    '#FF851B',
    '#FFDC00',
    '#3D9970',
    '#0074D9',
    '#B10DC9',
    '#FF0066',
    '#F012BE',
    '#FF6F61',
    '#7FDBFF',
  ]
  const allKeys = seq(data.flatMap(({key, ...other}) => Object.keys(other))).distinct((_) => _)
  height = height ?? width ?? 340
  width = width ?? '100%'
  return (
    <Box sx={{position: 'relative', height, width, ...sx}} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          // width={width}
          // height={height}
          data={data}
          // margin={{
          //   top: 20,
          //   right: 30,
          //   left: 20,
          //   bottom: 5,
        >
          {/*<CartesianGrid strokeDasharray="3 3"/>*/}
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="key" type="category" width={110} />
          <Tooltip />
          <Legend {...commonLegendProps} />
          {allKeys.map((k, i) => (
            <Bar key={k} dataKey={k} stackId={k} fill={colors[i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
