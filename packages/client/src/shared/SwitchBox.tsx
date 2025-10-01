import {Box, ButtonBase, FormControlLabel, Icon, Switch, SwitchProps, useTheme} from '@mui/material'
import {ReactNode} from 'react'
import {styleUtils} from '@infoportal/client-core'

export const SwitchBox = ({icon, label, sx, ...props}: SwitchProps & {icon?: string; label: ReactNode}) => {
  const t = useTheme()

  return (
    <ButtonBase sx={{width: '100%', display: 'block', ...sx}}>
      <FormControlLabel
        control={<Switch {...props} />}
        label={
          <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
            {icon && <Icon sx={{mr: 1, color: t.vars.palette.text.secondary}}>{icon}</Icon>}
            <Box sx={{flex: 1}}>{label}</Box>
          </Box>
        }
        sx={{
          width: '100%',
          m: 0,
          px: 1,
          borderRadius: styleUtils(t).color.input.default.borderRadius,
          minHeight: styleUtils(t).color.input.default.minHeight,
          border: '1px solid',
          borderColor: t.vars.palette.divider,
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        labelPlacement="start"
      />
    </ButtonBase>
  )
}
