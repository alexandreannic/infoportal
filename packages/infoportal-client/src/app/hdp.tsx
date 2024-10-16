'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'

const HdpPage = () => {
  return (
    <ProtectRoute>
      <div>In dev</div>
    </ProtectRoute>
  )
}

export default HdpPage