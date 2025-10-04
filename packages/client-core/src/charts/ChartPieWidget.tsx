import {Box, Icon, Tooltip} from '@mui/material'
import React, {ReactNode, useEffect, useRef} from 'react'
import {toPercent, uppercaseHandlingAcronyms} from 'infoportal-common'
import {PanelProps} from '../ui/Panel/Panel'
import {LightTooltip, TooltipRow} from '../ui/LightTooltip'
import {Txt, TxtProps} from '../ui/Txt'
import {ChartPie} from './ChartPie'
import {useI18n} from '@infoportal/client-i18n'
import {ComparativeValue} from './ComparativeValue'

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

export const ChartPieTitle = ({
  icon,
  uppercase = true,
  dangerouslySetInnerHTML,
  sx,
  children,
  ...props
}: {icon?: string} & TxtProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = uppercaseHandlingAcronyms(ref.current.innerHTML)
  }, [children])

  return (
    <Txt
      block
      // size="big"
      bold
      sx={{display: 'flex', alignItems: 'center', mb: 0.5, fontSize: '1.05em', lineHeight: 1.15, mr: -1, ...sx}}
      color="hint"
      {...props}
    >
      {icon && (
        <Icon color="disabled" sx={{mr: 0.5}}>
          {icon}
        </Icon>
      )}
      <div ref={ref as any}>
        {dangerouslySetInnerHTML ? <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} /> : children}
      </div>
    </Txt>
  )
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
  const {formatLargeNumber} = useI18n()
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
          <ChartPieTitle icon={titleIcon} noWrap={noWrap} sx={{mb: 0}}>
            {title}
          </ChartPieTitle>
          <Box sx={{display: 'inline-flex', lineHeight: 1, alignItems: 'flex-start'}}>
            <Txt bold sx={{fontSize, letterSpacing: '1px'}}>
              {renderPercent(value / base, true, fractionDigits)}
            </Txt>
            {evolution && (
              <ComparativeValue
                sx={{fontSize}}
                value={evolution * 100}
                tooltip={hideIndicatorTooltip ? undefined : tooltip}
                fractionDigits={fractionDigits}
              />
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
