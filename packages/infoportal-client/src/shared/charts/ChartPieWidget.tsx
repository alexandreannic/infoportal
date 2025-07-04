import {alpha, Box, Icon, Tooltip, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from '@/shared/Txt'
import {ChartPie} from '@/shared/charts/ChartPie'
import {SlidePanelTitle} from '../PdfLayout/PdfSlide'
import {PanelProps} from '../Panel/Panel'
import {useI18n} from '@/core/i18n'
import {LightTooltip, TooltipRow} from '@/shared/LightTooltip'
import {toPercent} from 'infoportal-common'

const previousPeriodDeltaDays = 90

export interface ChartPieIndicatorProps extends Omit<PanelProps, 'title'> {
  fractionDigits?: number
  dense?: boolean
  noWrap?: boolean
  titleIcon?: string
  title?: ReactNode
  value: number
  base: number
  showValue?: boolean
  showBase?: boolean
  evolution?: number
  tooltip?: string
  color?: string
  hideIndicatorTooltip?: boolean
}

export const ChartPieWidget = ({
  titleIcon,
  title,
  evolution,
  noWrap,
  children,
  dense,
  value,
  showValue,
  showBase,
  base,
  hideIndicatorTooltip,
  tooltip = `Compare to ${previousPeriodDeltaDays} days ago`,
  fractionDigits = 0,
  sx,
  color,
  ...props
}: ChartPieIndicatorProps) => {
  const {m, formatLargeNumber} = useI18n()
  const fontSize = dense ? '1.6em' : '1.7em'
  return (
    <LightTooltip
      title={
        <>
          <Txt size="big" block bold>
            {title}
          </Txt>
          <Box sx={{mt: 0.5}}>
            <TooltipRow
              hint={
                <>
                  {formatLargeNumber(value)} / {formatLargeNumber(base)}
                </>
              }
              value={toPercent(value / base)}
            />
          </Box>
        </>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ...sx,
        }}
      >
        <Donut percent={value / base} size={dense ? 45 : 50} color={color} />
        <Box sx={{ml: dense ? 1 : 1.5}}>
          <SlidePanelTitle icon={titleIcon} noWrap={noWrap} sx={{mb: 0}}>
            {title}
          </SlidePanelTitle>
          <Box sx={{display: 'inline-flex', lineHeight: 1, alignItems: 'flex-start'}}>
            <Txt bold sx={{fontSize, letterSpacing: '1px'}}>
              {renderPercent(value / base, true, fractionDigits)}
            </Txt>
            {evolution && (
              <>
                <Txt
                  sx={{
                    fontSize,
                    color: t => (evolution > 0 ? t.palette.success.main : t.palette.error.main),
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon sx={{ml: 1}} fontSize="inherit">
                    {evolution > 0 ? 'north' : 'south'}
                  </Icon>
                  <Box sx={{ml: 0.25}}>
                    {evolution >= 0 && '+'}
                    {(evolution * 100).toFixed(Math.abs(evolution) > 0.1 ? fractionDigits : 1)}
                  </Box>
                  {children}
                </Txt>
                {!hideIndicatorTooltip && (
                  <Tooltip title={tooltip}>
                    <Icon sx={{fontSize: '15px !important'}} color="disabled">
                      info
                    </Icon>
                  </Tooltip>
                )}
              </>
            )}
            {!!showValue && (
              <Txt color="disabled" sx={{ml: 0.5, fontWeight: '400'}}>
                <span style={{fontWeight: '400', fontSize}}>&nbsp;{formatLargeNumber(value)}</span>
                {!!showBase && <span style={{fontWeight: '400', fontSize: '1.2em'}}>/{formatLargeNumber(base)}</span>}
                {/*<Txt color="disabled" sx={{fontSize: '1.4em', fontWeight: 'lighter'}}>)</Txt>*/}
              </Txt>
            )}
          </Box>
        </Box>
      </Box>
    </LightTooltip>
  )
}

const renderPercent = (value: number, isPercent?: boolean, fractionDigits = 1) => {
  if (isNaN(value)) return '-'
  return isPercent ? (value * 100).toFixed(fractionDigits) + '%' : value
}

const Donut = ({percent = 0, size = 55, color}: {percent?: number; size?: number; color?: string}) => {
  const theme = useTheme()
  return (
    <ChartPie
      stroke="none"
      hideTooltip={true}
      outerRadius={size / 2}
      innerRadius={size / 2 - 9}
      height={size}
      width={size}
      hideLabel
      data={{
        value: Math.round(percent * 100) / 100,
        rest: 1 - percent,
      }}
      colors={{
        value: color ?? theme.palette.primary.main,
        rest: alpha(color ?? theme.palette.primary.main, 0.16),
      }}
      m={{
        value: 'ukrainian',
        rest: 'other',
      }}
    />
  )
}
