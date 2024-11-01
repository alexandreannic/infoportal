import {NavLink, Route, Routes} from 'react-router-dom'
import {Sidebar, SidebarBody, SidebarHr, SidebarItem} from '@/shared/Layout/Sidebar'
import {Layout} from '@/shared/Layout'
import {useI18n} from '@/core/i18n'
import {MpcaProvider, useMpcaContext} from './MpcaContext'
import React, {useMemo} from 'react'
import {MpcaData} from '@/features/Mpca/MpcaData/MpcaData'
import {MpcaDashboard} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {WfpDeduplicationData} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {useSession} from '@/core/Session/SessionContext'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {NoFeatureAccessPage} from '@/shared/NoFeatureAccessPage'
import {IpBtn} from '@/shared/Btn'
import {Box, Tooltip} from '@mui/material'
import {Txt} from '@/shared/Txt'
import {useReactRouterDefaultRoute} from '@/core/useReactRouterDefaultRoute'

export const mpcaIndex = {
  basePath: '/mpca',
  siteMap: {
    deduplication: '/deduplication',
    data: '/data',
    dashboard: '/dashboard',
    // form: (id = ':id') => '/form/' + id,
  }
}

const MpcaSidebar = () => {
  const path = (page: string) => '' + page
  const {m, formatLargeNumber} = useI18n()
  const ctx = useMpcaContext()
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarItem sx={{pr: 0}} iconEnd={
          <Tooltip placement="right" title={m.mpca.pullLastDataDesc + ' ' + m.timeConsumingOperation}>
            <IpBtn onClick={ctx.refresh.call} loading={ctx.refresh.loading} icon="cloud_sync">{m.pullLast}</IpBtn>
          </Tooltip>
        }>
          <Box>
            <Txt color="hint" block uppercase sx={{fontSize: '0.75rem'}}>{m.data}</Txt>
            <Txt color="default">{formatLargeNumber(ctx.data?.length)}</Txt>
          </Box>
        </SidebarItem>
        <SidebarHr/>
        <NavLink to={path(mpcaIndex.siteMap.dashboard)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="equalizer" active={isActive}>{m.dashboard}</SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(mpcaIndex.siteMap.data)}>
          {({isActive, isPending}) => (
            <SidebarItem icon="table_chart" active={isActive}>{m.data}</SidebarItem>
          )}
        </NavLink>
        {/*<NavLink to={path(mpcaModule.siteMap.paymentTools)}>*/}
        {/*  <SidebarItem icon="savings">{m.mpcaDb.paymentTools}</SidebarItem>*/}
        {/*</NavLink>*/}
        {/*<NavLink to={path(mpcaModule.siteMap.deduplication)}>*/}
        {/*  <SidebarItem icon="join_left">{m.wfpDeduplication}</SidebarItem>*/}
        {/*</NavLink>*/}
      </SidebarBody>
    </Sidebar>
  )
}

export const Mpca = () => {
  useReactRouterDefaultRoute(mpcaIndex.siteMap.dashboard)
  const {session, accesses} = useSession()
  const access = useMemo(() => !!appFeaturesIndex.mpca.showIf?.(session, accesses), [accesses])
  if (!access) {
    return (
      <NoFeatureAccessPage/>
    )
  }
  return (
    <MpcaProvider>
      <Layout
        title={appFeaturesIndex.mpca.name}
        sidebar={<MpcaSidebar/>}
        header={<AppHeader id="app-header"/>}
      >
        <Routes>
          <Route path={mpcaIndex.siteMap.dashboard} element={<MpcaDashboard/>}/>
          <Route path={mpcaIndex.siteMap.deduplication} element={<WfpDeduplicationData/>}/>
          <Route path={mpcaIndex.siteMap.data} element={<MpcaData/>}/>
        </Routes>
      </Layout>
    </MpcaProvider>
  )
}

