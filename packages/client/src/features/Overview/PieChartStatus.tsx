import {Ip} from '@infoportal/api-sdk'
import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {statusConfig} from '@infoportal/client-core'
import {toPercent} from 'infoportal-common'
import {Core} from '@/shared'

export const PieChartStatus = ({
  percent,
  validation,
  ...props
}: {percent: number; validation: Ip.Submission.Validation} & BoxProps) => {
  const {m} = useI18n()
  const t = useTheme()
  const type = Ip.Submission.validationToStatus[validation]
  const style = statusConfig[type ?? 'disabled']
  return (
    <Box {...props}>
      <Box sx={{position: 'relative'}}>
        <Box
          sx={{
            zIndex: 1000,
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{color: style.color(t)}}>{style.icon}</Icon>
        </Box>
        <Core.ChartPie percent={percent} color={style.color(t)} size={55} sx={{margin: 'auto'}} />
      </Box>
      <Core.Txt block bold size="big" sx={{mt: 0.5, lineHeight: 1, textAlign: 'center'}}>
        {toPercent(percent)}
      </Core.Txt>
      <Core.Txt block color="hint" size="small" sx={{textAlign: 'center'}}>
        {validation ?? m.blank}
      </Core.Txt>
    </Box>
  )
}
