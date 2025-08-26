import {Page} from '@/shared/Page'
import {CenteredContent} from '@/shared/CenteredContent'
import {Fender} from '@/shared/Fender'
import React from 'react'
import {IpBtn} from '../../../infoportal-client-core/src/Btn.js'
import {useI18n} from '@/core/i18n'
import {Link} from '@tanstack/react-router'
import {Icon} from '@mui/material'

export const PageNotFound = () => {
  const {m} = useI18n()
  return (
    <Page>
      <CenteredContent>
        <Fender size="big" title={m.pageNotExists}>
          <Link to="/">
            <IpBtn variant="contained" icon="home" sx={{mt: 2}} endIcon={<Icon color="disabled">arrow_right_alt</Icon>}>
              {m.home}
            </IpBtn>
          </Link>
        </Fender>
      </CenteredContent>
    </Page>
  )
}
