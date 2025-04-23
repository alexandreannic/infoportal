import {styled, Tooltip, tooltipClasses, TooltipProps} from '@mui/material'
import * as React from 'react'
import {ReactNode} from 'react'
import {Txt} from '@/shared/Txt'

export const LightTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[3],
    fontSize: 11,
  },
}))

export const TooltipRow = ({label, hint, value}: {label?: ReactNode; hint?: ReactNode; value: ReactNode}) => {
  return (
    <>
      {label && (
        <Txt block sx={{mt: 0.5}}>
          {label}
        </Txt>
      )}
      <Txt size="big" sx={{display: 'flex', justifyContent: 'space-between'}}>
        {hint && <Txt color="hint">{hint}</Txt>}
        <Txt bold color="primary" sx={{ml: 1}}>
          {value}
        </Txt>
      </Txt>
    </>
  )
}
