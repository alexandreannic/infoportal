'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Meal} from '@/features/Meal/Meal'

export default () => {
  return (
    <ProtectRoute>
      <Meal/>
    </ProtectRoute>
  )
}
