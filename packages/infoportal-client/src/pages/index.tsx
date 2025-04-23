import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Database} from '@/features/Database/Database'

const Index = () => {
  return (
    <ProtectRoute>
      <Database />
    </ProtectRoute>
  )
}

export default Index
