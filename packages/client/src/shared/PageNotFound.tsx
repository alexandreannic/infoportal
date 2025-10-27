import {Page} from '@/shared/Page'
import {CenteredContent} from '@/shared/CenteredContent'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Link} from '@tanstack/react-router'
import {Icon} from '@mui/material'
import {Core} from '@/shared'

export const PageNotFound = () => {
  return (
    <Page>
      <CenteredContent>
        <NotFoundContent />
      </CenteredContent>
    </Page>
  )
}

export function NotFoundContent({sx, ...props}: Core.FenderProps) {
  const {m} = useI18n()
  return (
    <Core.Fender size="big" title={m.pageNotExists} sx={sx} {...props}>
      <Link to="/">
        <Core.Btn variant="contained" icon="home" sx={{mt: 2}} endIcon={<Icon color="disabled">arrow_right_alt</Icon>}>
          {m.home}
        </Core.Btn>
      </Link>
    </Core.Fender>
  )
}
