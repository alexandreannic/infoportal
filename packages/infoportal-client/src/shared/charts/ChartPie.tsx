import {Box, SxProps, Theme, useTheme} from '@mui/material'
// @ts-ignore
import {Cell, Pie, PieChart, PieChartProps, PieLabelRenderProps, ResponsiveContainer, Tooltip} from 'recharts'
import React, {ReactNode} from 'react'
import {toPercent} from 'infoportal-common'
import {Obj} from '@axanc/ts-utils'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.01) {
    return <text />
  }
  return (
    <text x={x} y={y} fill="white" fontWeight="bold" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomizedLabel = ({x, y, fill, value, percent, textAnchor}: PieLabelRenderProps) => {
  return (
    <text x={x} y={y} fontSize="16" fontFamily="sans-serif" fill={fill} textAnchor={textAnchor}>
      {(percent! * 100).toFixed(1)}%
    </text>
  )
}

export const ChartPie = <T extends Record<string, number>>({
  sx,
  height,
  width,
  data,
  children,
  colors,
  m,
  outerRadius,
  innerRadius,
  hideLabel,
  valueInMiddle,
  hideTooltip,
  ...props
}: {
  data: T
  outerRadius?: number
  innerRadius?: number
  m: Record<keyof T, string>
  colors?: Partial<Record<keyof T, string>>
  height?: number
  width?: number
  hideTooltip?: boolean
  hideLabel?: boolean
  valueInMiddle?: string
  children?: ReactNode
  sx?: SxProps<Theme>
} & PieChartProps) => {
  const theme = useTheme()
  height = height ?? width ?? 200
  width = width ?? height ?? 200
  return (
    <Box sx={{position: 'relative', height, width, ...sx}} {...props}>
      {valueInMiddle && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25em',
            fontWeight: (t) => t.typography.fontWeightBold,
          }}
        >
          {valueInMiddle}
        </Box>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {!hideTooltip && <Tooltip formatter={(_) => toPercent(+_)} />}
          {children}
          <Pie
            data={Obj.toArray(data).map((_) => {
              _.name = m[_.name]
              return _
            })}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey="value"
            fill={theme.palette.primary.main}
            label={hideLabel ? false : renderCustomizedLabel}
            {...props}
            // label={renderCustomizedLabel(data)}
          >
            {colors && Object.keys(colors).map((k) => <Cell key={k} fill={colors[k] ?? theme.palette.primary.main} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
