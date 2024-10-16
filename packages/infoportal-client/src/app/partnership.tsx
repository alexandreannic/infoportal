'use client'
import React from 'react'
import {Partnership} from '@/features/Partnership/Partnership'
import {ProtectRoute} from '@/core/Session/SessionContext'

const PartnershipPage = () => {

  return (
    <ProtectRoute>
      <Partnership/>
    </ProtectRoute>
  )
}

export default PartnershipPage