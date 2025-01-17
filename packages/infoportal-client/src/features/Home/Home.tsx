import {Box, BoxProps, darken, Grid, useTheme} from '@mui/material'
import {DRCLogo} from '@/shared/logo/logo'
import {Txt} from '@/shared/Txt'
import {appFeatures} from '@/features/appFeatureId'
import {FeatureLogo} from '@/features/FeatureLogo'
import {Page} from '@/shared/Page'
import React from 'react'
import {useI18n} from '@/core/i18n'
import {useSession} from '@/core/Session/SessionContext'
import {Layout} from '@/shared/Layout'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {styleUtils} from '@/core/theme'
import dynamic from 'next/dynamic'

const Test = dynamic(() => import('./Test').then(_ => _.Test), {
  ssr: false, // Disable server-side rendering
})
export const Home = () => {
  return (
    <Layout header={<AppHeader/>}>
      <_Home/>
    </Layout>
  )
}

export const HomeTitle = ({sx, ...props}: BoxProps) => {
  const {m} = useI18n()
  return (
    <Box {...props} sx={{textAlign: 'center', ...sx}}>
      <DRCLogo/>
      <Txt sx={{textAlign: 'center'}} size="title" block>{m.title}</Txt>
      <Txt sx={{textAlign: 'center'}} size="big" color="hint" block>{m.subTitle}</Txt>
    </Box>
  )
}

const _Home = () => {
  const {m} = useI18n()
  const {session, accesses} = useSession()
  const layoutCtx = useLayoutContext()
  const t = useTheme()
  return (<Test/>)
  return (
    <Page>
      <Box>
        <HomeTitle sx={{mt: 2, mb: 2}}/>
      </Box>
      {new Obj(seq(appFeatures).groupBy(_ => _.category!))
        .mapValues(features => features.filter(_ => !_.showIf || _.showIf(session, accesses)))
        .filter((_, features) => features.length > 0)
        .entries()
        .map(([category, features]) => (
          <Box key={category} sx={{p: 1, background: darken(styleUtils(t).color.toolbar, .02), mb: 1, borderRadius: (t.shape.borderRadius * 2) + 'px'}}>
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
