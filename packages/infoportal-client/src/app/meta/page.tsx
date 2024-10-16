'use client'
import React, {ReactNode} from 'react'
import {Layout} from '@/shared/Layout'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {MetaDashboardProvider, useMetaContext} from '@/app/meta/MetaContext'
import {MetaSidebar} from '@/app/meta/MetaSidebar'
import {ProtectRoute} from '@/core/Session/SessionContext'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ProtectRoute>
      <MetaDashboardProvider>
        <Body>{children}</Body>
      </MetaDashboardProvider>
    </ProtectRoute>
  )
}

export const Body = ({children}: {children: ReactNode}) => {
  const ctx = useMetaContext()
  return (
    <Layout
      title={appFeaturesIndex.metaDashboard.name}
      loading={ctx.fetcher.loading}
      sidebar={<MetaSidebar/>}
    >{ctx.fetcher.get && children}
    </Layout>
  )
}