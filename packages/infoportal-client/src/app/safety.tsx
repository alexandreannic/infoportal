'use client'
import React from 'react'
import {Safety} from '@/features/Safety/Safety'
import {ProtectRoute} from '@/core/Session/SessionContext'

const SafetyPage = () => {
  return (
    <ProtectRoute>
      <Safety/>
    </ProtectRoute>
  )
}

export default SafetyPage