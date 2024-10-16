'use client'
import React from 'react'
import {Home} from '@/features/Home/Home'
import {ProtectRoute} from '@/core/Session/SessionContext'

const Index = () => {
  return (
    <ProtectRoute>
      <Home/>
    </ProtectRoute>
  )
}

export default Index