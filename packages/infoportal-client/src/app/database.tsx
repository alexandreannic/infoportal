'use client'
import React from 'react'
import {Database} from '@/features/Database/Database'
import {ProtectRoute} from '@/core/Session/SessionContext'

const DashboardProtectionHouseholdSurvey = () => {
  return (
    <ProtectRoute>
      <Database/>
    </ProtectRoute>
  )
}

export default DashboardProtectionHouseholdSurvey