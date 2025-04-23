import {CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import * as React from 'react'
import {ReactNode, useState} from 'react'
import {Box, BoxProps, Checkbox, Theme, useTheme} from '@mui/material'
import {map, Obj} from '@axanc/ts-utils'
import {styleUtils} from '@/core/theme'
import {chartConfig} from '@/shared/charts/chartConfig'
import {formatLargeNumber} from '@/core/i18n/localization/en'
import {commonLegendProps} from '@/shared/charts/ChartBarStacked'
import {addMonths, format, isBefore, parse} from 'date-fns'

export interface ChartLineProps extends Pick<BoxProps, 'sx'> {
  colorsByKey?: (t: Theme) => Record<string, string>
  colors?: (t: Theme) => string[]
  /**
   * This props may be needed because sometimes label are not showing because of animation.
   * https://github.com/recharts/recharts/issues/1135
   */
  disableAnimation?: boolean
  hideLabelToggle?: boolean
  translation?: Record<string, string>
  height?: number
  hideYTicks?: boolean
  hideXTicks?: boolean
  hideLegend?: boolean
  percent?: boolean
  loading?: boolean
  distinctYAxis?: boolean
  children?: ReactNode
  data?: ChartLineData[]
  fixMissingMonths?: boolean
}

export type ChartLineData = {
  name: string
} & Record<string, number>

const addMissingKeyMonths = <T extends ChartLineData[]>(arr: T): T => {
  // const monthsList = Array.from({length: differenceInMonths(new Date(period.end), new Date(period.start)) + 1}, (_, i) =>
  //   format(addMonths(new Date(period.start), i), 'yyyy-MM')
  // )
  const result: ChartLineData[] = []
  const otherKeys = Obj.keys(arr[0] ?? {}).filter((_) => _ !== 'name')
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i])
    if (i < arr.length - 1) {
      let currentDate = parse(arr[i].name, 'yyyy-MM', new Date())
      let nextDate = parse(arr[i + 1].name, 'yyyy-MM', new Date())

      while (isBefore(addMonths(currentDate, 1), nextDate)) {
        currentDate = addMonths(currentDate, 1)
        const newItem: any = {name: format(currentDate, 'yyyy-MM')}
        otherKeys.forEach((k) => {
          newItem[k] = 0
        })
        result.push(newItem)
      }
    }
  }
  return result as T
}

export const ChartLine = ({
  data,
  loading,
  children,
  sx,
  colorsByKey,
  colors = chartConfig.defaultColors,
  translation,
  hideYTicks = true,
  hideXTicks,
  distinctYAxis,
  hideLegend,
  fixMissingMonths,
  disableAnimation,
  hideLabelToggle,
  percent,
  height = 220,
}: ChartLineProps) => {
  const theme = useTheme()
  const lines = Object.keys(data?.[0] ?? {}).filter((_) => _ !== 'name')
  const [showCurves, setShowCurves] = useState<boolean[]>(new Array(lines.length).fill(false))

  const cleanedData = React.useMemo(() => {
    if (fixMissingMonths && data) return addMissingKeyMonths(data)
    return data
  }, [data, fixMissingMonths])
  return (
    <>
      {!hideLabelToggle && (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          {lines.map((c, i) => (
            <Checkbox
              key={c}
              checked={showCurves[i]}
              onChange={(e) =>
                setShowCurves((prev) => prev.map((_, index) => (i === index ? e.currentTarget.checked : _)))
              }
              sx={{
                '& svg': {
                  fill: colorsByKey ? colorsByKey(theme)[c] : (colors(theme)[i] ?? colors(theme)[0] + ' !important'),
                },
              }}
            />
          ))}
        </Box>
      )}
      <Box sx={{height, ml: hideYTicks ? 0 : -2, mb: hideXTicks ? -4 : 0, ...sx}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart height={height - 60} data={cleanedData}>
            <CartesianGrid strokeDasharray="1 1" strokeWidth={0.5} vertical={false} />
            {!hideLegend && <Legend {...commonLegendProps} />}
            <XAxis dataKey="name" />
            {distinctYAxis ? (
              lines.map((_) => <YAxis hide={hideYTicks} key={_} yAxisId={_} dataKey={_} />)
            ) : (
              <YAxis hide={hideYTicks} />
            )}
            <YAxis hide={hideYTicks} />
            <Tooltip
              wrapperStyle={{zIndex: 100, borderRadius: 4}}
              formatter={(_) => (percent ? `${_}` : formatLargeNumber(_ as any, {maximumFractionDigits: 2}))}
            />
            {lines.map((line, i) => (
              <Line
                isAnimationActive={!disableAnimation}
                key={line}
                name={map(translation, (_) => _[line]) ?? line}
                type="monotone"
                yAxisId={distinctYAxis ? line : undefined}
                dataKey={line}
                dot={false}
                stroke={colorsByKey?.(theme)[line] ?? colors(theme)[i] ?? colors(theme)[0]}
                strokeWidth={2}
              >
                {showCurves[i] && (
                  <LabelList
                    dataKey={lines[i]}
                    position="top"
                    style={{
                      fill: colorsByKey?.(theme)[line] ?? colors(theme)[i] ?? colors(theme)[0],
                      fontSize: styleUtils(theme).fontSize.small,
                    }}
                  />
                )}
              </Line>
            ))}
            {children}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
}
