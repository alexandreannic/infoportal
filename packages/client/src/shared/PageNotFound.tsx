import {Page} from '@/shared/Page'
import {CenteredContent} from '@/shared/CenteredContent'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {Link} from '@tanstack/react-router'
import {Icon} from '@mui/material'
import {Core} from '@/shared'

export const PageNotFound = () => {
  const {m} = useI18n()
  return (
    <Page>
      <CenteredContent>
        <Core.Fender size="big" title={m.pageNotExists}>
          <Link to="/">
            <Core.Btn
              variant="contained"
              icon="home"
              sx={{mt: 2}}
              endIcon={<Icon color="disabled">arrow_right_alt</Icon>}
            >
              {m.home}
            </Core.Btn>
          </Link>
        </Core.Fender>
      </CenteredContent>
    </Page>
  )
}
