'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Cfm} from '@/features/Cfm/Cfm'

const CfmPage = () => {

  return (
    <ProtectRoute>
      <Cfm/>
    </ProtectRoute>
  )
}

export default CfmPage