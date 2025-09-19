import {Box, Icon, useTheme} from '@mui/material'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'

export function ReadonlyAction() {
  const {m} = useI18n()
  const t = useTheme()
  return (
    <Box display="flex" alignItems="center" sx={{color: t.vars!.palette.text.disabled}}>
      <Icon sx={{mr: 1}}>lock</Icon>
      {m.readonly}
    </Box>
  )
}
