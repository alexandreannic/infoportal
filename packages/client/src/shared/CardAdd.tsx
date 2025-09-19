import {Box, ButtonBase, ButtonBaseProps, Icon, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '.'
import {ReactNode} from 'react'

export type CardAddProps = ButtonBaseProps & {
  title?: ReactNode
  icon: string
}

export const CardAdd = ({icon, title, sx, ...props}: CardAddProps) => {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <ButtonBase
      {...props}
      sx={{
        borderRadius: t.vars.shape.borderRadius,
        minHeight: 200,
        height: '100%',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'none',
        border: `1px dashed ${t.vars.palette.divider}`,
        // transition: t.transitions.create(''),
        // '&:hover': {
        //   boxShadow: t.vars.shadows[2],
        // },
        ...sx,
      }}
    >
      <Icon sx={{mb: 1, fontSize: 60, color: t.vars.palette.text.secondary}}>{icon}</Icon>
      <Box display="flex" alignItems="center" mt={1}>
        <Icon fontSize="medium">add</Icon>
        <Core.Txt bold size="big">
          {title ?? m.create}
        </Core.Txt>
      </Box>
    </ButtonBase>
  )
}
