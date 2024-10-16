'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Admin} from '@/features/Admin/Admin'

const Adminpage = () => {
  return (
    <ProtectRoute>
      <Admin/>
    </ProtectRoute>
  )
}

export default Adminpage