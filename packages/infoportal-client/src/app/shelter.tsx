'use client'
import React from 'react'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Shelter} from '@/features/Shelter/Shelter'

const ShelterPage = () => {

  return (
    <ProtectRoute>
      <Shelter/>
    </ProtectRoute>
  )
}

export default ShelterPage