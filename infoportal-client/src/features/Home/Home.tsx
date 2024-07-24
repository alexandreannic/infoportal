import {Box, Grid, useTheme} from '@mui/material'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from 'mui-extension'
import {appFeatures} from '@/features/appFeatureId'
import {FeatureLogo} from '@/features/FeatureLogo'
import {Page} from '@/shared/Page'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {Layout} from '@/shared/Layout'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {styleUtils} from '@/core/theme'
import {Form} from 'enketo-core'
import {modelStr} from '@/features/Home/deleteme'

export const Home = () => {
  return (
    <Layout header={<AppHeader/>}>
      <_Home/>
    </Layout>
  )
}

const _Home = () => {
  const {m} = useI18n()
  const {session, accesses} = useSession()
  const layoutCtx = useLayoutContext()
  const t = useTheme()
  useEffect(() => {
    const formEl = document.querySelector('form.or')
    const data = {
      // required string of the default instance defined in the XForm
      modelStr: modelStr,
      // optional string of an existing instance to be edited
      instanceStr: null,
      // optional boolean whether this instance has ever been submitted before
      submitted: false,
      // optional array of external data objects containing:
      // {id: 'someInstanceId', xml: XMLDocument}
      external: [],
      // optional object of session properties
      // 'deviceid', 'username', 'email', 'phonenumber', 'simserial', 'subscriberid'
      session: {},
    }
    const options = {}
    let form = new Form(formEl, data, options)
    let loadErrors = form.init()
    const el: HTMLButtonElement = document.querySelector('#submit')!
    el.onclick = function () {
      form.validate().then(function (valid: boolean) {
        if (!valid) {
          alert('Form contains errors. Please see fields marked in red.')
        } else {
          const record = form.getDataStr()
          form.resetView()
          form = new Form(formEl, {modelStr: modelStr}, {})
        }
      })
    }
  }, [])
  return (
    <Page>
      <form className="or"/>
      <Box sx={{textAlign: 'center'}}>
        <DRCLogo/>
        <Txt sx={{textAlign: 'center'}} size="title" block>{m.title}</Txt>
        <Txt sx={{textAlign: 'center', mb: 4}} size="big" color="hint" block>{m.subTitle}</Txt>
      </Box>
      {new Obj(seq(appFeatures).groupBy(_ => _.category!))
        .mapValues(features => features.filter(_ => !_.showIf || _.showIf(session, accesses)))
        .filter((_, features) => features.length > 0)
        .entries()
        .map(([category, features]) => (
          <Box key={category} sx={{p: 1, background: styleUtils(t).color.toolbar, mb: 1, borderRadius: (t.shape.borderRadius * 2) + 'px'}}>
            <Txt bold uppercase color="hint" sx={{fontWeight: '600', ml: 1}}>{category}</Txt>
            <Grid container spacing={1}>
              {features!.map(feature => (
                <Grid
                  key={feature.id} item md={2} sm={3} xs={4}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FeatureLogo feature={feature} iconSize={fnSwitch(layoutCtx.currentBreakpointDown, {
                    xl: 70,
                    lg: 65,
                    md: 60,
                    sm: 55,
                    xs: 50,
                  })}/>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
    </Page>
  )
}
