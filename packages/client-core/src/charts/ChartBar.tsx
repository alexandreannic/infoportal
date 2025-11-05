import * as React from 'react'
import {ReactNode, useMemo, useState} from 'react'
import {Box, Checkbox, Icon, TooltipProps, useTheme} from '@mui/material'
import {useTimeout} from '@axanc/react-hooks'
import {Obj, seq} from '@axanc/ts-utils'
import {PartialOnly, toPercent} from 'infoportal-common'
import {Txt} from '../ui/Txt.js'
import {useI18n} from '@infoportal/client-i18n'
import {alphaVar} from '../core/theme.js'
import {LightTooltip, TooltipRow} from '../ui/LightTooltip.js'
import {ComparativeValue} from './ComparativeValue.js'
import {ChartValue} from './ChartBuilder.js'
export interface BarChartData extends PartialOnly<ChartValue, 'base' | 'ratio'> {
  color?: string
  disabled?: boolean
}

interface Props<K extends string> {
  checked?: K[]
  showCheckBox?: boolean
  onClickData?: (_: K, item: BarChartData) => void
  showLastBorder?: boolean
  hideValue?: boolean
  dense?: boolean
  // base?: number
  icons?: Record<K, string>
  labels?: Record<K, ReactNode>
  descs?: Record<K, ReactNode>
  data?: Record<K, BarChartData>
  barHeight?: number
}

export const ChartBar = <K extends string>(props: Props<K>) => {
  const {m} = useI18n()
  const t = useTheme()
  return props.data ? (
    <ChartBarContent {...props} data={props.data!} />
  ) : (
    <Box
      sx={{
        textAlign: 'center',
        mt: 2,
        color: t.vars.palette.text.disabled,
      }}
    >
      <Icon sx={{fontSize: '3em !important'}}>block</Icon>
      <Box>{m.noDataAtm}</Box>
    </Box>
  )
}

export const ChartBarContent = <K extends string>({
  data,
  // base,
  icons,
  labels,
  descs,
  barHeight = 2,
  hideValue,
  checked,
  showCheckBox,
  onClickData,
  showLastBorder,
}: Omit<Props<K>, 'data'> & {data: NonNullable<Props<K>['data']>}) => {
  const t = useTheme()
  const {values, maxRatio, maxValue, sumValue} = useMemo(() => {
    const values = new Obj(data).mapValues((v, key) => ({...v, key})).values()
    const sumValue = seq(values).sum(_ => _.value)
    const safeValues = values.map(_ => {
      const base = _.base ?? sumValue
      const ratio = _.ratio ?? _.value / base
      return {..._, base, ratio}
    })
    return {
      values: safeValues,
      sumValue,
      maxValue: Math.max(...safeValues.map(_ => _.value)),
      maxRatio: Math.max(...safeValues.map(_ => _.ratio)),
    }
  }, [data])
  const [appeared, setAppeared] = useState<boolean>(false)
  useTimeout(() => setAppeared(true), 200)

  const {m, formatLargeNumber} = useI18n()

  return (
    <Box sx={{overflow: 'hidden'}}>
      {Obj.keys(data).length === 0 && (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Icon color="disabled" sx={{fontSize: 40, mb: 1}}>
            block
          </Icon>
          <Txt block color="disabled">
            {m.noDataAtm}
          </Txt>
        </Box>
      )}
      {values.map((item, i) => {
        const percentOfMax = 100 * (item.base ? item.ratio / maxRatio : item.value / maxValue)
        const k = item.key
        const isSelected = checked?.includes(k)
        return (
          <TooltipWrapper item={item} base={item.base ?? sumValue} sumValue={sumValue} key={i}>
            <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => onClickData?.(k, item)}>
              {icons && (
                <Icon color="disabled" sx={{mr: 1}}>
                  {icons[k]}
                </Icon>
              )}
              <Box sx={{flex: 1, minWidth: 0}}>
                <Box
                  sx={{
                    mx: 0,
                    ...(item.disabled
                      ? {
                          mb: -1,
                          mt: 2,
                        }
                      : {
                          mb: i === values.length - 1 ? 0 : 1,
                          borderBottom:
                            i === values.length - 1 && !showLastBorder ? 'none' : `1px solid ${t.vars.palette.divider}`,
                          transition: t.transitions.create('background'),
                          '&:hover': {
                            background: alphaVar(item.color ?? t.vars.palette.primary.main, 0.18),
                          },
                          ...(isSelected && {
                            background: alphaVar(item.color ?? t.vars.palette.primary.main, 0.14),
                          }),
                        }),
                  }}
                >
                  <Box
                    sx={{
                      mt: 0.25,
                      pt: 0.25,
                      pb: 0,
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      mb: barHeight + 'px',
                    }}
                  >
                    <Txt sx={{p: 0, pr: 0.5, flex: 1}} truncate>
                      <Txt block truncate>
                        {showCheckBox && (
                          <Checkbox sx={{padding: 0.5, mr: 1}} size="small" checked={checked?.includes(k)} />
                        )}
                        {(labels && labels[k]) ?? item.label ?? k}
                      </Txt>
                      {(item.desc || descs) && (
                        <Txt block color="hint" truncate size="small">
                          {item.desc}
                          {(descs && descs[k]) ?? ''}
                        </Txt>
                      )}
                    </Txt>
                    {!item.disabled && (
                      <Box sx={{display: 'flex', textAlign: 'right'}}>
                        {!hideValue && (
                          <Txt color="hint" sx={{minWidth: 52, flex: 1, mr: 0.5}}>
                            {formatLargeNumber(item.value)}
                          </Txt>
                        )}
                        {item.delta !== undefined && <ComparativeValue sx={{width: 66, mr: 0.5}} value={item.delta} />}
                        <Txt
                          sx={{
                            flex: 1,
                            minWidth: 52,
                            color: t.vars.palette.primary.main,
                            fontWeight: t.typography.fontWeightBold,
                          }}
                        >
                          {(item.ratio * 100).toFixed(1)}%
                        </Txt>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      transition: t.transitions.create('width', {duration: 800, delay: 0}),
                      width: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      borderBottom: `${barHeight}px solid ${t.vars.palette.primary.main}`,
                    }}
                    style={{
                      width: appeared ? `calc(${percentOfMax * 0.9}%)` : 0,
                      color: item.color,
                      borderColor: item.color,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </TooltipWrapper>
        )
      })}
    </Box>
  )
}

const TooltipWrapper = ({
  children,
  item,
  base,
  sumValue,
  ...props
}: Omit<TooltipProps, 'title'> & {
  base: number
  sumValue: number
  item: BarChartData
}) => {
  const {formatLargeNumber, m} = useI18n()
  if (item.disabled) return children
  return (
    <LightTooltip
      {...props}
      open={item.disabled ? false : undefined}
      title={
        <>
          <Txt size="big" block bold>
            {item.label}
          </Txt>
          {item.desc && (
            <Txt block color="hint">
              {item.desc}
            </Txt>
          )}
          <Box sx={{mt: 0.5}}>
            <TooltipRow
              hint={
                <>
                  {formatLargeNumber(item.value)} / {formatLargeNumber(base)}
                </>
              }
              value={toPercent(item.value / base)}
            />
            {base !== sumValue && (
              <TooltipRow
                label={m.comparedToTotalAnswers}
                hint={
                  <>
                    {formatLargeNumber(item.value)} / {formatLargeNumber(sumValue)}
                  </>
                }
                value={toPercent(item.value / sumValue)}
              />
            )}
            {/*<TooltipRow label="% of answers" value={Math.ceil(percentOfAll) + ' %'}/>*/}
            {/*{sumValue !== percentOfBase && (*/}
            {/*  <TooltipRow label="% of peoples" value={Math.ceil(percentOfBase) + ' %'}/>*/}
            {/*)}*/}
          </Box>
        </>
      }
    >
      {children}
    </LightTooltip>
  )
}
