import {MetaDashboardProvider, useMetaContext} from '@/app/meta/MetaContext'
import React from 'react'
import {MetaDashboard} from '@/app/meta/dashboard/Page'
import {Layout} from '@/shared/Layout'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {MetaSidebar} from '@/app/meta/MetaSidebar'
import {Navigate, Route, Routes} from 'react-router-dom'
import {MetaTable} from '@/app/meta/data/Page'

export const Meta = () => {
  return (
    <MetaDashboardProvider>
      <_Meta/>
    </MetaDashboardProvider>
  )
}

export const metaSiteMap = {
  basePath: 'meta-dashboard',
  routes: {
    dashboard: '/dashboard',
    data: '/data',
  },
}

const _Meta = () => {
  const ctx = useMetaContext()
  return (
    <Layout
      title={appFeaturesIndex.metaDashboard.name}
      loading={ctx.fetcher.loading}
      sidebar={<MetaSidebar/>}
    >
      {ctx.fetcher.get && (
        <Routes>
          <Route index element={<Navigate to={metaSiteMap.routes.dashboard}/>}/>
          <Route path={metaSiteMap.routes.dashboard} element={<MetaDashboard/>}/>
          <Route path={metaSiteMap.routes.data} element={<MetaTable/>}/>
        </Routes>
      )}
    </Layout>
  )
}