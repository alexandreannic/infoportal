'use client'
import {Mpca} from '@/features/Mpca/Mpca'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'

const MpcaPage = () => {

  return (
    <ProtectRoute>
      <Mpca/>
    </ProtectRoute>
  )
}

export default MpcaPage