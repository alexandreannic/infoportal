'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {ActivityInfo} from '@/features/ActivityInfo/ActivityInfo'

const _ = () => {
  return (
    <ProtectRoute>
      <ActivityInfo/>
    </ProtectRoute>
  )
}

export default _