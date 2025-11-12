import {Page} from '@/shared/Page'
import {CenteredContent} from '@/shared/CenteredContent'
import React from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Link} from '@tanstack/react-router'
import {Icon} from '@mui/material'
import {Core} from '@/shared'
import {fnSwitch} from '@axanc/ts-utils'

type ErrorVariant = 'forbidden' | 'not_found'

export const PageError = ({variant = 'not_found'}: {variant?: ErrorVariant}) => {
  return (
    <Page>
      <CenteredContent>
        <ErrorContent />
      </CenteredContent>
    </Page>
  )
}

export function ErrorContent({sx, variant = 'not_found', ...props}: Core.FenderProps & {variant?: ErrorVariant}) {
  const {m} = useI18n()
  const title = fnSwitch(variant, {
    not_found: m.noAccess,
    forbidden: m.pageNotExists,
  })
  return (
    <Core.Fender size="big" title={title} sx={sx} {...props}>
      <Link to="/">
        <Core.Btn variant="contained" icon="home" sx={{mt: 2}} endIcon={<Icon color="disabled">arrow_right_alt</Icon>}>
          {m.home}
        </Core.Btn>
      </Link>
    </Core.Fender>
  )
}
