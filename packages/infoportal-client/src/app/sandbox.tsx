'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Sandbox} from '@/features/Sandbox'
import {MetaDashboardProvider} from '@/app/meta/MetaContext'

const Page = () => {

  return (
    <ProtectRoute>
      <MetaDashboardProvider>
        <Sandbox/>
      </MetaDashboardProvider>
    </ProtectRoute>
  )
}

export default Page