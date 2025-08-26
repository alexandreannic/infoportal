import {Box, Icon, Tooltip} from '@mui/material'
import React, {ReactNode} from 'react'
import {SlidePanelTitle} from 'infoportal-client/src/shared/PdfLayout/PdfSlide.js'
import {useI18n} from 'infoportal-client/src/core/i18n/index.js'
import {toPercent} from 'infoportal-common'
import {PanelProps} from '../ui/Panel/Panel.js'
import {LightTooltip, TooltipRow} from '../LightTooltip.js'
import {Txt} from '../ui/Txt.js'
import {ChartPie} from './ChartPie.js'

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
        <ChartPie percent={value / base} size={dense ? 45 : 50} color={color} />
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
                    color: t => (evolution > 0 ? t.vars.palette.success.main : t.vars.palette.error.main),
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
