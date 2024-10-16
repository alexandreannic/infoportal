'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Protection} from '@/features/Protection/Protection'

const Page = () => {
  return (
    <ProtectRoute>
      <Protection/>
    </ProtectRoute>
  )
}

export default Page